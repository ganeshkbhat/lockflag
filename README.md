# lockflag
javascript based lockflag is a mutex like is a simple mutually exclusive flag or MuTex with internal auto acquire/release while setting value or alternatively use the acquire and release function manually. 

<b>ps</b>: if you wish to use the acquire and release functions manually use the same setter functions with the last argument of auto with a false value.

##### for example: 
if manager is the mutex function you are using like this `manager.setValue(42)` please use the same function like this `manager.setValue(42, false)` to use the acquire and release functions manually. 


the `last argument of all setter functions` (including `setValue`, `push`, `removeAt`, `shift`) has a variable argument called `auto` set with a `default true`, which `allows the setter functions to be used directly safely assuming the acquire and release functions will be called automatically`. 



method implementation with auto definition, `auto default` is `true`:

`(method) setValue(auto?: boolean): Promise<any>`



method implementation with valueTransformer with auto definition, `auto default` is `true`:

`(method) setValue(valueTransformer?: (val: any) => any, auto?: boolean): Promise<any>`


### List of implementations:

- value based mutex 
- value based with invoke function mutex
- json single value mutex 
- json single value with invoke function mutex
- json nested value mutex 
- json nested value with invoke function mutex
- semaphore array queue 
- semaphore array queue with invoke function mutex 


### Usage of package

```
const mutex = require("xmutex");
const manager = mutex.value();
```


### Exports of package

```
"json": {
    "invokeWith": mutex.json.nestedInvokeWith,
    "nestedInvokeWith": mutex.json.nestedInvokeWith,
    "nonNestedInvokeWith": mutex.json.nonNestedInvokeWith,
    "nested": mutex.json.nested,
    "nonNested": mutex.json.nonNested
},
"array": {
    "queue": mutex.array.queue,
    "invokeWith": mutex.array.invokeWith
},
"value": mutex.value
```


### value based mutex

```
(async () => {
    const manager = mutex.value.value();
    console.log(await manager.getValue()); // null
    await manager.setValue(42);
    console.log(await manager.getValue()); // 42
})();
```


### value based mutex with manual acquire and release functions

if manager is the mutex function you are using like this `manager.setValue(42)` please use the same function like this `manager.setValue(42, false)` to use the acquire and release functions manually. 

```
// if you are using the manual acquire and release functions 
//      you may use the same functions with a auto flag 
//      as the last argument 

(async () => {
    const manager = mutex.value.value();
    console.log(await manager.getValue()); // null
    const release = await manager.acquire();
    await manager.setValue(42, false);
    await manager.setValue(41, false);
    console.log(await manager.getValue()); // 41
    release();
    console.log(await manager.getValue()); // 41
    try {
        await manager.setValue(34, false);
    } catch(e) {
        console.log("ERROR LOG: ", e);
    } finally {
        console.log("\nThe was an demo or an example of acquire lock manually used");
    }
    
})();
```


### value based mutex with invokeWith transformer function

```
(async () => {
    const valueManager = mutex.value.invokeWith();
    // Set value with transformation (e.g., multiply by 2)
    await valueManager.setValue(42, (val) => val * 2);
    console.log(await valueManager.getValue()); // 84
    // Set value without transformation
    await valueManager.setValue(50);
    console.log(await valueManager.getValue()); // 50
})();
```


### json single level json value mutex 

```
(async () => {
    const manager = mutex.json.nonNested();
    console.log(await manager.getValue('key1')); // undefined
    await manager.setValue('key1', 42);
    await manager.setValue('key2', 'hello');
    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello
    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();
```


### json single level json value mutex with invokeWith transformer function

```
(async () => {
    const manager = mutex.json.nonNestedInvokeWith();
    console.log(await manager.getValue('key1')); // undefined
    await manager.setValue('key1', 42, (val) => { console.log("set value with transformer function: ", val); return val; }); // 
    await manager.setValue('key2', 'hello', (val) => { console.log("set value with transformer function:", val); return val; }); // 
    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello
    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();
```


### json nested value mutex 

```
(async () => {
    const manager = mutex.json.nested();
    console.log(await manager.getValue('key1')); // undefined
    await manager.setValue('key1', 42); // Single level
    await manager.setValue('key2.subkey1', 'hello'); // Nested level
    await manager.setValue('key2.subkey2.subkey3', 'world'); // More deeply nested
    await manager.setValue('key3.key1', 42); // Nested level
    await manager.setValue('key4', { "key1": 42 }); // Single level
    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2.subkey1')); // hello
    console.log(await manager.getValue('key2.subkey2.subkey3')); // world
    console.log(await manager.getAllValues());
    // Output:
    // {
    //   key1: 42,
    //   key2: {
    //     subkey1: 'hello',
    //     subkey2: { subkey3: 'world' }
    //   }
    // }
})();
```


### json nested value mutex with invokeWith transformer function

```
(async () => {
    const manager = mutex.json.invokeWith();
    console.log(await manager.getValue('key1')); // undefined
    // Setting a value and then invoking a transformer
    await manager.setValue('key1', 42, (newValue) => {
        console.log('Value set for key1:', newValue); // Output: Value set for key1: 42
    });
    console.log(await manager.getValue('key1')); // 42
    // Setting a nested value and then invoking a transformer
    await manager.setValue('key2.subkey1', 'hello', (newValue) => {
        console.log('Value set for key2.subkey1:', newValue); // Output: Value set for key2.subkey1: hello
    });
    console.log(await manager.getValue('key2.subkey1')); // hello
    // Check the entire object
    console.log(await manager.getAllValues());
    // Output:
    // {
    //   key1: 42,
    //   key2: {z
    //     subkey1: 'hello'
    //   }
    // }
})();
```


### semaphore queue or array based mutex

```
(async () => {
    const arrayManager = mutex.array.queue();
    // Push some values
    await arrayManager.push(42); 
    await arrayManager.push('hello'); 
    await arrayManager.push('world'); 
    console.log(await arrayManager.getAllValues()); // [42, 'hello', 'world']
    // Remove value at index 1
    const removedValue = await arrayManager.removeAt(1);
    console.log(removedValue); // 'hello'
    console.log(await arrayManager.getAllValues()); // [42, 'world']
    // Remove value at an out-of-bounds index
    const invalidRemove = await arrayManager.removeAt(5);
    console.log(invalidRemove); // undefined
    console.log(await arrayManager.getAllValues()); // [42, 'world']
})();
```


### semaphore queue or array based mutex with invokeWith transformer function

```
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
```


### todo:


- include key or flag to be specified key and not just a function acquire/release lock


