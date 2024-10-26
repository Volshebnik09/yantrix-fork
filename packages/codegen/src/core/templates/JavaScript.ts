export const JavaScriptTemplate = `
export class %CLASSNAME% extends GenericAutomata {

    static id = %ID%;
    static actions = %ACTIONS_MAP%;
    static states = %STATES_MAP%;
    static getState = %GET_STATE%;
    static hasState = %HAS_STATE%;
    static getAction = %GET_ACTION%;
    static createAction = %CREATE_ACTION%;

    constructor() {
        super();
        this.init({
            state: %STATE%,
            context:%CONTEXT%,
            rootReducer: %REDUCER%,
            stateValidator: %S_VALIDATOR%,
            actionValidator: %A_VALIDATOR%,
            functionRegistry: %F_REGISTRY%,
        });

    }

    isKeyOf = %IS_KEY_OF%;
}

export default %CLASSNAME%;`;
