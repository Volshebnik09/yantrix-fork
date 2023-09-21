import { describe, expect, test } from 'vitest';
import { parseStateDiagram, createStateDiagram } from '../src/index.js';
import {
	blankInput,
	invalidDiagram,
	emptyStateDiagram,
	simpleTransition,
	simpleTransitionCompleted,
	simpleTransitionWithComments,
	stateDiagramWithChoice,
	stateDiagramWithFork,
	stateDiagramWithLoopCondition,
	stateDiagramWithLeftSideNote,
	stateDiagramWithRightSideNote,
	stateDiagramWithChoiceAndNote,
	stateDiagramWithSameAction,
	stateDiagramWithNamedStates,
	stateDiagramDoublePath,
} from './fixtures/diagramPatterns.js';

import {
	stateDiagramWithLoopConditionExpectedResultString,
	emptyStateDiagramExpectedResult,
	simpleTransitionExpectedResult,
	simpleTransitionCompletedExpectedResult,
	simpleTransitionWithCommentsExpectedResult,
	stateDiagramWithChoiceExpectedResult,
	stateDiagramWithForkExpectedResult,
	stateDiagramWithLeftSideNoteExpectedResult,
	stateDiagramWithRightSideNoteExpectedResult,
	stateDiagramWithChoiceAndNoteExpectedResult,
	stateDiagramWithSameActionExpectedResult,
	stateDiagramWithNamedStatesExpectedResult,
	stateDiagramDoublePathExpectedResult,
} from './fixtures/stateDiagramExpectedResults.js';

describe('State Diagram Parser', () => {
	describe('Common', () => {
		test('blankInput', async () => {
			const diagramText = blankInput;
			await expect(parseStateDiagram(diagramText)).rejects.toThrowError();
		});
		test('invalidDiagram', async () => {
			const diagramText = invalidDiagram;
			await expect(parseStateDiagram(diagramText)).rejects.toThrowError();
		});
		test('emptyStateDiagram', async () => {
			const diagramText = emptyStateDiagram;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = emptyStateDiagramExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('simpleTransition', async () => {
			const diagramText = simpleTransition;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = simpleTransitionExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('simpleTransitionCompleted', async () => {
			const diagramText = simpleTransitionCompleted;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = simpleTransitionCompletedExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('simpleTransitionWithComments', async () => {
			const diagramText = simpleTransitionWithComments;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = simpleTransitionWithCommentsExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithChoice', async () => {
			const diagramText = stateDiagramWithChoice;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithChoiceExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithFork', async () => {
			// forks doesnt supported right now
			const diagramText = stateDiagramWithFork;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithForkExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithLoopCondition', async () => {
			const diagramText = stateDiagramWithLoopCondition;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const expectedResult =
				stateDiagramWithLoopConditionExpectedResultString;
			await expect(
				createStateDiagram(parsedDiagram),
			).rejects.toThrowError(expectedResult);
		});
		test('stateDiagramWithLeftSideNote', async () => {
			const diagramText = stateDiagramWithLeftSideNote;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithLeftSideNoteExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithRightSideNote', async () => {
			const diagramText = stateDiagramWithRightSideNote;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithRightSideNoteExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithChoiceAndNote', async () => {
			const diagramText = stateDiagramWithChoiceAndNote;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithChoiceAndNoteExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithSameAction', async () => {
			const diagramText = stateDiagramWithSameAction;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithSameActionExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramWithNamedStates', async () => {
			const diagramText = stateDiagramWithNamedStates;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramWithNamedStatesExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
		test('stateDiagramDoublePath', async () => {
			const diagramText = stateDiagramDoublePath;
			const parsedDiagram = await parseStateDiagram(diagramText);
			const stateDiagram = await createStateDiagram(parsedDiagram);
			const expectedResult = stateDiagramDoublePathExpectedResult;
			expect(JSON.stringify(stateDiagram)).toEqual(
				JSON.stringify(expectedResult),
			);
		});
	});
});
