---
title: "Graph Theory - Part 2 Add More Restrictions and Rules"
date: 2024-11-20
description: "Graph theory p2 - Some Restrictions getting applied"
tags: ["java-programming", "data-structure","graph","MST"]
categories: ["programming", "graphs"]
draft: false
---

## Graph Theory - Part 2 

### Problem Statement
Assume the same generic provously posed still reside, there is a mayor and he has several cities, but NOW the challenge is not the cheapest way to connect them, but the "total cost of infrastructure" matters and the goal is to keep it as low as possible. The way to priotorize and calculate that cost is the actual challenge.

### List The Challenges
1. MST (Minimum Spanning Tree): Connecting all cities with the lowest total infrastructure cost.
2. Graph Coloring: Assigning channels/frequencies so that adjacent cities don't interfere.

## Detect MST vs. Graph-Coloring?
How to identify which algorithm to use:

1. Look at the Objective:
   - MST: The goal is CONNECTIVITY and COST MINIMIZATION. You want to touch every node using the fewest/cheapest edges.
   - COLORING: The goal is INDEPENDENCE and CONFLICT RESOLUTION. You want to partition nodes into sets (colors) so that no two nodes in the same set are connected.

2. Look at the Constraints:
   - MST: Usually involves "weights" on edges. You are looking for a subset of edges.
   - COLORING: Usually involves "constraints" between neighbors. You are looking for an attribute (label/color) for the nodes.

### Example Scenarios:
- Scenario A: "You need to lay fiber optic cable between 10 data centers using the least amount of cable possible." -> This is MST (Kruskal's or Prim's).
- Scenario B: "You have 10 data centers. Some are too close and will overheat if both run at 100% capacity simultaneously. Assign time slots so no two 'close' centers run at 100% at the same time." -> This is GRAPH COLORING.

----------------------------------------------------

#### SECTION: THE TRADE-OFFS OF THE BACKTRACKING SOLUTION

In the provided Java solution, we used a Backtracking approach. Here are the critical trade-offs:

1. Time Complexity vs. Accuracy:
   - Trade-off: Backtracking guarantees the optimal (minimum) number of colors, but it is O(K^V).
   - Consequence: For a city network of 100+ cities, this code may never finish. In real-world systems, we often trade "perfection" for "speed" by using Greedy Heuristics (which color the graph quickly but might use more colors than necessary).

2. Memory vs. Search Space:
   - Trade-off: The algorithm uses very little memory (O(V) for the recursion stack). 
   - Consequence: While memory-efficient, it does a lot of redundant work. We could trade memory for speed by using "Memoization" or "Pruning" (storing failed states) to avoid re-exploring dead ends.

3. Completeness:
   - Trade-off: This is an "Exact" algorithm. 
   - Consequence: It is computationally expensive. For NP-Complete problems like this, the major architectural trade-off is deciding between an Exact solution (Backtracking) and an Approximate solution (Genetic Algorithms or Simulated Annealing).

---

#### "The Chromatic Number Constraint with Backtracking Optimization"

### Solution Complexity Analysis
- Time Complexity: O(K^V), where V is the number of vertices and K is colors. 
- Space Complexity: O(V) for the recursion stack and the color assignment array.
- Note: This problem is NP-Complete, meaning no polynomial-time solution is known for finding the minimum K.

---

## Java Imple.

```java
import java.util.*;

public class GraphColoringSolver {
    private int numCities;
    private int[] colors;
    private int[][] graph;
    private int k;

    public GraphColoringSolver(int[][] adjMatrix, int k) {
        this.numCities = adjMatrix.length;
        this.graph = adjMatrix;
        this.k = k;
        this.colors = new int[numCities];
    }

    public boolean solve() {
        if (backtrack(0)) {
            printSolution();
            return true;
        } else {
            System.out.println("No solution exists with " + k + " colors.");
            return false;
        }
    }

    private boolean backtrack(int v) {
        // Base Case: All cities are assigned a color
        if (v == numCities) return true;

        // Try different colors for city 'v'
        for (int c = 1; c <= k; c++) {
            if (isSafe(v, c)) {
                colors[v] = c;

                // Recur to assign colors to the rest of the cities
                if (backtrack(v + 1)) return true;

                // Backtrack: Reset if assigning color 'c' doesn't lead to a solution
                colors[v] = 0;
            }
        }
        return false;
    }

    private boolean isSafe(int v, int c) {
        for (int i = 0; i < numCities; i++) {
            if (graph[v][i] == 1 && c == colors[i]) {
                return false;
            }
        }
        return true;
    }

    private void printSolution() {
        System.out.println("Frequency Assignment successful:");
        for (int i = 0; i < numCities; i++) {
            System.out.println("City " + i + " -> Channel " + colors[i]);
        }
    }

    public static void main(String[] args) {
        // Adjacency Matrix representation
        int[][] cityConnections = {
            {0, 1, 1, 1},
            {1, 0, 1, 0},
            {1, 1, 0, 1},
            {1, 0, 1, 0}
        };
        int k = 3; // Number of available channels

        GraphColoringSolver solver = new GraphColoringSolver(cityConnections, k);
        solver.solve();
    }
}

```
