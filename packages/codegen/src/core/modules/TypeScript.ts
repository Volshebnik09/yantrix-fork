import { ICodegen, TGetCodeOptionsMap, TStateDiagramMatrixIncludeNotes } from '../../types/common.js';
import { JavaScriptCodegen } from './JavaScript.js';
import { ModuleNames } from './index';

export class TypeScriptCodegen extends JavaScriptCodegen implements ICodegen<ModuleNames.TypeScript> {
	constructor(diagram: TStateDiagramMatrixIncludeNotes) {
		super(diagram);
		this.imports['@yantrix/automata'].push('TAutomataBaseActionType', 'TAutomataBaseStateType', 'TValidator');
	}

	protected override getStateValidator() {
		return `(${super.getStateValidator()}) as TValidator<TAutomataBaseStateType>`;
	}

	protected override getActionValidator() {
		return `(${super.getActionValidator()}) as TValidator<TAutomataBaseActionType>`;
	}

	protected override getIsKeyOf() {
		return `(${super.getIsKeyOf()}) as (key: any, obj: object) => key is keyof typeof obj`;
	}

	protected override getGetActionFunc() {
		return `(action: keyof typeof actionsMap) => actionsDictionary[action]`;
	}

	protected override getCreateActionFunc(className: string) {
		return `(action: keyof typeof actionsMap, payload:any) => {
			const actionId = ${className}.getAction(action);
			return {
				action: actionId,
				payload,
			}
		}`;
	}

	public override getCode(options: TGetCodeOptionsMap[ModuleNames.TypeScript]) {
		return `
			${this.getImports()}
			${this.getDictionaries()}
			const actionsMap = ${JSON.stringify(this.getActionsMap(), null, 2)} as const
			const statesMap = ${JSON.stringify(this.getStatesMap(), null, 2)} as const
			${this.getDefaultContext()}
			${this.getActionToStateFromState()}
			${this.getClassTemplate(options.className)}
		`;
	}

	protected override getHasStateFunc(className: string) {
		return `(instance: ${className}, state: keyof typeof ${className}.states) => instance.state === ${className}.getState(state)`;
	}
	protected override getGetStateFunc() {
		return `(state: keyof typeof statesMap) => statesDictionary[state]`;
	}
}
