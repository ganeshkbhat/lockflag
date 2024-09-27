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

const jk = require("./m.json.js");
const ak = require("./m.array.js");
const vk = require("./m.value.js");

module.exports = {
    "json": {
        "nestedInvokeWith": jk.nestedInvokeWith,
        "nonNestedInvokeWith": jk.nonNestedInvokeWith,
        "nested": jk.nested,
        "nonNested": jk.nonNested
    },
    "array": {
        "queue": ak.queue,
        "invokeWith": ak.invokeWith
    },
    "value": {
        "value": vk.value,
        "invokeWith": vk.invokeWith,
    }
}
