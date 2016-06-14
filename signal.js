class Signal {
    constructor() {
        this.listeners = new LinkedList();
    }

    dispatch(...params) {
        for (let listener of this.listeners) {
            listener.listener.call(listener.scope, ...params);
            if (listener.ttl > 0) {
                listener.ttl--;
            }
            if(listener.ttl === 0) {
                this.listeners.remove(listener);
            }
        }
    }

    add(listener, scope = null, ttl = -1) {
        if(typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }
        let handler = {scope, ttl, listener};
        this.listeners.add(handler);
    }

    addOnce(listener, scope = null) {
        this.add(listener, scope, 1);
    }

    remove(listener) {
        this.listeners.remove(listener, (a, b) => (a.listener === b));
    }

    clear() {
        this.listeners.clear();
    }
}