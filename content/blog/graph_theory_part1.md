---
title: "Graph Theory - Part 1 Optimizing Urban Connectivity"
date: 2024-11-15
description: "Graph theory p1 - MST"
tags: ["java-programming", "data-structure","graph","MST"]
categories: ["programming", "graphs"]
draft: false
---

## Graph Theory - Part 1 Optimizing Urban Connectivity 
### Problem Statement: A Mayor's Guide to Minimal Spanning Trees 

Imagine you are the mayor of a growing region consisting of several isolated cities. To foster economic growth and social cohesion, you must establish a road network that connects every city to one another. However, city budgets are tight. Each potential connection between two cities has a specific cost—determined by distance, terrain difficulty, and labor.

Objective: Design a network such that every city is reachable from every othercity (directly or indirectly) while minimizing the total construction cost.

In graph theory, this is known as finding the Minimum Spanning Tree (MST). We treat cities as vertices and potential roads as weighted edges.

The Algorithmic Approach: Prim’s Algorithm To solve this, we utilize Prim's Algorithm. It is a greedy approach that starts from an arbitrary city and repeatedly adds the cheapest connection to a new, unconnected city until the entire region is linked. 

---

### Complexity and Final Thoughts 
By using a Priority Queue, the time complexity is O(E log V), where E is the number of potential roads and V is the number of cities. This ensures that even for large metropolitan areas, the calculation remains efficient and calable. 

---

#### Java Implementation

```java

import java.util.*; 

public class CityConnect {

 static class Edge { 
int to, weight; 
public Edge(int to, int weight) {

 this.to = to; 
this.weight = weight; 



 } 
}

 public static int solveMST(int numCities, List<List<Edge>> adj) { 
PriorityQueue<Edge> pq = new 

PriorityQueue<>(Comparator.comparingInt(e -> e.weight)); 
boolean[] visited = new boolean[numCities]; 
int totalCost = 0; 
int edgesCount = 0;

 // Start from city 0 
pq.add(new Edge(0, 0));

 while (!pq.isEmpty()) { 
Edge current = pq.poll(); 
int u = current.to;

 if (visited[u]) continue;

 visited[u] = true; 
totalCost += current.weight; 
if (current.weight > 0) edgesCount++;

 for (Edge neighbor : adj.get(u)) { 
if (!visited[neighbor.to]) { 
pq.add(neighbor); 
} 
} 
}

 return edgesCount == numCities - 1 ? totalCost : -1; 
}

 public static void main(String[] args) { 
int cities = 4; 
List<List<Edge>> adj = new ArrayList<>(); 
for (int i = 0; i < cities; i++) adj.add(new ArrayList<>());

 // Example connections: City 0-1 (cost 10), 0-2 (6), 0-3 (5), 1-3 

(15), 2-3 (4) 
adj.get(0).add(new Edge(1, 10)); 
adj.get(1).add(new Edge(0, 10)); 
adj.get(0).add(new Edge(2, 6)); 
adj.get(2).add(new Edge(0, 6)); 
adj.get(0).add(new Edge(3, 5)); 



adj.get(3).add(new Edge(0, 5)); 
adj.get(2).add(new Edge(3, 4)); 
adj.get(3).add(new Edge(2, 4));

 int minCost = solveMST(cities, adj); 
System.out.println("The minimum cost to connect all cities is: " + 
minCost); 
} 
} 
```


