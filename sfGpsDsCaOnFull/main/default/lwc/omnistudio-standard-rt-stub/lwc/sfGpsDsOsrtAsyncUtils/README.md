## ns/asyncUtils

This module exposes a collection of utilities designed to simplify asynchronous operations.

- [ns/asyncUtils](#markdown-header-nsasyncutils)
  - [.debounce(func, wait, immediate)](#markdown-header-nsasyncutilsdebouncefunc-wait-immediate)
  - [.delay(waitFor, [result])](#markdown-header-nsasyncutilsdelaywaitfor-result)

### ns/asyncUtils.debounce(func, wait, immediate)

Delay the execution of a function for the given amount of time. Use to throttle the the
call rate of a method that can be repeatedly called.

**Kind**: static method of [ns/asyncUtils](#markdown-header-nsasyncutils)

| Param     | Type     | Description                                                                 |
| --------- | -------- | --------------------------------------------------------------------------- |
| func      | function | Function to execute after the given duration.                               |
| wait      | number   | Time in milliseconds to delay.                                              |
| immediate | boolean  | When true, will execute on the front end onf the duration instead of after. |

### ns/asyncUtils.delay(waitFor, [result])

Delays execution in the form of a promise.

**Kind**: static method of [ns/asyncUtils](#markdown-header-nsasyncutils)

| Param    | Type   | Description                         |
| -------- | ------ | ----------------------------------- |
| waitFor  | number | Number of milliseconds to delay by. |
| [result] | \*     | Pass through a previous result.     |
