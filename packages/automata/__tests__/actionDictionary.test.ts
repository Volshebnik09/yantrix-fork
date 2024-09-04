import { pickFromArray, popFromArray, sampleArray, sampleRange } from '@yantrix/utils';
import * as _ from 'underscore';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { BasicActionDictionary } from '../src/ActionDictionary.js';
import { AbstractBaseClass } from '../src/mixins/BaseClass.js';
import { TValidator } from '../src/types/index.js';
import { TTestAction } from './fixtures/index.js';

class ActionDictionaryTest extends BasicActionDictionary {
	#defaultActionValidator: typeof this.validateAction;

	constructor() {
		super();
		this.#defaultActionValidator = this.validateAction;
	}

	getDefaultActionValidator() {
		return this.#defaultActionValidator;
	}
}

let sampleInstance: ActionDictionaryTest;

const testNamespace = 'test';
const testNamespaceCross = 'cross';
const testNamespaceExtra = 'extra';

const testValues = _.shuffle(_.range('a'.charCodeAt(0), 'z'.charCodeAt(0)).map(v => String.fromCharCode(v)));
// creating a random sets of letters
const testSamples = [
	popFromArray(testValues, 1),
	popFromArray(testValues, 1),
	popFromArray(testValues, sampleRange(2, 4)),
	popFromArray(testValues, sampleRange(2, 4)),
	popFromArray(testValues, sampleRange(3, 5)),
	popFromArray(testValues, sampleRange(2, 4)),
];

const sampleKeys = {
	// namespace 1: shares some keys with namespace 3, no intersections with namespace 2
	default: [...(testSamples[0] ?? []), ...(testSamples[2] ?? [])],
	// namespace 2: shares some keys with namespace 3, no intersections with namespace 1
	[testNamespace]: [...(testSamples[1] ?? []), ...(testSamples[3] ?? [])],
	// namespace 3: shares some keys with namespaces 1 and 2
	[testNamespaceCross]: [...(testSamples[0] ?? []), ...(testSamples[1] ?? []), ...(testSamples[4] ?? [])],
	// namespace 4: is not represented in the dictionary
	[testNamespaceExtra]: testSamples[5],
};

const sampleAction = () => pickFromArray(Object.values(sampleKeys).flatMap(x => x))[0];

describe('actionDictionary', () => {
	beforeEach(() => {
		vitest.restoreAllMocks();
		vitest.clearAllTimers();
		sampleInstance = new ActionDictionaryTest();
	});
	describe('constructor', () => {
		it('returns an instance of ActionDictionaryTest', () => {
			expect(sampleInstance).toBeInstanceOf(BasicActionDictionary);
		});
		it('returns an instance of AbstractBaseClass', () => {
			expect(sampleInstance).toBeInstanceOf(AbstractBaseClass);
		});
		it('has an autogenerated alphanumeric Correlation ID', () => {
			expect(sampleInstance)
				.property('correlationId')
				.to
				.match(/^[A-Z0-9]+$/);
		});
		it('is empty by default', () => {
			expect(sampleInstance.getDictionary()).toEqual({});
		});
	});

	describe('/setActionValidator', () => {
		const testValidator = ((a: number) => a % 15 === 0) as TValidator<TTestAction>;
		it('accepts a function to overwrite default Action Validator', () => {
			sampleInstance.setActionValidator(testValidator);
			for (let i = 0; i < 100; i++) {
				const sampleValue = sampleRange(-1e6, 1e6);
				expect(sampleInstance.validateAction(sampleValue)).toBe(testValidator(sampleValue));
			}
		});
		it('resets the Action Validator to default when called with null', () => {
			sampleInstance.setActionValidator(testValidator);
			sampleInstance.setActionValidator(null);
			expect(sampleInstance.validateAction).toBe(sampleInstance.getDefaultActionValidator());
		});
		it('returns self', () => {
			expect(sampleInstance.setActionValidator(testValidator)).toBe(sampleInstance);
		});
	});

	describe('/getDictionary', () => {
		beforeEach(() => {
			sampleInstance.addActions({ keys: sampleKeys.default });
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		it('returns the dictionary', () => {
			const dictionary = sampleInstance.getDictionary();
			expect(dictionary).toBeDefined();
			expect(Object.keys(dictionary)).toHaveLength(
				Object.values(_.omit(sampleKeys, testNamespaceExtra)).flatMap(x => x).length,
			);
		});
		it('filters by namespace', () => {
			const dictionary = sampleInstance.getDictionary(testNamespace);
			const values = Object.values(dictionary);
			expect(Object.keys(dictionary)).toHaveLength(sampleKeys[testNamespace].length);
			expect(values).toEqual(
				sampleInstance.getActionValues({
					namespace: testNamespace,
					keys: sampleKeys[testNamespace],
				}),
			);
		});
		it('ignores invalid namespaces', () => {
			expect(sampleInstance.getDictionary(testNamespaceExtra)).toEqual({});
			// @ts-expect-error incorrect type
			expect(sampleInstance.getDictionary(123.45)).toEqual({});
		});
	});

	describe('/clearActions', () => {
		beforeEach(() => {
			sampleInstance.addActions({ keys: sampleKeys.default });
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		describe('when used with no arguments', () => {
			it('returns self', () => {
				expect(sampleInstance.clearActions()).toBe(sampleInstance);
			});
			it('wipes the dictionary', () => {
				sampleInstance.clearActions();
				expect(sampleInstance.getDictionary()).toEqual({});
			});
		});
		describe('when used with a namespace', () => {
			it('returns self', () => {
				expect(sampleInstance.clearActions()).toBe(sampleInstance);
			});
			it('removes the particular namespace', () => {
				const dictionary = sampleInstance.getDictionary();
				const removedNamespace = sampleInstance.getDictionary(testNamespace);
				sampleInstance.clearActions(testNamespace);
				expect(sampleInstance.getDictionary()).toEqual(_.omit(dictionary, Object.keys(removedNamespace)));
			});
			it('ignores invalid namespaces', () => {
				const dictionary = sampleInstance.getDictionary();
				sampleInstance.clearActions(testNamespaceExtra);
				expect(sampleInstance.getDictionary()).toEqual(dictionary);
			});
		});
	});

	describe('/getActionValues', () => {
		beforeEach(() => {
			sampleInstance.addActions({ keys: sampleKeys.default });
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		it('returns empty array for empty input', () => {
			expect(sampleInstance.getActionValues({ keys: [] })).toEqual([]);
		});
		it('returns a valid Action value without namespace', () => {
			const values = sampleInstance.getActionValues({
				keys: pickFromArray(sampleKeys.default),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateAction(values[0])).toBe(true);
		});
		it('returns a valid Action with namespace', () => {
			const values = sampleInstance.getActionValues({
				namespace: testNamespace,
				keys: pickFromArray(sampleKeys[testNamespace]),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateAction(values[0])).toBe(true);
		});
		it('is idempotent', () => {
			const sampleAction = pickFromArray(sampleKeys[testNamespace]);
			const sampleValues = sampleInstance.getActionValues({
				namespace: testNamespace,
				keys: sampleAction,
			});
			const sampleInstance2 = new ActionDictionaryTest();
			sampleInstance2.addActions({
				namespace: testNamespace,
				keys: sampleAction,
			});
			expect(
				sampleInstance2.getActionValues({
					namespace: testNamespace,
					keys: sampleAction,
				}),
			).toEqual(sampleValues);
		});
		describe('returns null when namespace and/or action does not match', () => {
			it('action from different namespace', () => {
				const values = sampleInstance.getActionValues({
					namespace: testNamespace,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			it('action from non-existent namespace', () => {
				const values = sampleInstance.getActionValues({
					namespace: testNamespaceExtra,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			it('action in default namespace that does not exist', () => {
				const values = sampleInstance.getActionValues({
					keys: pickFromArray(sampleKeys[testNamespace]),
				});
				expect(values).toEqual([null]);
			});
			it('returns as many nulls as keys were requested', () => {
				const sampleLength = sampleRange(1, 5);
				expect(
					sampleInstance.getActionValues({
						namespace: testNamespaceExtra,
						keys: sampleArray(() => sampleAction() ?? null, sampleLength),
					}),
				).toEqual(Array.from({ length: sampleLength }).fill(null));
			});
		});
	});

	describe('/addActions', () => {
		describe('without namespace', () => {
			it('returns valid numeric values', () => {
				const sampleActions = sampleInstance.addActions({
					keys: sampleKeys.default,
				});
				expect(sampleActions).toHaveLength(sampleKeys.default.length);
				expect(sampleActions.every(x => sampleInstance.validateAction(x))).toBe(true);
			});
			it('is idempotent', () => {
				const sampleActions = sampleInstance.addActions({
					keys: sampleKeys.default,
				});
				for (let i = 0; i < 3; i++) {
					sampleInstance.clearActions();
					const newActions = sampleInstance.addActions({
						keys: sampleKeys.default,
					});
					expect(sampleActions).toEqual(newActions);
				}
			});
			it('throws when adding duplicate keys', () => {
				const sampleActions = sampleInstance.addActions({
					keys: sampleKeys.default,
				});
				expect(sampleActions).toEqual(
					sampleInstance.getActionValues({
						keys: sampleKeys.default,
					}),
				);
				expect(() =>
					sampleInstance.addActions({
						keys: pickFromArray(sampleKeys.default),
					}),
				).toThrow();
			});
		});
		describe('with namespace', () => {
			it('returns valid numeric values', () => {
				const sampleActions = sampleInstance.addActions({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				expect(sampleActions).toHaveLength(sampleKeys[testNamespaceCross].length);
				expect(sampleActions.every(x => sampleInstance.validateAction(x))).toBe(true);
			});
			it('is idempotent', () => {
				const sampleActions = sampleInstance.addActions({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				for (let i = 0; i < 3; i++) {
					sampleInstance.clearActions();
					const newActions = sampleInstance.addActions({
						namespace: testNamespaceCross,
						keys: sampleKeys[testNamespaceCross],
					});
					expect(sampleActions).toEqual(newActions);
				}
			});
			it('allows adding same keys with different namespaces', () => {
				const sampleActions = sampleInstance.addActions({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				const sampleActions2 = sampleInstance.addActions({
					namespace: testNamespace,
					keys: sampleKeys[testNamespace],
				});
				const dictionary = sampleInstance.getDictionary();
				expect(Object.values(dictionary)).toEqual([...sampleActions, ...sampleActions2]);
			});
			it('throws when adding duplicate keys', () => {
				const sampleActions = sampleInstance.addActions({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				expect(sampleActions).toEqual(
					sampleInstance.getActionValues({
						namespace: testNamespaceCross,
						keys: sampleKeys[testNamespaceCross],
					}),
				);
				expect(() =>
					sampleInstance.addActions({
						namespace: testNamespaceCross,
						keys: pickFromArray(sampleKeys[testNamespaceCross]),
					}),
				).toThrow();
			});
		});
	});

	describe('/removeActions', () => {
		let sampleValues: TTestAction[];
		let defaultValues: TTestAction[];
		let defaultKeys: string[];
		beforeEach(() => {
			defaultValues = sampleInstance.addActions({
				keys: sampleKeys.default,
			});
			defaultKeys = sampleInstance.getActionKeys({
				actions: defaultValues,
			}) as string[];
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleValues = sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		it('returns self', () => {
			expect(sampleInstance.removeActions({})).toBe(sampleInstance);
		});
		it('does not change the dictionary without params', () => {
			const dictionary = sampleInstance.getDictionary();
			sampleInstance.removeActions({});
			expect(sampleInstance.getDictionary()).toEqual(dictionary);
		});
		it('on empty dictionary does not change anything', () => {
			const sampleInstance2 = new ActionDictionaryTest();
			const dictionary = sampleInstance2.getDictionary();
			sampleInstance2.removeActions({
				namespace: testNamespace,
				keys: pickFromArray(sampleKeys[testNamespace]),
				actions: pickFromArray(defaultValues),
			});
			expect(sampleInstance2.getDictionary()).toEqual(dictionary);
		});
		describe('with namespace', () => {
			describe('without Keys and Actions', () => {
				it('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespaceExtra,
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('does not change the dictionary with existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({ namespace: testNamespace });
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
			});
			describe('with Keys', () => {
				it('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespaceExtra,
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores empty keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores keys from different namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores non-existing keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						keys: pickFromArray(sampleKeys[testNamespaceExtra] ?? []),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Keys', () => {
					const sampleKey = pickFromArray(sampleKeys[testNamespace]);
					sampleInstance.removeActions({
						namespace: testNamespace,
						keys: sampleKey,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespace))).toEqual(
						sampleInstance.getActionValues({
							namespace: testNamespace,
							keys: _.without(sampleKeys[testNamespace], ...sampleKey),
						}),
					);
				});
			});
			describe('with Actions', () => {
				it('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespaceExtra,
						actions: pickFromArray(defaultValues),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores empty actions', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						actions: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores actions from different namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						actions: pickFromArray(defaultValues),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores non-existing actions', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespaceCross,
						actions: sampleArray(() => sampleRange(0, 100), sampleRange(5, 8)),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Actions', () => {
					const sampleAction = pickFromArray(sampleValues);
					sampleInstance.removeActions({
						namespace: testNamespaceCross,
						actions: sampleAction,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleAction),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getActionKeys({
							namespace: testNamespaceCross,
							actions: _.without(sampleValues, ...sampleAction),
						}),
					);
				});
			});
			describe('with Keys and Actions', () => {
				it('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespaceExtra,
						actions: pickFromArray(defaultValues),
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores empty actions and keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						namespace: testNamespace,
						actions: [],
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Actions and Keys', () => {
					const sampleAction = pickFromArray(sampleValues, 2);
					const sampleKey = pickFromArray(sampleKeys[testNamespaceCross], 2);
					const actionToRemove = sampleInstance
						.getActionValues({
							namespace: testNamespaceCross,
							keys: sampleKey,
						})
						.filter(sampleInstance.validateAction);
					sampleInstance.removeActions({
						namespace: testNamespaceCross,
						actions: sampleAction,
						keys: sampleKey,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleAction, ...actionToRemove),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getActionKeys({
							namespace: testNamespaceCross,
							actions: _.without(sampleValues, ...sampleAction, ...actionToRemove),
						}),
					);
				});
				it('restricts removed Actions and Keys to the requested namespace', () => {
					const sampleAction = pickFromArray(sampleValues, 2);
					const sampleKey = pickFromArray(sampleKeys[testNamespaceCross], 2);
					const actionToRemove = sampleInstance
						.getActionValues({
							namespace: testNamespaceCross,
							keys: sampleKey,
						})
						.filter(sampleInstance.validateAction);
					sampleInstance.removeActions({
						namespace: testNamespaceCross,
						actions: [...sampleAction, ...defaultValues],
						keys: [...sampleKey, ...(sampleKeys[testNamespaceExtra] ?? [])],
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleAction, ...actionToRemove),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getActionKeys({
							namespace: testNamespaceCross,
							actions: _.without(sampleValues, ...sampleAction, ...actionToRemove),
						}),
					);
				});
			});
		});
		describe('without namespace', () => {
			describe('without Keys and Actions', () => {
				it('does not change the dictionary', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
			});
			describe('with Keys', () => {
				it('ignores empty keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores non-existing keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						keys: pickFromArray(sampleKeys[testNamespaceExtra] ?? []),
					});
					sampleInstance.removeActions({
						keys: sampleKeys[testNamespace],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Keys', () => {
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					sampleInstance.removeActions({
						keys: sampleKey,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						sampleInstance.getActionValues({
							keys: _.without(sampleKeys.default, ...sampleKey),
						}),
					);
				});
			});
			describe('with Actions', () => {
				it('ignores empty actions', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						actions: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores Actions from namespaces', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						actions: sampleInstance.getActionValues({
							namespace: testNamespace,
							keys: sampleKeys[testNamespace],
						}) as unknown as number[],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('ignores non-existent Actions', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						actions: sampleArray(() => sampleRange(1, 50), sampleRange(3, 5)),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Actions', () => {
					const sampleAction = pickFromArray(defaultValues, 2);
					sampleInstance.removeActions({
						actions: sampleAction,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleAction),
					);
				});
			});
			describe('with Keys and Actions', () => {
				it('ignores empty actions and keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeActions({
						actions: [],
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				it('removes the requested Actions and Keys', () => {
					const sampleAction = pickFromArray(defaultValues, 2);
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					const actionToRemove = sampleInstance
						.getActionValues({
							keys: sampleKey,
						})
						.filter(sampleInstance.validateAction);
					sampleInstance.removeActions({
						actions: sampleAction,
						keys: sampleKey,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleAction, ...actionToRemove),
					);
				});
				it('restricts removed Actions and Keys to the default namespace', () => {
					const sampleAction = pickFromArray(defaultValues, 2);
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					const actionToRemove = sampleInstance
						.getActionValues({
							keys: sampleKey,
						})
						.filter(sampleInstance.validateAction);
					sampleInstance.removeActions({
						actions: [
							...sampleAction,
							...(sampleInstance.getActionValues({
								namespace: testNamespace,
								keys: sampleKeys[testNamespace],
							}) as unknown as number[]),
						],
						keys: [...sampleKey, ...(sampleKeys[testNamespaceExtra] ?? [])],
					});

					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleAction, ...actionToRemove),
					);
				});
			});
		});
	});

	describe('/getActionKeys', () => {
		let sampleValues: TTestAction[];
		let defaultValues: TTestAction[];
		beforeEach(() => {
			defaultValues = sampleInstance.addActions({
				keys: sampleKeys.default,
			});
			sampleInstance.addActions({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleValues = sampleInstance.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		it('returns empty array for empty input', () => {
			expect(sampleInstance.getActionKeys({ actions: [] })).toEqual([]);
		});
		it('is idempotent', () => {
			const sampleAction = sampleInstance.getActionKeys({
				namespace: testNamespaceCross,
				actions: sampleValues,
			});
			const sampleInstance2 = new ActionDictionaryTest();
			sampleInstance2.addActions({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
			expect(
				sampleInstance2.getActionKeys({
					namespace: testNamespaceCross,
					actions: sampleValues,
				}),
			).toEqual(sampleAction);
		});
		it('returns a key without namespace', () => {
			const testValues = pickFromArray(defaultValues);
			const keys = sampleInstance.getActionKeys({
				actions: testValues,
			});
			expect(keys).toHaveLength(1);
			expect(sampleInstance.getDictionary()[keys[0] ?? '']).toEqual(testValues[0]);
		});
		it('returns a key with namespace', () => {
			const testValues = pickFromArray(sampleValues);
			const keys = sampleInstance.getActionKeys({
				namespace: testNamespaceCross,
				actions: testValues,
			});
			expect(keys).toHaveLength(1);
			expect(sampleInstance.getDictionary(testNamespaceCross)[keys[0] ?? '']).toEqual(testValues[0]);
		});
		describe('returns null when namespace and/or action does not match', () => {
			it('invalid action', () => {
				const values = sampleInstance.getActionKeys({
					actions: [-123.4],
				});
				expect(values).toEqual([null]);
			});
			it('actions from different namespace', () => {
				const values = sampleInstance.getActionKeys({
					namespace: testNamespace,
					actions: pickFromArray(defaultValues),
				});
				expect(values).toEqual([null]);
			});
			it('action from non-existent namespace', () => {
				const values = sampleInstance.getActionKeys({
					namespace: testNamespaceExtra,
					actions: pickFromArray(sampleValues),
				});
				expect(values).toEqual([null]);
			});
			it('action in default namespace that does not exist', () => {
				const values = sampleInstance.getActionKeys({
					actions: pickFromArray(_.without(sampleValues, ...defaultValues)),
				});
				expect(values).toEqual([null]);
			});
			it('returns as many nulls as keys were requested', () => {
				const sampleLength = sampleRange(1, 5);
				expect(
					sampleInstance.getActionKeys({
						namespace: testNamespaceExtra,
						actions: sampleArray(() => sampleRange(0, Number.MAX_SAFE_INTEGER), sampleLength),
					}),
				).toEqual(Array.from({ length: sampleLength }).fill(null));
			});
		});
	});
});
