import { pickFromArray, popFromArray, sampleArray, sampleRange } from '@yantrix/utils';
import * as _ from 'underscore';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { BasicEventDictionary } from '../src/EventDictionary.js';
import { AbstractBaseClass } from '../src/mixins/BaseClass.js';
import { TValidator } from '../src/types/index.js';
import { TTestEvent } from './fixtures/index.js';

class EventDictionaryTest extends BasicEventDictionary {
	#defaultEventValidator: typeof this.validateEvent;

	constructor() {
		super();
		this.#defaultEventValidator = this.validateEvent;
	}

	getDefaultEventValidator() {
		return this.#defaultEventValidator;
	}
}

let sampleInstance: EventDictionaryTest;

const testNamespace = 'test';
const testNamespaceCross = 'cross';
const testNamespaceExtra = 'extra';

const testValues = _.shuffle(_.range('a'.charCodeAt(0), 'z'.charCodeAt(0)).map((v) => String.fromCharCode(v)));
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

const sampleEvent = () => pickFromArray(Object.values(sampleKeys).flatMap((x) => x))[0];

describe('EventDictionary', () => {
	beforeEach(() => {
		vitest.restoreAllMocks();
		vitest.clearAllTimers();
		sampleInstance = new EventDictionaryTest();
	});
	describe('constructor', () => {
		test('returns an instance of EventDictionaryTest', () => {
			expect(sampleInstance).toBeInstanceOf(BasicEventDictionary);
		});
		test('returns an instance of AbstractBaseClass', () => {
			expect(sampleInstance).toBeInstanceOf(AbstractBaseClass);
		});
		test('has an autogenerated alphanumeric Correlation ID', () => {
			expect(sampleInstance)
				.property('correlationId')
				.to.match(/^[A-Z0-9]+$/);
		});
		test('is empty by default', () => {
			expect(sampleInstance.getDictionary()).toEqual({});
		});
	});

	describe('/setEventValidator', () => {
		const testValidator = ((a: number) => a % 15 === 0) as TValidator<TTestEvent>;
		test('accepts a function to overwrite default Event Validator', () => {
			sampleInstance.setEventValidator(testValidator);
			for (let i = 0; i < 100; i++) {
				const sampleValue = sampleRange(-1e6, 1e6);
				expect(sampleInstance.validateEvent(sampleValue)).toBe(testValidator(sampleValue));
			}
		});
		test('resets the Event Validator to default when called with null', () => {
			sampleInstance.setEventValidator(testValidator);
			sampleInstance.setEventValidator(null);
			expect(sampleInstance.validateEvent).toBe(sampleInstance.getDefaultEventValidator());
		});
		test('returns self', () => {
			expect(sampleInstance.setEventValidator(testValidator)).toBe(sampleInstance);
		});
	});

	describe('/getDictionary', () => {
		beforeEach(() => {
			sampleInstance.addEvents({ keys: sampleKeys.default });
			sampleInstance.addEvents({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns the dictionary', () => {
			const dictionary = sampleInstance.getDictionary();
			expect(dictionary).toBeDefined();
			expect(Object.keys(dictionary)).toHaveLength(
				Object.values(_.omit(sampleKeys, testNamespaceExtra)).flatMap((x) => x).length,
			);
		});
		test('filters by namespace', () => {
			const dictionary = sampleInstance.getDictionary(testNamespace);
			const values = Object.values(dictionary);
			expect(Object.keys(dictionary)).toHaveLength(sampleKeys[testNamespace].length);
			expect(values).toEqual(
				sampleInstance.getEventValues({
					namespace: testNamespace,
					keys: sampleKeys[testNamespace],
				}),
			);
		});
		test('ignores invalid namespaces', () => {
			expect(sampleInstance.getDictionary(testNamespaceExtra)).toEqual({});
			// @ts-ignore
			expect(sampleInstance.getDictionary(123.45)).toEqual({});
		});
	});

	describe('/clearEvents', () => {
		beforeEach(() => {
			sampleInstance.addEvents({ keys: sampleKeys.default });
			sampleInstance.addEvents({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		describe('when used with no arguments', () => {
			test('returns self', () => {
				expect(sampleInstance.clearEvents()).toBe(sampleInstance);
			});
			test('wipes the dictionary', () => {
				sampleInstance.clearEvents();
				expect(sampleInstance.getDictionary()).toEqual({});
			});
		});
		describe('when used with a namespace', () => {
			test('returns self', () => {
				expect(sampleInstance.clearEvents()).toBe(sampleInstance);
			});
			test('removes the particular namespace', () => {
				const dictionary = sampleInstance.getDictionary();
				const removedNamespace = sampleInstance.getDictionary(testNamespace);
				sampleInstance.clearEvents(testNamespace);
				expect(sampleInstance.getDictionary()).toEqual(_.omit(dictionary, Object.keys(removedNamespace)));
			});
			test('ignores invalid namespaces', () => {
				const dictionary = sampleInstance.getDictionary();
				sampleInstance.clearEvents(testNamespaceExtra);
				expect(sampleInstance.getDictionary()).toEqual(dictionary);
			});
		});
	});

	describe('/getEventValues', () => {
		beforeEach(() => {
			sampleInstance.addEvents({ keys: sampleKeys.default });
			sampleInstance.addEvents({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleInstance.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns empty array for empty input', () => {
			expect(sampleInstance.getEventValues({ keys: [] })).toEqual([]);
		});
		test('returns a valid Event value without namespace', () => {
			const values = sampleInstance.getEventValues({
				keys: pickFromArray(sampleKeys.default),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateEvent(values[0])).toBe(true);
		});
		test('returns a valid Event with namespace', () => {
			const values = sampleInstance.getEventValues({
				namespace: testNamespace,
				keys: pickFromArray(sampleKeys[testNamespace]),
			});
			expect(values).toHaveLength(1);
			expect(sampleInstance.validateEvent(values[0])).toBe(true);
		});
		test('is idempotent', () => {
			const sampleEvent = pickFromArray(sampleKeys[testNamespace]);
			const sampleValues = sampleInstance.getEventValues({
				namespace: testNamespace,
				keys: sampleEvent,
			});
			const sampleInstance2 = new EventDictionaryTest();
			sampleInstance2.addEvents({
				namespace: testNamespace,
				keys: sampleEvent,
			});
			expect(
				sampleInstance2.getEventValues({
					namespace: testNamespace,
					keys: sampleEvent,
				}),
			).toEqual(sampleValues);
		});
		describe('returns null when namespace and/or Event does not match', () => {
			test('Event from different namespace', () => {
				const values = sampleInstance.getEventValues({
					namespace: testNamespace,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			test('Event from non-existent namespace', () => {
				const values = sampleInstance.getEventValues({
					namespace: testNamespaceExtra,
					keys: pickFromArray(sampleKeys.default),
				});
				expect(values).toEqual([null]);
			});
			test('Event in default namespace that does not exist', () => {
				const values = sampleInstance.getEventValues({
					keys: pickFromArray(sampleKeys[testNamespace]),
				});
				expect(values).toEqual([null]);
			});
			test('returns as many nulls as keys were requested', () => {
				const sampleLength = sampleRange(1, 5);
				expect(
					sampleInstance.getEventValues({
						namespace: testNamespaceExtra,
						keys: sampleArray(() => sampleEvent() ?? null, sampleLength),
					}),
				).toEqual(new Array(sampleLength).fill(null));
			});
		});
	});

	describe('/addEvents', () => {
		describe('without namespace', () => {
			test('returns valid numeric values', () => {
				const sampleEvents = sampleInstance.addEvents({
					keys: sampleKeys.default,
				});
				expect(sampleEvents).toHaveLength(sampleKeys.default.length);
				expect(sampleEvents.every((x) => sampleInstance.validateEvent(x))).toBe(true);
			});
			test('is idempotent', () => {
				const sampleEvents = sampleInstance.addEvents({
					keys: sampleKeys.default,
				});
				for (let i = 0; i < 3; i++) {
					sampleInstance.clearEvents();
					const newEvents = sampleInstance.addEvents({
						keys: sampleKeys.default,
					});
					expect(sampleEvents).toEqual(newEvents);
				}
			});
			test('throws when adding duplicate keys', () => {
				const sampleEvents = sampleInstance.addEvents({
					keys: sampleKeys.default,
				});
				expect(sampleEvents).toEqual(
					sampleInstance.getEventValues({
						keys: sampleKeys.default,
					}),
				);
				expect(() =>
					sampleInstance.addEvents({
						keys: pickFromArray(sampleKeys.default),
					}),
				).toThrow();
			});
		});
		describe('with namespace', () => {
			test('returns valid numeric values', () => {
				const sampleEvents = sampleInstance.addEvents({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				expect(sampleEvents).toHaveLength(sampleKeys[testNamespaceCross].length);
				expect(sampleEvents.every((x) => sampleInstance.validateEvent(x))).toBe(true);
			});
			test('is idempotent', () => {
				const sampleEvents = sampleInstance.addEvents({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				for (let i = 0; i < 3; i++) {
					sampleInstance.clearEvents();
					const newEvents = sampleInstance.addEvents({
						namespace: testNamespaceCross,
						keys: sampleKeys[testNamespaceCross],
					});
					expect(sampleEvents).toEqual(newEvents);
				}
			});
			test('allows adding same keys with different namespaces', () => {
				const sampleEvents = sampleInstance.addEvents({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				const sampleEvents2 = sampleInstance.addEvents({
					namespace: testNamespace,
					keys: sampleKeys[testNamespace],
				});
				const dictionary = sampleInstance.getDictionary();
				expect(Object.values(dictionary)).toEqual([...sampleEvents, ...sampleEvents2]);
			});
			test('throws when adding duplicate keys', () => {
				const sampleEvents = sampleInstance.addEvents({
					namespace: testNamespaceCross,
					keys: sampleKeys[testNamespaceCross],
				});
				expect(sampleEvents).toEqual(
					sampleInstance.getEventValues({
						namespace: testNamespaceCross,
						keys: sampleKeys[testNamespaceCross],
					}),
				);
				expect(() =>
					sampleInstance.addEvents({
						namespace: testNamespaceCross,
						keys: pickFromArray(sampleKeys[testNamespaceCross]),
					}),
				).toThrow();
			});
		});
	});

	describe('/removeEvents', () => {
		let sampleValues: TTestEvent[];
		let defaultValues: TTestEvent[];
		let defaultKeys: string[];
		beforeEach(() => {
			defaultValues = sampleInstance.addEvents({
				keys: sampleKeys.default,
			});
			defaultKeys = sampleInstance.getEventKeys({
				events: defaultValues,
			}) as string[];
			sampleInstance.addEvents({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleValues = sampleInstance.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns self', () => {
			expect(sampleInstance.removeEvents({})).toBe(sampleInstance);
		});
		test('does not change the dictionary without params', () => {
			const dictionary = sampleInstance.getDictionary();
			sampleInstance.removeEvents({});
			expect(sampleInstance.getDictionary()).toEqual(dictionary);
		});
		test('on empty dictionary does not change anything', () => {
			const sampleInstance2 = new EventDictionaryTest();
			const dictionary = sampleInstance2.getDictionary();
			sampleInstance2.removeEvents({
				namespace: testNamespace,
				keys: pickFromArray(sampleKeys[testNamespace]),
				events: pickFromArray(defaultValues),
			});
			expect(sampleInstance2.getDictionary()).toEqual(dictionary);
		});
		describe('with namespace', () => {
			describe('without Keys and Events', () => {
				test('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespaceExtra,
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('does not change the dictionary with existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({ namespace: testNamespace });
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
			});
			describe('with Keys', () => {
				test('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespaceExtra,
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores empty keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores keys from different namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores non-existing keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						keys: pickFromArray(sampleKeys[testNamespaceExtra] ?? []),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Keys', () => {
					const sampleKey = pickFromArray(sampleKeys[testNamespace]);
					sampleInstance.removeEvents({
						namespace: testNamespace,
						keys: sampleKey,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespace))).toEqual(
						sampleInstance.getEventValues({
							namespace: testNamespace,
							keys: _.without(sampleKeys[testNamespace], ...sampleKey),
						}),
					);
				});
			});
			describe('with Events', () => {
				test('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespaceExtra,
						events: pickFromArray(defaultValues),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores empty Events', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						events: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores Events from different namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						events: pickFromArray(defaultValues),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores non-existing Events', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespaceCross,
						events: sampleArray(() => sampleRange(0, 100), sampleRange(5, 8)),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Events', () => {
					const sampleEvent = pickFromArray(sampleValues);
					sampleInstance.removeEvents({
						namespace: testNamespaceCross,
						events: sampleEvent,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleEvent),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getEventKeys({
							namespace: testNamespaceCross,
							events: _.without(sampleValues, ...sampleEvent),
						}),
					);
				});
			});
			describe('with Keys and Events', () => {
				test('does not change the dictionary with non-existing namespace', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespaceExtra,
						events: pickFromArray(defaultValues),
						keys: pickFromArray(sampleKeys.default),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores empty Events and keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						namespace: testNamespace,
						events: [],
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Events and Keys', () => {
					const sampleEvent = pickFromArray(sampleValues, 2);
					const sampleKey = pickFromArray(sampleKeys[testNamespaceCross], 2);
					const EventToRemove = sampleInstance
						.getEventValues({
							namespace: testNamespaceCross,
							keys: sampleKey,
						})
						.filter(sampleInstance.validateEvent);
					sampleInstance.removeEvents({
						namespace: testNamespaceCross,
						events: sampleEvent,
						keys: sampleKey,
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleEvent, ...EventToRemove),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getEventKeys({
							namespace: testNamespaceCross,
							events: _.without(sampleValues, ...sampleEvent, ...EventToRemove),
						}),
					);
				});
				test('restricts removed Events and Keys to the requested namespace', () => {
					const sampleEvent = pickFromArray(sampleValues, 2);
					const sampleKey = pickFromArray(sampleKeys[testNamespaceCross], 2);
					const EventToRemove = sampleInstance
						.getEventValues({
							namespace: testNamespaceCross,
							keys: sampleKey,
						})
						.filter(sampleInstance.validateEvent);
					sampleInstance.removeEvents({
						namespace: testNamespaceCross,
						events: [...sampleEvent, ...defaultValues],
						keys: [...sampleKey, ...(sampleKeys[testNamespaceExtra] ?? [])],
					});
					expect(Object.values(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						_.without(sampleValues, ...sampleEvent, ...EventToRemove),
					);
					expect(Object.keys(sampleInstance.getDictionary(testNamespaceCross))).toEqual(
						sampleInstance.getEventKeys({
							namespace: testNamespaceCross,
							events: _.without(sampleValues, ...sampleEvent, ...EventToRemove),
						}),
					);
				});
			});
		});
		describe('without namespace', () => {
			describe('without Keys and Events', () => {
				test('does not change the dictionary', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
			});
			describe('with Keys', () => {
				test('ignores empty keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores non-existing keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						keys: pickFromArray(sampleKeys[testNamespaceExtra] ?? []),
					});
					sampleInstance.removeEvents({
						keys: sampleKeys[testNamespace],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Keys', () => {
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					sampleInstance.removeEvents({
						keys: sampleKey,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						sampleInstance.getEventValues({
							keys: _.without(sampleKeys.default, ...sampleKey),
						}),
					);
				});
			});
			describe('with Events', () => {
				test('ignores empty Events', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						events: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores Events from namespaces', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						events: sampleInstance.getEventValues({
							namespace: testNamespace,
							keys: sampleKeys[testNamespace],
						}) as unknown as number[],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('ignores non-existent Events', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						events: sampleArray(() => sampleRange(1, 50), sampleRange(3, 5)),
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Events', () => {
					const sampleEvent = pickFromArray(defaultValues, 2);
					sampleInstance.removeEvents({
						events: sampleEvent,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleEvent),
					);
				});
			});
			describe('with Keys and Events', () => {
				test('ignores empty Events and keys', () => {
					const dictionary = sampleInstance.getDictionary();
					sampleInstance.removeEvents({
						events: [],
						keys: [],
					});
					expect(sampleInstance.getDictionary()).toEqual(dictionary);
				});
				test('removes the requested Events and Keys', () => {
					const sampleEvent = pickFromArray(defaultValues, 2);
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					const EventToRemove = sampleInstance
						.getEventValues({
							keys: sampleKey,
						})
						.filter(sampleInstance.validateEvent);
					sampleInstance.removeEvents({
						events: sampleEvent,
						keys: sampleKey,
					});
					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleEvent, ...EventToRemove),
					);
				});
				test('restricts removed Events and Keys to the default namespace', () => {
					const sampleEvent = pickFromArray(defaultValues, 2);
					const sampleKey = pickFromArray(sampleKeys.default, 2);
					const EventToRemove = sampleInstance
						.getEventValues({
							keys: sampleKey,
						})
						.filter(sampleInstance.validateEvent);
					sampleInstance.removeEvents({
						events: [
							...sampleEvent,
							...(sampleInstance.getEventValues({
								namespace: testNamespace,
								keys: sampleKeys[testNamespace],
							}) as unknown as number[]),
						],
						keys: [...sampleKey, ...(sampleKeys[testNamespaceExtra] ?? [])],
					});

					expect(Object.values(_.pick(sampleInstance.getDictionary(), ...defaultKeys))).toEqual(
						_.without(defaultValues, ...sampleEvent, ...EventToRemove),
					);
				});
			});
		});
	});

	describe('/getEventKeys', () => {
		let sampleValues: TTestEvent[];
		let defaultValues: TTestEvent[];
		beforeEach(() => {
			defaultValues = sampleInstance.addEvents({
				keys: sampleKeys.default,
			});
			sampleInstance.addEvents({
				namespace: testNamespace,
				keys: sampleKeys[testNamespace],
			});
			sampleValues = sampleInstance.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
		});
		test('returns empty array for empty input', () => {
			expect(sampleInstance.getEventKeys({ events: [] })).toEqual([]);
		});
		test('is idempotent', () => {
			const sampleEvent = sampleInstance.getEventKeys({
				namespace: testNamespaceCross,
				events: sampleValues,
			});
			const sampleInstance2 = new EventDictionaryTest();
			sampleInstance2.addEvents({
				namespace: testNamespaceCross,
				keys: sampleKeys[testNamespaceCross],
			});
			expect(
				sampleInstance2.getEventKeys({
					namespace: testNamespaceCross,
					events: sampleValues,
				}),
			).toEqual(sampleEvent);
		});
		test('returns a key without namespace', () => {
			const testValues = pickFromArray(defaultValues);
			const keys = sampleInstance.getEventKeys({
				events: testValues,
			});
			expect(keys).toHaveLength(1);
			expect(sampleInstance.getDictionary()[keys[0] ?? '']).toEqual(testValues[0]);
		});
		test('returns a key with namespace', () => {
			const testValues = pickFromArray(sampleValues);
			const keys = sampleInstance.getEventKeys({
				namespace: testNamespaceCross,
				events: testValues,
			});
			expect(keys).toHaveLength(1);
			expect(sampleInstance.getDictionary(testNamespaceCross)[keys[0] ?? '']).toEqual(testValues[0]);
		});
		describe('returns null when namespace and/or Event does not match', () => {
			test('invalid Event', () => {
				const values = sampleInstance.getEventKeys({
					events: [-123.4],
				});
				expect(values).toEqual([null]);
			});
			test('Events from different namespace', () => {
				const values = sampleInstance.getEventKeys({
					namespace: testNamespace,
					events: pickFromArray(defaultValues),
				});
				expect(values).toEqual([null]);
			});
			test('Event from non-existent namespace', () => {
				const values = sampleInstance.getEventKeys({
					namespace: testNamespaceExtra,
					events: pickFromArray(sampleValues),
				});
				expect(values).toEqual([null]);
			});
			test('Event in default namespace that does not exist', () => {
				const values = sampleInstance.getEventKeys({
					events: pickFromArray(_.without(sampleValues, ...defaultValues)),
				});
				expect(values).toEqual([null]);
			});
			test('returns as many nulls as keys were requested', () => {
				const sampleLength = sampleRange(1, 5);
				expect(
					sampleInstance.getEventKeys({
						namespace: testNamespaceExtra,
						events: sampleArray(() => sampleRange(0, Number.MAX_SAFE_INTEGER), sampleLength),
					}),
				).toEqual(new Array(sampleLength).fill(null));
			});
		});
	});
});
