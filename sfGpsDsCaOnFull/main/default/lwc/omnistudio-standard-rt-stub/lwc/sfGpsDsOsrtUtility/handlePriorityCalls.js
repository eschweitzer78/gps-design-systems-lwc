class QueueElement {
  constructor(priority = 1, method, params, successhandler, errorhandler) {
    this.priority = priority;
    this.method = method;
    this.params = params;
    this.success = successhandler;
    this.error = errorhandler;
  }
}

class PriorityQueue {
  constructor() {
    if (!PriorityQueue.instance) {
      this.items = [];
      PriorityQueue.instance = this;
    }
    return PriorityQueue.instance;
  }
  enqueue(priority, method, params, successhandler, errorhandler) {
    const queueElement = new QueueElement(
      priority,
      method,
      params,
      successhandler,
      errorhandler
    );
    let contains = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > queueElement.priority) {
        this.items.splice(i, 0, queueElement);
        contains = true;
        break;
      }
    }
    if (!contains) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    if (!this.isEmpty()) {
      return this.items.shift();
    }
    return null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  front() {
    if (!this.isEmpty()) {
      return this.items[0];
    }
    return null;
  }
}
const MAX_CONCURRENT_CALLS = 6;
const DELAY = 1000;
let ongoingCallCount = 0;

const processQueue = () => {
  const priorityQueue = new PriorityQueue();
  if (priorityQueue.isEmpty()) {
    return;
  }
  const processCall = (result, callback) => {
    ongoingCallCount--;
    if (callback) {
      callback(result);
    }
    processQueue();
  };
  const makeCall = () => {
    const item = priorityQueue.dequeue();
    if (item) {
      item
        .method(item.params)
        .then((result) => {
          processCall(result, item.success);
        })
        .catch((error) => {
          processCall(error, item.error);
        });
    }
  };
  while (!priorityQueue.isEmpty()) {
    if (ongoingCallCount >= MAX_CONCURRENT_CALLS || ongoingCallCount >= 5) {
      break;
    }
    const ele = priorityQueue.front();
    if (ele && ele.priority > 1) {
      ++ongoingCallCount;
      while (!priorityQueue.isEmpty()) {
        makeCall();
      }
      break;
    } else {
      ++ongoingCallCount;
      makeCall();
    }
  }
};

function handlePriorityCalls(
  priority = 1,
  method,
  params,
  successHandler,
  delay,
  errorHandler
) {
  const priorityQueue = new PriorityQueue();
  priorityQueue.enqueue(priority, method, params, successHandler, errorHandler);
  if (
    priority === 1 &&
    ongoingCallCount < 5 &&
    (delay === undefined || delay === null)
  ) {
    processQueue();
  } else {
    let calculatedDelay =
      delay === undefined || delay === null ? DELAY * (priority - 1) : delay;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(processQueue, calculatedDelay);
  }
}
export default handlePriorityCalls;
