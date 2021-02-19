export default class PromisePoller {

  constructor(onPoll, delay, timeout) {
    this.onPoll = onPoll
    this.delay = delay
    this.timeout = timeout
    this.timer = null
    this.timeoutTimer = null
    this.initPromise()
  }

  initPromise() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
      .then(result => {
        this.reset()
        if(result) return result
      })
      .catch(error => {
        this.reset()
        if(error) throw error
        throw undefined
      })
  }

  reset() {
    this.clearTimeout()
    this.clearTimer()
  }

  clearTimeout() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = null
    }
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  run() {
    this.reset()
    const runner = () => {
      const resume = () => {
        this.timer = setTimeout(runner, this.delay)
      }
      this.onPoll(resume, this.resolve, this.reject)
    }
    this.initTimeout()
    this.timer = setTimeout(runner, 0)
    return this.promise
  }

  initTimeout() {
    if(this.timeout > 0) {
      this.timeoutTimer = setTimeout(() => {
        if(this.timer) this.clearTimer()
        this.reject(new Error("Timeout"))
      }, this.timeout)
    }
  }
}
