/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i xmutex --save
 * Github: https://github.com/ganeshkbhat/lockflag
 * npmjs Link: https://www.npmjs.com/package/xmutex
 * File: index.js
 * File Description: 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';

const mutex = require("../index");

// Usage Example
(async () => {
    const arrayManager = mutex.array.invokeWith();

    // Set value with transformation (e.g., multiply by 2)
    await arrayManager.setValue(0, 42, (val) => val * 2);
    console.log(await arrayManager.getValue(0)); // 84

    // Push value with transformation (e.g., append " world")
    await arrayManager.push('hello', (val) => val + ' world');
    console.log(await arrayManager.getAllValues()); // [ 84, 'hello world' ]

    // Shift value with transformation (e.g., convert to uppercase)
    const shiftedValue = await arrayManager.shift((val) => val.toString().toUpperCase());
    console.log(shiftedValue); // "84"

    // Remove value with transformation (e.g., reverse the string)
    const removedValue = await arrayManager.removeAt(0, (val) => val.split('').reverse().join(''));
    console.log(removedValue); // "dlrow olleh"

    console.log(await arrayManager.getAllValues()); // []
})();

