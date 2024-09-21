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
        "invokeWith": require("./m.json.invoke.with.js"),
        "nested": require("./m.json.js").createObjectManagerNested,
        "nonNested": require("./m.json.js").createObjectManagerJson,
    },
    "value": require("./m.value.js")
}
