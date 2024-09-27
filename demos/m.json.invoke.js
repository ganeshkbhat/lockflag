



const mutex = require("../index");

// Usage
(async () => {
    const manager = mutex.json.nonNestedInvokeWith();

    console.log(await manager.getValue('key1')); // undefined

    await manager.setValue('key1', 42, (val) => { console.log("set value with transformer function: ", val); return val; }); // 
    await manager.setValue('key2', 'hello', (val) => { console.log("set value with transformer function:", val); return val; }); // 

    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello

    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();
