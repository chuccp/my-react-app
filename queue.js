class CallBack{
    constructor(callBack) {
        this.callBack = callBack;
        this.back = false;
    }
    wait(handler){
        const _this_ = this;
        this.timeout = setTimeout(function () {
            handler();
        },30000)
        return this
    }
    write(text){
        if(this.timeout){
            clearTimeout(this.timeout);
        }
        this.callBack(text);
    }
}


class Queue {

    constructor() {
        this.textList = [];
        this.funcList = [];
    }

    write(text) {
        if (this.funcList.length > 0) {
            const callBack = this.funcList.pop()
            callBack.write(text);
        }else{
            this.textList.push(text);
        }
    }

    read(callBack) {
        const _this_ = this;
        if(this.textList.length>0){
            const text = this.textList.pop()
            callBack(text);
        }else{
            this.funcList.push(new CallBack(callBack).wait(function () {
                _this_.write("");
            }))
        }
    }

}

const queue = function () {
    return new Queue()
}
 module.exports = queue


