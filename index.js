/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i  --save
 * Github: https://github.com/ganeshkbhat/lockflag
 * npmjs Link: https://www.npmjs.com/package/
 * File: index.js
 * File Description: 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';

const mutex = require("./index.js");

module.exports = {
    "json": {
        "invokeWith": mutex.json.invokeWith,
        "nested": mutex.json.nested,
        "nonNested": mutex.json.nonNested,
    },
    "value": mutex.value
}
