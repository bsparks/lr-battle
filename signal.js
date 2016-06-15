class Signal {
    constructor() {
        this.listeners = new LinkedList();
    }

    dispatch(...params) {
        // iterate over array copy in case add/remove during dispatch
        for (let listener of this.listeners.toArray()) {
            listener.listener.call(listener.context, ...params);
            if (listener.ttl > 0) {
                listener.ttl--;
            }
            if(listener.ttl === 0) {
                this.listeners.remove(listener);
            }
        }
    }

    add(listener, context = null, ttl = -1) {
        if(typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }
        let handler = {context, ttl, listener};
        this.listeners.add(handler);
    }

    addOnce(listener, context = null) {
        this.add(listener, context, 1);
    }

    remove(listener) {
        this.listeners.remove(listener, (a, b) => (a.listener === b));
    }

    clear() {
        this.listeners.clear();
    }
}