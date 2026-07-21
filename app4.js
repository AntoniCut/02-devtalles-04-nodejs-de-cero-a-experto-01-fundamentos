/*
    *  ---------------------  *
    *  -----  app4.js  -----  *
    *  ---------------------  *
*/


console.clear();
console.log('-------------------------------');
console.log('----------  app4.js  ----------');
console.log('-------------------------------\n\n');



//  -----  Aparece en 1º Lugar  -----
console.log('Inicio de programa');


//  -----  Aparece en 5ª Lugar  -----
setTimeout(() => {
    console.log('Primer Timeout');
}, 3000);


//  -----  Aparece en 3ª Lugar, antes que el Tercer Timeout  -----
setTimeout(() => {
    console.log('Segundo Timeout');
}, 1);


//  -----  Aparece en 4ª Lugar  -----
setTimeout(() => {
    console.log('Tercer Timeout');
}, 0);


//  -----  Aparece en 2ª Lugar  -----
console.log('Fin de programa');
