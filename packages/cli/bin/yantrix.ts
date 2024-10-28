import path, { dirname } from 'node:path';
import { generateAutomataFromStateDiagram, ModuleNames, Modules } from '@yantrix/codegen';
import { createStateDiagram, parseStateDiagram } from '@yantrix/mermaid-parser';
import { Command } from 'commander';
import fe from 'fs-extra';
import { isString } from 'lodash-es';
import pc from 'picocolors';
import { isJSON } from '../src/utils';

interface ICodegenOptions {
	language: keyof typeof Modules;
	className: string;
	outfile: string;
	constants?: string;
	verbose?: boolean;
	eval?: string;
}

const program = new Command();

const error = (m: string) => console.error(pc.bold(pc.red(`❌ ${m}`)));
const warn = (m: string) => console.warn(pc.bold(pc.yellow(`⚠️ ${m}`)));
const success = (m: string) => console.info(pc.bold(pc.green(`✅ ${m}`)));
const wait = (m: string) => console.warn(pc.bold(pc.yellow(`⌛ ${m}`)));

const checkDisableFlags = ['/* eslint-disable */', '// @ts-nocheck'];

program
	.name('yantrix')
	.description('Set of CLI tools for Yantrix')
	.version('1.0.0');

program
	.command('codegen')
	.description('Generate Automata from given state diagram')
	.argument('[diagramFile]', 'Diagram file to be parsed', '')
	.option('-l, --language <lang>', 'Target language')
	.option('-o, --outfile <path>', 'Output file path')
	.option('-c, --className <className>', 'Generating Automata class name')
	.option('-e, --eval <diagramText>', 'Evaluate the given state diagram')
	.option('-C, --constants <constants>', 'Constants to be used in generated Automata')
	.option('--verbose', 'Enable verbose mode')
	.allowExcessArguments(true)
	.allowUnknownOption(true)
	.action(async (diagramFile: string, options: ICodegenOptions) => {
		let diagramText = '';

		if (isString(options.eval)) {
			if (diagramFile && options.verbose) {
				warn('Ignoring diagram file path because -e/--eval flag is set.');
			}

			diagramText = options.eval;
		} else {
			if (!diagramFile) {
				error('Diagram file path is required.');
				process.exit(1);
			}
			const filePath = path.resolve(diagramFile);
			if (options.verbose)
				wait(`Reading diagram from ${filePath}...`);
			try {
				diagramText = fe.readFileSync(filePath, 'utf-8');
			} catch (err) {
				if (err instanceof Error)
					error(err.message);
				process.exit(1);
			}
		}

		if (!diagramText || diagramText.trim().length === 0) {
			error('Diagram cannot be empty.');
			process.exit(1);
		}

		if (!options.outfile) {
			error('Output file path flag is required: -o, --outfile <path>');
			process.exit(1);
		}

		if (!options.language) {
			error('Output language flag is required: -l, --language <lang>');
			process.exit(1);
		}

		const allowedLangs = Object.keys(Modules);
		options.language = <keyof typeof Modules>options.language.toLowerCase();
		if (!allowedLangs.includes(options.language)) {
			const allowedMsg = `Allowed languages: ${Object.keys(ModuleNames).join(', ')}`;
			error(`Invalid output language specified. ${allowedMsg}`);
			process.exit(1);
		}

		const className = options.className ?? 'GeneratedAutomata';
		if (!/^\w+$/.test(className)) {
			error('Invalid characters in class name specified.');
			process.exit(1);
		}

		let constants = '{}';
		if (options.constants) {
			if (isJSON(options.constants)) {
				constants = options.constants;
			} else if (fe.existsSync(options.constants)) {
				if (!options.constants.endsWith('.json')) {
					error('Constants file must be a JSON file.');
					process.exit(1);
				} else {
					constants = fe.readFileSync(options.constants, 'utf-8');
				}
			} else {
				error('"constants" flag should be a path to a JSON file or a valid JSON string.');
				process.exit(1);
			}
		}

		if (options.verbose) {
			wait('Parsing given state diagram: ');
			for (const line of diagramText.split('\n')) wait(line);
		}

		const structure = await parseStateDiagram(diagramText).catch((err) => {
			error('An error occurred while parsing given state diagram');
			if (err instanceof Error) error(err.message);
			process.exit(1);
		});

		const matrix = await createStateDiagram(structure).catch((err) => {
			error('An error occurred creating matrix from given state diagram');
			if (err instanceof Error) error(err.message);
			process.exit(1);
		});

		const automata = await generateAutomataFromStateDiagram(matrix, {
			outLang: options.language,
			className,
			constants,
		}).catch((err) => {
			error('An error occurred while generating Automata');
			if (err instanceof Error) error(err.message);
			process.exit(1);
		});

		const disableFlagLines = checkDisableFlags.join('\n');
		const writeable = `${disableFlagLines}\n\n${automata}`;
		const outputFilePath = path.resolve(options.outfile);

		try {
			if (options.verbose) {
				wait(`Saving generated Automata to ${outputFilePath}`);
			}

			fe.ensureDirSync(dirname(outputFilePath));
			fe.writeFileSync(outputFilePath, writeable, { encoding: 'utf-8' });

			if (options.verbose) {
				success(`Generated Automata saved to ${outputFilePath}`);
			}
		} catch (err) {
			if (err instanceof Error) error(err.message);
			process.exit(1);
		}
	});

program.parse(process.argv);
