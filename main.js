class PromisePolling{

	constructor(onPoll, delay, timeout){
  	this.onPoll = onPoll
    this.delay = delay
    this.timeout = timeout
    this.timer = null
    this.timeoutTimer = null
    this.initPromise()
  }
  
  initPromise(){
    this.promise = new Promise((resolve, reject) =>{
        this.reject = reject
        this.resolve = resolve
    })
    .then(result => {
        console.log('Success! propegating result')
        this.reset()
        if(result) return result
    })
    .catch(error => {
        console.log('Failure! popegating error')
        this.reset()
        if(error) throw error
        throw undefined
    })
  }

  reset(){
    this.clearTimeout()
    this.clearInterval()
  }
  
  clearTimeout(){
    console.log("Clearing timeout!")
    if (this.timeoutTimer){
        clearTimeout(this.timeoutTimer)
        this.timeoutTimer = null
    }
  }

  clearInterval(){
    console.log("Clearing interval!")
    if (this.timer){
        clearInterval(this.timer)
        this.timer = null
    }
  }
  
  run(){
  	this.timer = setInterval(() => {
    	this.onPoll(this.resolve, this.reject)
    }, this.delay)
    this.initTimeout()
  	return this.promise
  }
  
  initTimeout(){
      if(this.timeout > 0){
        console.log('setting timeout')
  	    this.timeoutTimer = setTimeout(() => {
                console.log('timeout!')
                clearInterval(this.timer)
                this.reject(new Error("Timeout"))
        }, this.timeout);
    }
  }

}

poller = new PromisePolling((resolve, reject) => {
    console.log("Executing task")
    //reject(new Error("Something went wrong, here is the error"))
    //resolve("Everything went well we can stop polling")
    reject('test')
}, 500, 1000)

promise = poller.run()
promise.then(console.info).catch(console.error)
Promise.reject('test').then(console.info, e => console.log(e))
