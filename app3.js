/*
    *  ---------------------  *
    *  -----  app3.js  -----  *
    *  ---------------------  *
*/


// @ts-check

console.clear();
console.log('-------------------------------');
console.log('----------  app3.js  ----------');
console.log('-------------------------------\n\n');


const fs = require('fs');


/** ----- Leer el archivo ejercicio-react.md de forma síncrona ----- */
const content = fs.readFileSync('./ejercicio-react.md', 'utf-8');

/** ----- Nº total de palabras en el archivo ejercicio-react.md   ----- */
const wordCount = content.split(/\s+/).length;
console.log('Total de Palabras leídas del archivo ejercicio-react.md:', wordCount);



//*  ----- Nº de veces que aparece la palabra "React" (case insensitive)  -----


/** -----  Normalizamos el contenido pasando a minusculas  ----- */
const contentLower = content.toLowerCase();

/** -----  Separamos el contenido en palabras usando expresiones regulares  ----- */
const words = contentLower.split(/\s+/);


/**
 * -------------------
 * ----- Forma 1 -----
 * -------------------
 * Cuenta palabras que CONTIENEN "react"
 */

const reactWordCount1 = words
    .filter(word => word.toLowerCase()
    .includes('react')).length;
  

/**
 * -------------------
 * ----- Forma 2 -----
 * -------------------
 * Cuenta apariciones del TEXTO "react"
 * dentro de todo el contenido
 */

const reactWordCount2 = contentLower.split('react').length - 1;


/**
 * -------------------
 * ----- Forma 3 -----
 * -------------------
 * Usa expresiones regulares para contar
 * SOLO la palabra "react" completa
 */

const reactWordCount3 = (content.match(/\breact/gi) ?? []).length;


//  ----- Resultados por consola -----

console.log(
    'Palabras "React" - Forma 1 (filter e includes) =>',
    reactWordCount1
);

console.log(
    'Palabras "React" - Forma 2 (split) =>',
    reactWordCount2
);

console.log(
    'Palabras "React" - Forma 3 (RegExp) =>',
    reactWordCount3
);

