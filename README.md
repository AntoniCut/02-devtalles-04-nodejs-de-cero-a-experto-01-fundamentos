# 01 — Fundamentos de Node.js

Prácticas del módulo de fundamentos del curso **Node.js de Cero a Experto** (DevTalles).

Ejercicios introductorios sobre ejecución de JavaScript en Node, módulo `fs`, temporizadores y el Event Loop.

## Requisitos

- [Node.js](https://nodejs.org/) (recomendado LTS)
- [pnpm](https://pnpm.io/) (o npm)

## Instalación

```bash
pnpm install
```

## Scripts

| Comando | Archivo | Descripción |
|---------|---------|-------------|
| `pnpm run dev1` | `app1.js` | Primer programa: `console.log` y variables |
| `pnpm run dev2` | `app2.js` | Lectura/escritura de archivos con `fs` |
| `pnpm run dev3` | `app3.js` | Contar palabras en un archivo Markdown |
| `pnpm run dev4` | `app4.js` | Timers con `setTimeout` y orden de ejecución |

También puedes ejecutarlos directamente:

```bash
node app1.js
node app2.js
node app3.js
node app4.js
```

## Estructura del proyecto

```
01-fundamentos/
├── app1.js                 # Hola Mundo en Node.js
├── app2.js                 # fs: leer, reemplazar y escribir
├── app3.js                 # Contar palabras (React) en un .md
├── app4.js                 # setTimeout y orden asíncrono
├── ejercicio-react.md      # Archivo de entrada (app2 / app3)
├── ejercicio-angular.md    # Salida generada por app2
├── event-loop.png          # Diagrama del Event Loop
├── event-loop.md           # Explicación detallada del Event Loop
├── package.json
└── README.md
```

## Qué cubre cada app

### `app1.js` — Primer contacto

Imprime mensajes por consola y usa una variable. Sirve para comprobar que Node ejecuta el archivo correctamente.

### `app2.js` — Sistema de archivos

Usa `fs.readFileSync` / `fs.writeFileSync` para:

1. Leer `ejercicio-react.md`
2. Reemplazar `React` por `Angular`
3. Guardar el resultado en `ejercicio-angular.md`

### `app3.js` — Procesar texto

Lee `ejercicio-react.md` y cuenta apariciones de la palabra «React» con tres enfoques (`filter` + `includes`, `split`, expresión regular).

### `app4.js` — Timers

Muestra cómo el código síncrono corre antes que los callbacks de `setTimeout`, y cómo el delay afecta el orden en la **timer queue** del Event Loop.

## Event Loop

Documentación del diagrama del curso:

- Diagrama: [`event-loop.png`](./event-loop.png)
- Explicación: [`event-loop.md`](./event-loop.md)

## Autor

**AntonyDev**

## Licencia

ISC
