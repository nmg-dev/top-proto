class Listenable {
    constructor() {
        this._cbs = [];
    }

    addListener(cb) {
        this._cbs.push(cb);
    }

    trigger(arg, filter) {
        let cbs = this._cbs;
        if(filter)
            cbs = cbs.filter(filter);

        cbs.forEach((cb) => {
            cb(arg);
        });
    }
}

export default Listenable;