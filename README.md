# cpi2-labs
Repo for components of program engineering labs

## Task 1
  * Choose array fn (map/filter/filterMap/some/find/findIndex)
    
      asyncFilterMap function was chosen, [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.py#L6-L11)
  * Prepare its callback based async counterpart
    
      callback function is added, [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.py#L27-L31)
  * Prepare demo cases for the usage
    
      runDemo function demostrates working of asyncFilterMap with debounce ([viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.py#L45)) and without debounce ([viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.py#L40))
  * Add new on-demend feature during review
    e.g.: Add support for debounce (if the task took less then X time to
    complete -- add an additional execution delya)

      Added debounce support: if callback execution time is less than specified, an additional delay is performed. This avoids calling the callback too quickly, [viewcode](https://github.com/YKantur/cpi2-labs/blob/main/task1.py#L21-L22)
## Task 2
  * Prepare promise based alternative
  * Write use cases for the promise based solution
  * Write use cases for the async-await
  * Add new on-demend feature during review
  * e.g.: Add support for parallelism
## Task 3
  * Integrate AbortController or other Cancallable approach
## Task 4
  * (Stream/AsyncIterator/Alternative) -- Ongoing processing of large data sets that do not fit in memory
## Task 5
  * (Observable/EventEmitter/Alternative) -- Reactive message based communication between entities
