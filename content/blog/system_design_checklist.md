
---
title: "how to Approach to System Design Questions"
date: 2025-04-08
description: "Thinking checklist during System Design Problems"
tags: ["system-design", "distributed-systems", "architecture","observability"]
categories: ["System Design"]
draft: false
---

## Main Topics to Think about for "System Design"
- UI(in general what are the interfaces, mobile, website, their brief security big picture)
- API level -- make the path for each along with their protocols, or HTTP methods.
  - design the functionality based on requierments
    - Need stats per each Id or in general?
    - Need Id for a window of time? pass start and end or window
    - base64 is preferred to handle characters.
    - add the HTTP Method properly for each api
    - Need DELETE and UPDATE as well?
  - what protocol is better? HTTP or gRPC or Avro? webSocket?
- data modeling
  - if needs SQL RDBMS -- find if they need solid database and ACID features
  - if needs NOSQL DB -- they need document based(graph or documents or unstructured data) 
  - if needs VectorDB -- storing document in chunk
    - chunking strategy comes into picture
    - usually hybrid is a safe way to do
  - what are the main functionality from API level
    - can you break down into component level
  - Design-Paradigm: componenets Connectivity 
    - event-based: are they async without delay or listening (pub/sub model)
      - then you can use even mechanisem and topics like: rabbitMq, redis or kafka + zookeeper
    - real-time: http or gRPC calls
    - real-time bu async: using webSocket to open a channel in birectional?
    - file-based: using S3 buckets or BLOB storage ( parquete files)
    - do you need batch processing logic?
    - do you need function based logic ( lambda or Azure functions)
  - do you need CDN
    - to load files ( content is video or images, are they large files to be loaded on client side?)
  - do you need NAS?
  - do you need SFTP connections?
  - do you need Main frame connectivity (SCP?)
  - do you need DNS records updated?
    - how API gateway is working there?
  - do you need CQRS? seperate write from read?
  - do you need caching?
    - think about layers differently?
  - Where to put observability?
    - what logs to gather?
    - what metrics to capture?
    - what events are important?
    - how to paint the profile/context big picture?
    - how to handle the anomalies/incidents?
    - 