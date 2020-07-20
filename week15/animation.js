class Timeline {
    constructor() {
        this.animations = []
        // this.startTime
    }
    tick() {
        let t = Date.now() - this.startTime
        for (let animation of this.animations) {
            if (t > animation.duration + animation.delay) continue
            let {object, property, start, end, template, timingFunction, delay} = animation
            object[property] = template(timingFunction(start, end)(t - delay))
        }
        requestAnimationFrame(() => this.tick())
    }
    pause() {

    }
    resume() {

    }
    start() {
        this.startTime = Date.now()
        this.tick()
    }
    restart() {

    }
    add(animation) {
        this.animations.push(animation)
    }
}

class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object
        this.template = template
        this.property = property
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay || 0
        this.timingFunction = timingFunction || ((start, end) => {
          return (t) => start + (t / duration) * (end - start)
        })
        console.log(this.timingFunction)
    }

}