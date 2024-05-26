export class MyAnimator {

    constructor(startValue, endValue, animationDurationSecs, loop, active) {
        this.startValue = startValue;
        this.endValue = endValue;
        this.animationDurationSecs = animationDurationSecs;
        this.length = (this.endValue - this.startValue);
        this.animVal = this.startValue;
        this.active = active;
        this.loop = loop;
        this.last = 0;
    }

    movementFunction(time) {
        throw new Error('Subclass must implement abstract method');
    }

    updatePositionObject(){
        throw new Error('Subclass must implement abstract method');
    }

    enable(timeSinceAppStart) {
        this.active = true;
        this.last = timeSinceAppStart
        this.lastIteration = false;
    }

    disable() {
        this.active = false;
    }

    update(elapsedTimeSecs, vector) {
        
        if (this.active) {
            let timeSinceAnimationStart = elapsedTimeSecs - this.last;
            if (this.loop || (timeSinceAnimationStart >= 0 && !this.lastIteration)) {
                if(!(timeSinceAnimationStart <= this.animationDurationSecs) && !this.loop) {
                    this.animVal = this.startValue + this.movementFunction(1) * this.length;
                    this.updatePositionObject(timeSinceAnimationStart, vector);
                    this.lastIteration = true
                }
                else {
                    this.animVal = this.startValue + this.movementFunction(timeSinceAnimationStart / this.animationDurationSecs) * this.length;
                    this.updatePositionObject(timeSinceAnimationStart, vector);
                }
            }
        }
    }
}