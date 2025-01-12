# cpi2-labs
## Repo for components of program engineering 2 tasks ##


### Task 1 ###
  * Choose array fn (map/filter/filterMap/some/find/findIndex): [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.js#L8-L11)
  * Prepare its callback based async counterpart: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.js#L1-L6), [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.js#L8-L38)
  * Prepare demo cases for the usage: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.js#L40-L69)
  * Add new on-demend feature during review
    e.g.: Add support for debounce (if the task took less then X time to
    complete -- add an additional execution delya): [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.js#L40-L54)

### Task 2 ###
  * Prepare promise based alternative:

    [simulateAsync function returns a promise](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L1-L7)

    [predicatePromise is created when calling the asyncPredicate](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L39)

    [the promise is resolved using .then()](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L50-L54)

    [asyncFilterPromise returns a promise](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L69-L78)

    [Promises are awaited using await](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L106-L113)
    
  * Write use cases for the promise based solution: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L65-L100)
  * Write use cases for the async-await: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L102-L129)
  * Add new on-demend feature during review
    e.g.: Add support for parallelism: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task2.js#L131-L145)

  Note: for technologies that do not have the native Future-like async functionalities
  You may combine Task 1 and 2 into a single Task that will showcase the idiomatic way of handling concurrency.
 
### Task 3 ###
  * Integrate AbortController or other Cancallable approach:
  
    [Creating an AbortController and receiving a signal:](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L83-L84)

    [Passing signal to simulateAsync and asyncFilter](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L91)

    [Signal analysis in simulateAsync 1](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L3-L5)

    [Signal analysis in simulateAsync 2](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L11-L14)

    [Signal analysis in asyncFilter 1](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L21-L23)

    [Signal analysis in asyncFilter 2](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L70-L75)

    [Call controller.abort() to abort](https://github.com/YKantur/cpi2-labs/blob/main/task3.js#L96-L99)

### Task 4 ### 
  * (Stream/AsyncIterator/Alternative) -- Ongoing processing of large data sets that do not fit in memory:

    [defining an asynchronous iterator](https://github.com/YKantur/cpi2-labs/blob/main/task4.js#L12-L14)

    [usage of async iterator in async filter](https://github.com/YKantur/cpi2-labs/blob/main/task4.js#L25)

    [Iteration using an asynchronous iterator](https://github.com/YKantur/cpi2-labs/blob/main/task4.js#L46-L48)

### Task 5 ### 
  * (Observable/EventEmitter/Alternative) -- Reactive message based communication between entities:
  
    Subject declaration for event streams: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L19-L24).
  
    Usage of streams for messages: [filterStart](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L26), [itemStart](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L43), [itemComplete](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L46), [itemPassed](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L48), [filterComplete](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L70), [filterAborted](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L79)

    Subscriptions to track events: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L117-L150)
   
    Processing of aborts: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L77-L82)
   
    Process exit: [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task5.js#L69-L72)
