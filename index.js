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

const mutex = require("./src/index.js");

module.exports = {
    "json": {
        "invokeWith": mutex.json.nestedInvokeWith,
        "nestedInvokeWith": mutex.json.nestedInvokeWith,
        "nonNestedInvokeWith": mutex.json.nonNestedInvokeWith,
        "nested": mutex.json.nested,
        "nonNested": mutex.json.nonNested,
    },
    "array": {
        "queue": mutex.array.queue,
        "invokeWith": mutex.array.invokeWith
    },
    "value": mutex.value
}
