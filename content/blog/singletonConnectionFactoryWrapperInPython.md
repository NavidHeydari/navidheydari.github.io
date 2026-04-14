---
title: "Python Design Pattern - Factory and Singleton along with Callable Wrappers"
date: 2026-04-10
description: "Developing a connection Factory Wrapper to holds the singleton opject for heavy Object creation along with make it callable and also handle Multi-threading in python using Rlock."
tags: ["python", "design-pattern","distributed-systems"]
categories: ["python"]
draft: false
---

## Singleton Connection Cache — Design Notes

### Overview

The pattern wraps a **connection factory** in a callable-class decorator.
Every unique call signature `(host, port)` maps to exactly one live
connection object.  Subsequent calls return the cached object directly.
All cache mutations are serialised through a single `RLock`.

```
Thread A ──► get_connection("db-primary", 5432)
                     │
              ┌──────▼──────┐
              │ SingletonCache│   ◄── RLock guards all reads/writes
              │  _cache dict  │
              └──────┬──────┘
          hit ◄──────┴──────► miss → FakeDBConnection(...)
```

---

### Architecture Decisions

#### Double-Checked Locking in `__call__`

```python
## ① fast path — return immediately if cached
with self._lock:
    if key in self._cache:
        return self._cache[key]

## ② slow path — factory call OUTSIDE the lock
new_conn = self._func(*args, **kwargs)   ## network I/O here

## ③ re-acquire and check again before storing
with self._lock:
    if key not in self._cache:
        self._cache[key] = new_conn
    else:
        _safe_close(new_conn)            ## discard the race-condition duplicate
    return self._cache[key]
```

**Why release the lock during the factory call?**
Connection handshakes are slow (10–500 ms).  Holding the lock during I/O
would block every other thread — including threads requesting a completely
different endpoint.  The double-check on re-entry prevents two racing
threads from storing two connections for the same key.

---

### `RLock` vs `Lock`

| | `threading.Lock` | `threading.RLock` |
|---|---|---|
| **Re-entrant** | ❌ Deadlocks if the same thread acquires twice | ✅ Same thread can acquire N times |
| **Ownership tracking** | None | Tracks owning thread + recursion depth |
| **Performance** | ~5–10% faster | Slightly slower (ownership bookkeeping) |
| **Release rule** | Any thread can release | Only the owning thread can release |
| **Use case** | Simple guards, no nested locking | Recursive algorithms, `__del__` safety |

### Why `RLock` is the right choice here

1. **`evict_object` calls `_safe_close` outside the lock** — but if a
   connection's `.close()` method ever calls back into the factory
   (re-requesting the same connection), a plain `Lock` would deadlock.
   `RLock` lets the same thread re-enter safely.

2. **`__del__` acquires the lock directly** via `lock.acquire()`.
   During interpreter shutdown the GC may call `__del__` on objects in
   an arbitrary order.  If another method on the same thread is still
   inside a `with self._lock` block, `RLock` allows the destructor to
   proceed; `Lock` would deadlock silently.

3. **No meaningful performance cost at this scale.** Connection cache
   operations are dominated by network I/O (milliseconds), not lock
   overhead (nanoseconds).

### When to prefer plain `Lock`

- The critical section is very tight and called millions of times per second.
- You are certain no re-entry will ever occur.
- You want accidental re-entry to surface as a deadlock (fail-loud).

---

## Callable Class vs `functools.wraps`

### Callable Class (`SingletonCache`)

```python
@SingletonCache
def get_connection(host, port): ...
```

`get_connection` is now an **instance of `SingletonCache`**, not a function.

| Aspect | Detail |
|---|---|
| **State** | Lives on `self._cache` — explicit, inspectable, testable |
| **Extensibility** | Subclass to add TTL, LRU eviction, metrics, circuit-breaker |
| **`__del__`** | Natural — Python calls it when the instance is GC-collected |
| **`isinstance(fn, FunctionType)`** | `False` — breaks naive introspection |
| **`inspect.isfunction()`** | `False` |
| **Signature visibility** | Requires manually copying `__name__`, `__doc__`, etc. |
| **Type checker support** | Partial — mypy/pyright may not infer return type from `__call__` |

### `functools.wraps` Closure

```python
@singleton_cache          ## returns a plain function
def get_connection(host, port): ...
```

`get_connection` remains a **real function object**.

| Aspect | Detail |
|---|---|
| **State** | Lives in the closure — hidden unless explicitly attached to `wrapper` |
| **Extensibility** | Nest more decorators; rewriting the function for new behaviour |
| **`__del__`** | ❌ Not available on plain dicts or closures |
| **`isinstance(fn, FunctionType)`** | `True` |
| **`inspect.isfunction()`** | `True` |
| **`__wrapped__`** | Set automatically — `inspect.unwrap()` reaches the original |
| **Type checker support** | Excellent — full inference of args and return type |

## Decision Guide

```
Does the cached object need lifecycle management (.close(), __del__)?
    YES → Callable class
        Does behaviour need to evolve (TTL, LRU, metrics)?
            YES → Callable class (subclass)
            NO  → Callable class (simpler)
    NO  → functools.wraps is sufficient

Is this library code consumed by type-checked callers?
    YES → functools.wraps (better inference)
    NO  → either works
```

---

## Eviction Strategy

| Method | Complexity | Use when |
|---|---|---|
| `evict(*args, **kwargs)` | O(1) | You know the original call arguments |
| `evict_object(obj)` | O(n) | You have the object but not its arguments |
| `clear()` | O(n) | Teardown / connection pool recycling |
| `__del__` | O(n) | Automatic GC cleanup |

`evict_object` uses `is` (identity) rather than `==` (equality) to avoid
accidental eviction when a custom `__eq__` considers two different
connections equal (e.g. same host/port but different socket handles).

---

### `__del__` Safety Rules

1. **Never raise** — exceptions in `__del__` are printed to stderr and
   swallowed; they cannot be caught by callers.
2. **Use `getattr` with defaults** — `__del__` can be called even if
   `__init__` raised mid-way, leaving attributes unset.
3. **Acquire the lock manually** — `with self._lock` allocates a context
   manager object; during interpreter shutdown allocations may fail.
   `lock.acquire() / lock.release()` in a `try/finally` is safer.
4. **Close outside the lock when possible** — I/O in `.close()` should
   not hold the cache locked.  In `__del__` we snapshot the items,
   clear the dict, release the lock, then close each connection.


---

## Full Python Code Implementation

```python

class FakeDBConnection:
    _counter      = 0
    _counter_lock = threading.Lock()

    def __init__(self, host: str, port: int):
        with FakeDBConnection._counter_lock:
            FakeDBConnection._counter += 1
            self.id = FakeDBConnection._counter
        self.host   = host
        self.port   = port
        self.closed = False
        time.sleep(random.uniform(0.005, 0.015))    # simulate handshake latency
        print(f"  [conn #{self.id:02d}] OPENED  → {host}:{port}")

    def close(self):
        self.closed = True
        print(f"  [conn #{self.id:02d}] CLOSED  ← {self.host}:{self.port}")

    def __repr__(self):
        s = "closed" if self.closed else "open"
        return f"<FakeDBConnection #{self.id} {self.host}:{self.port} [{s}]>"


# ══════════════════════════════════════════════
# Decorated factory
# ══════════════════════════════════════════════

@SingletonCache
def get_connection(host: str, port: int = 5432) -> FakeDBConnection:
    """Return (or create) a singleton DB connection for (host, port)."""
    return FakeDBConnection(host, port)


# ══════════════════════════════════════════════
# Demo
# ══════════════════════════════════════════════

def separator(title: str):
    print(f"\n── {title} {'─' * (54 - len(title))}")

if __name__ == "__main__":
    print("═" * 60)
    print("  Thread-Safe Connection Singleton Cache — Full Demo")
    print("═" * 60)

    # 1. Singleton identity
    separator("1. Singleton identity")
    c1 = get_connection("db-primary", port=5432)
    c2 = get_connection("db-primary", port=5432)    # cache hit — no new conn
    c3 = get_connection("db-replica", port=5433)
    print(f"  c1 is c2 (same obj) → {c1 is c2}")
    print(f"  c1 is c3 (diff obj) → {c1 is c3}")
    print(f"  cache: {get_connection.cache_info()}")

    # 2. Evict by signature
    separator("2. evict() by call signature")
    evicted = get_connection.evict("db-replica", port=5433)
    print(f"  evicted : {evicted}")
    print(f"  cache   : {get_connection.cache_info()}")

    # 3. Evict by object identity
    separator("3. evict_object() by identity")
    found = get_connection.evict_object(c1)
    print(f"  removed c1? {found}  |  c1.closed={c1.closed}")
    print(f"  cache : {get_connection.cache_info()}")

    # 4. Concurrent stress test
    separator("4. Thread-safety stress test — 20 threads × 2 endpoints")
    results: list[FakeDBConnection] = []
    r_lock  = threading.Lock()

    def worker(host: str, port: int):
        conn = get_connection(host, port=port)
        with r_lock:
            results.append(conn)

    threads = (
        [threading.Thread(target=worker, args=("db-primary", 5432)) for _ in range(10)]
      + [threading.Thread(target=worker, args=("db-replica", 5433)) for _ in range(10)]
    )
    for t in threads: t.start()
    for t in threads: t.join()

    primary = {id(r) for r in results if r.host == "db-primary"}
    replica = {id(r) for r in results if r.host == "db-replica"}
    print(f"  db-primary distinct objects : {len(primary)} (expect 1)")
    print(f"  db-replica distinct objects : {len(replica)} (expect 1)")
    print(f"  cache : {get_connection.cache_info()}")

    # 5. Full teardown
    separator("5. clear() + __del__")
    removed = get_connection.clear()
    print(f"  clear() closed {removed} connection(s)")
    print(f"  cache : {get_connection.cache_info()}")

```