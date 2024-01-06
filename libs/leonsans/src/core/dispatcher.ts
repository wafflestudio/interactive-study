export class Dispatcher {
  handlers_: Record<string, { listeners: Array<Function> }>;

  constructor() {
    this.handlers_ = {
      update: {
        listeners: [],
      },
    };
  }

  on(event: string, callback: Function) {
    if (this.handlers_[event] === undefined) {
      this.handlers_[event] = {
        listeners: [],
      };
    }

    this.handlers_[event].listeners.push(callback);
  }

  off(event: string, callback: Function) {
    if (this.handlers_[event] === undefined) {
      console.error(`This event: ${event} does not exist`);
      return false;
    }

    this.handlers_[event].listeners = this.handlers_[event].listeners.filter(
      (listener) => {
        return listener.toString() !== callback.toString();
      },
    );
  }

  dispatch(event: string, data: any) {
    this.handlers_[event].listeners.forEach((listener) => {
      listener(data);
    });
  }
}
