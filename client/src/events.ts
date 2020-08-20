const events = {
    _subscriptions: {} as any,
    $emit(event: string, data?: any) {
        if (this._subscriptions[event]) {
            for (const handler of this._subscriptions[event]) {
                handler(data);
            }
        }
    },
    $on(event: string, handler: Function) {
        this._subscriptions[event] = this._subscriptions[event] || [];

        this._subscriptions[event].push(handler);
    }
}

export default events;
