---
title: "System Design: Large-Scale Sensor Data Ingestion"
date: 2024-12-15
description: "Architecture for ingesting real-time temperature data from 1 million sensors, serving a live heatmap and historical aggregations at scale."
tags: ["system-design", "distributed-systems", "architecture", "data-engineering"]
categories: ["System Design"]
draft: false
---

## Problem Statement

Design a system that collects real-time temperature readings from a very large number of sensors distributed across a large geographic area, and serves both real-time and historical views of that data to users.

The system covers an area roughly the size of the State of Washington (~100,000 sq mi). We deploy **1 million temperature sensors** — roughly 10 per square mile — enough for a high-resolution temperature map.

> **Goal:** Ingest sensor data reliably at scale and serve low-latency reads. Weather forecasting and prediction are out of scope.

---

## Constraints & Scale

**Inputs**

- 1M temperature sensors, uniformly distributed
- Sensors have HTTP connectivity (solar powered)
- Each reading: `{ sensor_id, timestamp, temperature_value }` — plus optional metadata (geo-coordinates, battery level)
- Reading frequency: every **10 seconds** per sensor

**Back-of-envelope**

| Metric | Value |
|---|---|
| Sensors | 1,000,000 |
| Read interval | 10 seconds |
| Writes/sec (steady state) | ~100,000 |
| Payload size | ~100 bytes / event |
| Ingestion throughput | ~10 MB/s |
| Daily data volume | ~864 GB/day |

**Outputs**

1. **Real-time heatmap** — most recent reading per sensor, accurate to the last minute
2. **Aggregated statistics** — per-sensor `min` / `max` over day, month, or year windows

---

## High-Level Architecture

```
Sensors (1M)
    │  HTTP POST
    ▼
[Load Balancer]
    │
    ▼
[Ingestion Service]  ──►  [Kafka — readings.raw]
                                │
              ┌─────────────────┴────────────────────┐
              ▼                                       ▼
   [Stream Consumer]                      [Batch Aggregator]
   (upsert latest value)               (rolling min/max windows)
              │                                       │
              ▼                                       ▼
   [Hot Store — Redis]               [Cold Store — TimescaleDB / S3]
              │                                       │
              └──────────────┬────────────────────────┘
                             ▼
                      [Query Service]
                             │
                             ▼
                      [Web / Heatmap UI]
```

---

## Component Design

### 1. Ingestion Layer

**Push vs Pull:** Push is the right call. Polling 1M sensors on a pull schedule requires complex orchestration and hot-spots the sensors unevenly. Sensors push via `HTTP POST` to a fleet of stateless ingestion nodes behind a load balancer.

**API contract:**
```json
POST /v1/readings
{
  "sensor_id": "s-4829301",
  "timestamp": 1734912000,
  "temperature": 18.4,
  "lat": 47.603,
  "lon": -122.335
}
```

Ingestion nodes are fully stateless — validate, enrich (attach region tag), and immediately publish to Kafka. No DB writes in the hot path.

### 2. Message Queue (Kafka)

Kafka decouples ingestion from storage and fans out to multiple consumers independently:

- **Partition key:** `sensor_id` — preserves order per sensor, avoids re-ordering issues downstream
- **Topic retention:** 24 hours — enough replay buffer for consumer lag and incident recovery
- **Topics:** `readings.raw` (raw events), `readings.aggregated` (computed windows)

At 100K events/s × 100 bytes ≈ 10 MB/s, a single well-sized Kafka cluster handles this comfortably.

### 3. Hot Store — Real-Time Heatmap (Redis)

A stream consumer reads `readings.raw` and upserts the latest reading per sensor:

```
HSET sensor:{sensor_id}  temp 18.4  ts 1734912000  lat 47.603  lon -122.335
EXPIRE sensor:{sensor_id} 120
```

The **2-minute TTL** ensures stale sensors are automatically excluded from the live map. The heatmap UI queries a geo-bounded list of sensor IDs, then pipelines Redis reads for all of them — sub-millisecond per sensor.

Redis handles millions of small hashes in-memory without breaking a sweat. At ~250 bytes per sensor × 1M sensors ≈ 250 MB — easily fits in a single node; cluster-mode available when it grows.

### 4. Cold Store — Historical Aggregations (TimescaleDB)

A batch aggregator (Flink or Spark Structured Streaming) consumes from Kafka and maintains rolling `min` / `max` per sensor per time window:

- **Daily:** running min/max updated as events arrive
- **Monthly / Yearly:** scheduled materialization jobs built from the daily table

```sql
CREATE TABLE sensor_stats (
  sensor_id    TEXT          NOT NULL,
  window_type  TEXT          NOT NULL,  -- 'day' | 'month' | 'year'
  window_start TIMESTAMPTZ   NOT NULL,
  min_temp     FLOAT         NOT NULL,
  max_temp     FLOAT         NOT NULL,
  PRIMARY KEY (sensor_id, window_type, window_start)
);

SELECT create_hypertable('sensor_stats', 'window_start');
```

TimescaleDB's automatic time partitioning keeps query performance stable even as the table grows into hundreds of billions of rows. For archival (raw history), events are also written to **S3 in Parquet** format, partitioned by `date/region`.

### 5. Query Service

A thin REST API behind the UI:

| Endpoint | Data source | Latency target |
|---|---|---|
| `GET /heatmap/live` | Redis | < 50 ms |
| `GET /sensor/{id}/stats?window=day` | TimescaleDB | < 100 ms |
| `GET /sensor/{id}/stats?window=month` | TimescaleDB | < 200 ms |
| `GET /sensor/{id}/stats?window=year` | TimescaleDB / S3 | < 500 ms |

---

## Key Trade-offs

| Decision | Alternative | Rationale |
|---|---|---|
| Push model | Pull/polling | Simpler at 1M sensors; avoids orchestration and hot-spot risk |
| Kafka as buffer | Direct DB writes | Decouples ingestion spikes; enables consumer replay and fan-out |
| Redis for live data | Cassandra | Sub-ms upsert + read; TTL-based staleness is a natural fit |
| TimescaleDB for aggregates | DynamoDB | Native time-series compression and SQL aggregation functions |
| Stateless ingestion nodes | Stateful shards | Trivial horizontal scaling; no sticky routing required |

---

## Scaling Considerations

- **Ingestion:** Nodes are stateless — scale horizontally behind the load balancer
- **Kafka partitions:** Start at 100 partitions; rebalance as throughput grows
- **Redis:** Shard by `sensor_id` range when hot store exceeds single-node capacity
- **Geographic sharding:** For global deployments, run a full ingestion + hot store stack per region; aggregate cross-region in the query layer
- **Backpressure:** Kafka consumer lag is the natural signal; auto-scale consumers via KEDA
- **Cost:** S3 archival at ~$0.023/GB/month keeps long-term storage costs low; only promote to TimescaleDB what needs fast aggregation queries
