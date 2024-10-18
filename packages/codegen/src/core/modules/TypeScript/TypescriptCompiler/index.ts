import { JavaScriptCompiler } from '../../JavaScript';
import { classModule } from './class';

export const TypeScriptCompiler = {
	class: classModule,
	context: JavaScriptCompiler.context,
	dictionaries: JavaScriptCompiler.dictionaries,
	expressions: JavaScriptCompiler.expressions,
	imports: JavaScriptCompiler.imports,
	state: JavaScriptCompiler.state,
};
