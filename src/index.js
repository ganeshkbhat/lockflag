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

const lk = require("./m.json.js")

module.exports = {
    "json": {
        "invokeWith": lk.nestedInvokeWith,
        "nested": lk.nested,
        "nonNested": lk.nonNested,
    },
    "value": require("./m.value.js")
}
