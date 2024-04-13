import { assert, describe, expect, test } from 'vitest';
import { YantrixParser } from '../yantrixParser.js';
import { functionsFixtures, keyItem } from './fixtures/keyItem.js';
import {
	allowedExpressions,
	generateRandomKeyList,
	getKeyItemsInitialEmpty,
	getKeyItemsRandomInitial,
	getKeyItemsWithInitial,
} from './utils/utils.js';
import { an } from 'vitest/dist/reporters-MmQN-57K.js';
import { values } from 'lodash-es';

describe('Key list', () => {
	describe('single key item', () => {
		test('should be return KeyItemDeclaration with TargetProperty', () => {
			const parser = new YantrixParser().parse('#{property}');

			assert.deepOwnInclude(parser, keyItem.declarationKeyItem);
		});
		test('should be return KeyItem declaration with initial string expression', () => {
			const parser = new YantrixParser().parse(`#{property  = 'string'}`);

			assert.deepInclude(parser, keyItem.withStringInitial);
		});
		test('should be return KeyItem declaration with initial array expression', () => {
			const parser = new YantrixParser().parse(`#{property = []}`);

			assert.deepInclude(parser, keyItem.withArrayInitial);
		});
		test('should be return KeyItem declaration with initial integerValue expression', () => {
			const parser = new YantrixParser().parse(`#{property = 3}`);

			assert.deepInclude(parser, keyItem.withIntegerInitial);
		});
		test('should be return KeyItem declaration with base function expression', () => {
			const parser = new YantrixParser().parse(`#{property = func()}`);

			assert.deepInclude(parser, functionsFixtures.expression);
		});
		test('should be return KeyItem declaration with property declaration', () => {
			const parser = new YantrixParser().parse(
				`#{property = anotherProperty}`,
			);

			assert.deepInclude(parser, keyItem.withPropertyInitial);
		});
	});
	describe('Random number of keyItem', () => {
		describe('Input =#{prop1=5, prop2=10, prop5=5...} ------- The same type of data ', () => {
			const parser = new YantrixParser();

			Object.entries(allowedExpressions).forEach(
				([key, value]: [string, any]) => {
					test(`Data type - ${key}`, () => {
						for (let index = 0; index < 100; index++) {
							const keyItems = getKeyItemsWithInitial(value);
							const targetPropertyCount = keyItems.length;
							const formatInput = `#{${keyItems.join(',')}}`;

							const output = parser.parse(formatInput);

							const { contextDescription } = output;
							const context = contextDescription[0].context;

							expect(targetPropertyCount).toBe(context.length);

							keyItems.map((strKey, index) => {
								const { KeyItemDeclaration } = context[index];
								const { TargetProperty } = KeyItemDeclaration;

								const targetPropertyInput =
									strKey.split('=')[0];
								const targetPropertyValue =
									strKey.split('=')[1];

								expect(targetPropertyInput).toBe(
									TargetProperty,
								);
								expect(
									KeyItemDeclaration.Expression,
								).toStrictEqual(
									value.output(targetPropertyValue),
								);
							});
						}
					});
				},
			);
		});
		describe(`Input = #{prop= "5", prop2=4, prop3=[]...} ------- different types of data `, () => {
			for (let index = 0; index < 10; index++) {
				const parser = new YantrixParser();

				const keyItems = getKeyItemsRandomInitial();
				const keyItemsCount = keyItems.length;
				const inputArray = keyItems.map((item: any) => item.value);

				const formattedInput = `#{${inputArray.join(',')}}`;

				const output = parser.parse(formattedInput);

				const { contextDescription } = output;
				const context = contextDescription[0].context;

				expect(keyItemsCount).toBe(context.length);

				keyItems.forEach((item: any, index: any) => {
					const { KeyItemDeclaration } = context[index];
					const { TargetProperty } = KeyItemDeclaration;
					const { Expression } = KeyItemDeclaration;

					const targetPropertyInput = item.value.split('=')[0];

					expect(targetPropertyInput).toBe(TargetProperty);
					expect(Expression).toStrictEqual(item.output);
				});
			}
		});
		describe('Empty last initial value', () => {
			test('Input = #{prop= "5", prop2=4, prop3} -------  empty default value at the end', () => {
				for (let index = 0; index < 10; index++) {
					const parser = new YantrixParser();

					const keyItems = getKeyItemsRandomInitial();
					const f = {
						KeyItemDeclaration: {
							TargetProperty: 'emptyprop',
						},
					};
					const initialEmptyEnd = [
						...keyItems,
						{
							value: 'emptyprop',
							output: () => {
								return { ...f };
							},
						},
					];

					const inputArray = initialEmptyEnd.map(
						(item: any) => item.value,
					);

					const formattedInput = `#{${inputArray.join(',')}}`;
					const output = parser.parse(formattedInput);

					const { contextDescription } = output;
					const context = contextDescription[0].context;

					const lastContextItem = context[context.length - 1];

					expect(lastContextItem).toStrictEqual({ ...f });
				}
			});
			test('Input = #{prop= "5", prop2=4, prop3. prop4, prop5...} ------- empty default value at the end', () => {
				for (let index = 0; index < 10; index++) {
					const parser = new YantrixParser();

					const generatedEmpty = getKeyItemsInitialEmpty();
					const generatedRandomInitial = getKeyItemsRandomInitial();

					const keyItems = [
						...generatedRandomInitial,
						...generatedEmpty,
					];

					const formattedArr = keyItems.map((el) => el.value);
					const formattedInput = `#{${formattedArr.join(',')}}`;

					const output = parser.parse(formattedInput);

					const { contextDescription } = output;
					const context = contextDescription[0].context;

					const emptyOutputElements = context.slice(
						generatedRandomInitial.length,
					);
					emptyOutputElements.map((el: any, index: any) => {
						expect(el).toStrictEqual(
							generatedEmpty[index].output(),
						);
					});
					expect(emptyOutputElements.length).toBe(
						generatedEmpty.length,
					);
				}
			});
		});
		describe('Incorect input', () => {
			test('#{prop1=5, prop2=, prop5=5} ------- empty values in random arguments', () => {
				const parser = new YantrixParser();
				const keyItems = [
					getKeyItemsRandomInitial(true),
					{ values: ',' },
					getKeyItemsRandomInitial(true),
				];

				const itemsValue = keyItems.map((item: any) => item.value);

				const formattedInput = `#{${itemsValue.join(',')}}`;
				expect(() => parser.parse(formattedInput)).toThrowError();
			});
			test('#{prop1=5, prop2=10, prop5=5, } ------- comma at the end ', () => {
				const parser = new YantrixParser();
				const keyItems = [
					...getKeyItemsRandomInitial(),
					{ value: 'prop3,' },
				];

				const itemsValue = keyItems.map((item: any) => item.value);

				const formattedInput = `#{${itemsValue.join(',')}}`;
				expect(() => parser.parse(formattedInput)).toThrowError();
			});
			test('#{,prop1=5, prop2=10, prop5=5 } ------- comma at the beginning ', () => {
				const parser = new YantrixParser();
				const keyItems = [
					{ value: 'prop3,' },
					...getKeyItemsRandomInitial(),
				];

				const itemsValue = keyItems.map((item: any) => item.value);

				const formattedInput = `#{${itemsValue.join(',')}}`;
				expect(() => parser.parse(formattedInput)).toThrowError();
			});
			test('INPUT = #{prop1=5, prop2=10, , prop5=5 } ------- the comma is duplicated', () => {
				const parser = new YantrixParser();
				const keyItems = getKeyItemsRandomInitial();

				const itemsValue = keyItems.map((item: any, index: any) => {
					if (index === Math.floor(keyItems.length / 2) + 1) {
						return `${item.value},`;
					}
					return item.value;
				});

				const formattedInput = `#{${itemsValue.join(',')}}`;
				expect(() => parser.parse(formattedInput)).toThrowError();
			});
		});
	});
});
