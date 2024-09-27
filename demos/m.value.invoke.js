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

// Usage Example
(async () => {
    const valueManager = createValueManager();

    // Set value with transformation (e.g., multiply by 2)
    await valueManager.setValue(42, (val) => val * 2);
    console.log(await valueManager.getValue()); // 84

    // Set value without transformation
    await valueManager.setValue(50);
    console.log(await valueManager.getValue()); // 50
})();
