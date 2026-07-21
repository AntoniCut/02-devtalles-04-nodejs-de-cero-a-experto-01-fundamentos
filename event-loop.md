# El Event Loop en Node.js

Explicación detallada del diagrama **«El Event Loop sigue ciertas reglas»** (`event-loop.png`).

El Event Loop es el mecanismo que permite a Node.js ejecutar operaciones no bloqueantes (asíncronas) pese a que JavaScript es de un solo hilo. No “hace magia”: **recorre colas de callbacks en un orden fijo** y decide cuándo ejecutar cada una.

---

## Visión general del diagrama

El diagrama tiene dos partes que se leen juntas:

1. **A la izquierda:** 9 reglas que definen el orden de ejecución.
2. **A la derecha:** un ciclo con 4 fases principales y, en el centro, la **microtask queue**.

```
                    ┌─────────────────┐
                    │  timer queue    │
                    │ setTimeout /    │
                    │ setInterval     │
                    └────────┬────────┘
                             │
                             ▼AntoniCut/02-devtalles-04-nodejs-de-cero-a-experto-01-fundamentos
         ┌──────────────────────────────────┐
         │         microtask queue          │
         │  nextTick queue │ promise queue  │
         └──────────────────────────────────┘
              ▲                         │
              │                         ▼
┌─────────────┴──┐               ┌──────┴──────┐
│  close queue   │               │  I/O queue  │
│ close handlers │               │ I/O callbacks│
└────────────▲───┘               └──────┬──────┘
             │                          │
             │        I/O polling       │
             │                          ▼
             │                   ┌──────────────┐
             └───────────────────┤ check queue  │
                 continue/exit   │ setImmediate │
                                 └──────────────┘
```

### Idea clave

El bucle **no** es solo “timers → I/O → check → close”.

Después de casi cada fase (y a veces después de cada callback), Node.js vacía la **microtask queue**, que tiene prioridad sobre las siguientes fases del ciclo.

Dentro de las microtareas el orden es siempre:

1. **`process.nextTick`** (nextTick queue)
2. **Promesas** (promise queue: `.then`, `.catch`, `.finally`, `queueMicrotask`, etc.)

---

## Las colas (queues)

| Cola | Qué callbacks guarda | APIs típicas |
|------|----------------------|--------------|
| **timer queue** | Timers cuyo delay ya venció | `setTimeout`, `setInterval` |
| **I/O queue** | Resultados de operaciones de E/S | `fs.readFile`, red, etc. |
| **check queue** | Callbacks “inmediatos” tras el polling de I/O | `setImmediate` |
| **close queue** | Handlers de cierre de recursos | `socket.on('close')`, `server.close()` |
| **nextTick queue** | Microtareas de máxima prioridad | `process.nextTick()` |
| **promise queue** | Microtareas de promesas | `Promise.then`, `async/await` (tras el await) |

Las cuatro primeras forman el **ciclo macrotask** (fases del Event Loop).  
Las dos últimas forman la **microtask queue** (centro del diagrama).

---

## Las 9 reglas, paso a paso

Estas reglas describen **un tick completo** del Event Loop (un recorrido por las fases).

### 1. Callbacks en el microtask se ejecutan primero

Antes de entrar a fondo en las fases del ciclo (o al inicio del flujo relevante), si hay callbacks pendientes en la microtask queue, **se ejecutan primero**.

Orden interno:

1. Vaciar **nextTick queue**
2. Vaciar **promise queue**

Si un `nextTick` o una promesa encola otra microtarea, también se ejecuta **antes** de pasar a la siguiente fase.

> Prioridad: `process.nextTick` > promesas > timers / I/O / `setImmediate`.

---

### 2. Todos los callbacks dentro del timer queue se ejecutan

Se vacía (o se procesa) la **timer queue**:

- Callbacks de `setTimeout` / `setInterval` cuyo tiempo ya expiró.
- El orden entre varios timers con el mismo delay no está garantizado de forma estricta; en la práctica suelen ejecutarse en el orden en que se registraron, pero el Event Loop no promete precisión de reloj milimétrica.

Ejemplo relacionado con `app4.js`:

```js
console.log('Inicio de programa');

setTimeout(() => console.log('Primer Timeout'), 3000);
setTimeout(() => console.log('Segundo Timeout'), 1);
setTimeout(() => console.log('Tercer Timeout'), 0);

console.log('Fin de programa');
```

Salida esperada (simplificada):

```
Inicio de programa
Fin de programa
Segundo Timeout    // delay 1ms (cuando el timer ya venció)
Tercer Timeout     // delay 0ms
Primer Timeout     // delay 3000ms (en un ciclo posterior)
```

Lo síncrono (`console.log`) corre **antes** de cualquier timer. Los timers solo entran en la timer queue cuando su delay se cumple.

---

### 3. Tras los timers: otra vez microtasks

Después de los callbacks de timers:

1. Se ejecutan callbacks de **nextTick** (si hay).
2. Luego los de la **promise queue** (si hay).

Esto es lo que representan las flechas del diagrama desde cada fase hacia el centro (microtask queue).

---

### 4. Callbacks de I/O se ejecutan

Se procesa la **I/O queue**: callbacks de operaciones de entrada/salida que ya terminaron (lectura de archivo, sockets, etc.).

Entre I/O y la siguiente fase suele ocurrir el **I/O polling** (etiqueta del diagrama): Node.js pregunta al sistema operativo qué operaciones completaron y prepara sus callbacks para las colas correspondientes.

---

### 5. De nuevo microtasks (nextTick → promises)

Tras I/O (si hay callbacks o tras esa fase):

1. Microtasks de **nextTick**
2. Microtasks de **promesas**

Misma regla de prioridad que en los pasos 1 y 3.

---

### 6. Todos los callbacks en el check queue se ejecutan

Se vacía la **check queue**: callbacks registrados con `setImmediate`.

`setImmediate` se diseña para ejecutarse **después** del polling de I/O y **antes** de la fase de close (en el mismo ciclo, cuando aplica).

Comparación rápida:

| API | Fase aproximada |
|-----|-----------------|
| `setTimeout(fn, 0)` | timer queue |
| `setImmediate(fn)` | check queue |
| `process.nextTick(fn)` | microtask (antes que ambas) |

---

### 7. Microtasks después de cada callback del check queue

Detalle importante del diagrama (regla 7):

Tras **cada** callback de la check queue, se vuelven a drenar las microtasks:

1. nextTick
2. promises

No hace falta esperar a terminar **todos** los `setImmediate` para mirar microtasks: pueden intercalarse entre un `setImmediate` y el siguiente.

---

### 8. Todos los callbacks en el close queue se ejecutan

Se ejecutan los handlers de cierre: por ejemplo, cuando un socket o un servidor emite `'close'`.

Es la última fase “macrotask” del ciclo.

---

### 9. Última pasada de microtasks del mismo ciclo

Al final del ciclo, **una vez más**:

1. nextTick queue
2. promise queue

Después, la flecha **continue/exit** decide:

- **continue:** hay trabajo pendiente → nuevo ciclo (vuelve a timers).
- **exit:** no queda nada que hacer → el proceso de Node puede terminar.

---

## Flujo resumido de un ciclo

```
[ Microtasks: nextTick → promises ]
        ↓
[ Timer queue ]  →  [ Microtasks ]
        ↓
[ I/O queue ]    →  [ Microtasks ]   (+ I/O polling)
        ↓
[ Check queue ]  →  [ Microtasks tras cada CB ]
        ↓
[ Close queue ]  →  [ Microtasks ]
        ↓
[ ¿Hay más trabajo? ] → continue / exit
```

---

## Ejemplo mental con todas las piezas

```js
console.log('sync 1');

setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));

console.log('sync 2');
```

Orden típico (código síncrono primero, luego microtasks, luego fases del loop):

```
sync 1
sync 2
nextTick
promise
timeout      // o immediate; el orden entre timeout(0) e immediate
immediate    // puede variar según el contexto (main vs I/O callback)
```

Reglas útiles para razonar:

1. Todo lo **síncrono** del script principal corre primero.
2. Luego **microtasks** (`nextTick` antes que promesas).
3. Después entran las **fases** del Event Loop (timers, I/O, check, close), intercalando microtasks según las 9 reglas.

---

## Relación con el diagrama

| Elemento visual | Significado |
|-----------------|-------------|
| Caja central amarilla | Microtask queue (prioridad alta) |
| nextTick / promise | Orden interno de microtareas |
| Flechas hacia el centro | “Tras esta fase (o callback), drenar microtasks” |
| Ciclo clock-wise | Orden de fases macrotask |
| I/O polling | Esperar/recoger operaciones de E/S completadas |
| continue/exit | ¿Otro tick o terminar el proceso? |

---

## Resumen en una frase

El Event Loop de Node.js recorre **timers → I/O → check → close**, pero **entre medias (y con máxima prioridad) vacía siempre las microtasks**: primero `process.nextTick`, luego promesas — exactamente como muestran las 9 reglas del diagrama.

---

## Referencias del curso

- Diagrama: [`event-loop.png`](./event-loop.png)
- Timers en práctica: [`app4.js`](./app4.js)
- Documentación oficial: [Node.js — The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
