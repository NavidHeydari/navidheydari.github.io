---
title: "How to Approach to System Design Questions"
date: 2025-04-08
description: "Thinking checklist during System Design Problems"
tags: ["system-design", "distributed-systems", "architecture","observability"]
categories: ["System Design"]
draft: false
---

# Architecting for Scale: The Ultimate System Design Checklist

Whether you are prepping for a high-stakes technical interview or architecting a new production service, the "blank whiteboard" problem is real. System design isn't just about drawing boxes; it's about making intentional, defensible trade-offs.

To keep your thoughts organized, I’ve broken down the essential system design components into a repeatable framework. Use this to ensure no stone is left unturned.

---

## 1. The Interface Layer (UI & Security)
Before diving into the backend, define how the user interacts with your system and how you protect that entry point.
* **Platform Scope:** Is this a mobile-first experience, a responsive web app, or a CLI? Each has different latency expectations.
* **Security Big Picture:** * Implement **OAuth2/OIDC** for authentication.
    * Use **JWTs** for stateless session management.
    * Protect against common vulnerabilities like **XSS, CSRF, and SQL Injection** at the gateway level.

## 2. API Design & Requirements
Your API is the contract between your service and the world. 
* **Requirement Mapping:** * **Data Granularity:** Do you need stats per unique ID or aggregate global data?
    * **Time Management:** For time-series data, should the API accept a `start/end` timestamp or a sliding `window`?
    * **Encoding:** Use **Base64** for IDs or data blobs to safely handle special characters in URLs.
* **Methodology:** Ensure strict adherence to HTTP semantics (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
* **Protocol Selection:** * **REST/HTTP:** Standard for public-facing web APIs.
    * **gRPC/Avro:** Ideal for high-performance, low-latency internal microservice communication.
    * **WebSockets:** Essential for bi-directional, real-time features like chat or live dashboards.

## 3. Data Modeling Strategy
Choosing a database is about more than just "SQL vs. NoSQL."
* **Relational (RDBMS):** Choose this when you need **ACID compliance**, complex joins, and structured data.
* **NoSQL:** Use for unstructured data, high-velocity writes, or horizontal scaling (Document, Graph, or Key-Value).
* **Vector Databases:** If building AI-powered features (like RAG), focus on your **chunking strategy**. 
    * *Tip:* A **hybrid search** approach (vector similarity + keyword search) is usually the most robust.

## 4. Communication & Connectivity Paradigms
How components interact defines the scalability and "loose coupling" of your system.
* **Event-Driven (Async):** Use Pub/Sub models (**Kafka, RabbitMQ, or Redis**) to decouple services and handle bursts in traffic.
* **Real-Time (Sync):** Standard Request-Response via HTTP or gRPC.
* **File-Based Storage:** Use **S3 or BLOB storage** for large assets. Consider **Parquet** files for efficient analytical processing.
* **Compute Logic:** Decide between persistent servers or event-triggered **Serverless Functions** (AWS Lambda / Azure Functions) for batch processing.

## 5. Infrastructure & Advanced Optimization
This is where you scale from "it works" to "it's enterprise-grade."
* **Content Delivery:** Use a **CDN** to offload large files (videos/images) and reduce edge latency.
* **Traffic Management:** How is your **API Gateway** handling DNS updates, rate limiting, and request routing?
* **Enterprise Integration:** Do you need **SFTP** for third-party data or **Mainframe/SCP** connectivity?
* **Performance Patterns:**
    * **CQRS:** Separate "Write" models from "Read" models to optimize high-traffic systems.
    * **Caching Strategy:** Implement layers at the Client, CDN, and Database level (Redis).

## 6. Observability: The Production-Ready Test
A system is only as good as your ability to debug it when things go wrong.
* **Logs:** Centralize logs for traceability (ELK/Splunk).
* **Metrics:** Capture the "Golden Signals": Latency, Traffic, Errors, and Saturation.
* **Incident Management:** Define how the system detects anomalies and paints the "context big picture" for on-call engineers.

---

### Final Thought
In an interview, **communication is key.** In production, **reliability is king.** By following this checklist, you demonstrate that you aren't just thinking about the code—you're thinking about the entire ecosystem.