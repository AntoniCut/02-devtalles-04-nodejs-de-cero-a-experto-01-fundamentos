/*
    *  ---------------------  *
    *  -----  app2.js  -----  *
    *  ---------------------  *
*/


console.clear();
console.log('-------------------------------');
console.log('----------  app2.js  ----------')
console.log('-------------------------------\n\n');


const fs = require('fs');


/** -----  leer un archivo  ----- */
const ejercicioReact = fs.readFileSync('./ejercicio-react.md', 'utf-8');
console.log('Archivo original => \n\n\n', ejercicioReact);


/** -----  reemplazar texto en el archivo  ----- */
const newData = ejercicioReact.replace(/React/ig, 'Angular');


/** -----  escribir un nuevo archivo con los cambios */
fs.writeFileSync('./ejercicio-angular.md', newData);


/** -----  leer el nuevo archivo  ----- */
const ejercicioAngular = fs.readFileSync('./ejercicio-angular.md', 'utf-8');
console.log('\n\n\nArchivo modificado => \n\n\n', ejercicioAngular);
