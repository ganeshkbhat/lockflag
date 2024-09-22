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

module.exports = {
    "json": {
        "invokeWith": require("./m.json.js").nestedInvokeWith,
        "nested": require("./m.json.js").nested,
        "nonNested": require("./m.json.js").nonNested,
    },
    "value": require("./m.value.js")
}
