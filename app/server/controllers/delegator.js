// Facilitate inter-controller communication in a centralised manner
export default class Delegator {
    constructor() {
        this.delegatees = {};

        return {
            subscribe: this.subscribe.bind(this),
            delegateTo: this.delegateTo.bind(this)
        };
    }

    subscribe(controllerName, ref) {
        this.delegatees[controllerName] = ref;

        return ref;
    }

    delegateTo(controllerName, handlerName, ...theHandlerArgs) {
        const controller = this.delegatees[controllerName];
        const handler = controller[handlerName];

        return handler.apply(controller, [...theHandlerArgs]);
    }
}
