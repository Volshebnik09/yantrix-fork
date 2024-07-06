# Test Report

| 🕙 Start time | ⌛ Duration |
| --- | ---: |
| 7/5/2024, 5:03:34 PM | 8.772 s |

| | ✅ Passed | ❌ Failed | ⏩ Skipped | 🚧 Todo | ⚪ Total |
| --- | ---: | ---: | ---: | ---: | ---: |
|Test Suites|10|0|0|0|10|
|Tests|34|0|0|0|34|

## ✅ <a id="file0" href="#file0">__tests__\stateDiagram.test.ts</a>

15 passed, 0 failed, 0 skipped, 0 todo, done in 2526 s

```
✅ State Diagram Parser › Common
   ✅ blankInput
   ✅ invalidDiagram
   ✅ emptyStateDiagram
   ✅ simpleTransition
   ✅ simpleTransitionCompleted
   ✅ simpleTransitionWithComments
   ✅ stateDiagramWithChoice
   ✅ stateDiagramWithFork
   ✅ stateDiagramWithLoopCondition
   ✅ stateDiagramWithLeftSideNote
   ✅ stateDiagramWithRightSideNote
   ✅ stateDiagramWithChoiceAndNote
   ✅ stateDiagramWithSameAction
   ✅ stateDiagramWithNamedStates
   ✅ stateDiagramDoublePath
✅ State Diagram Parser
```

## ✅ <a id="file1" href="#file1">__tests__\stateParser.test.ts</a>

19 passed, 0 failed, 0 skipped, 0 todo, done in 2555 s

```
✅ State Diagram Parser › Common
   ✅ Empty Input Error
   ✅ Invalid Diagram Type
   ✅ Empty Diagram
✅ State Diagram Parser › Notes
   ✅ One Line
   ✅ Empty Note
   ✅ Left side note
   ✅ Right side note
   ✅ Multiline note
✅ State Diagram Parser › States And Actions
   ✅ Simple Transition
   ✅ Named State
   ✅ Simple Completed Transition
   ✅ Simple Transition With Comments
   ✅ All States To End
   ✅ Double Transitions
✅ State Diagram Parser › Forks
   ✅ Simple
   ✅ Normal
✅ State Diagram Parser › Choices
   ✅ Simple
   ✅ Double Path
   ✅ Loop
✅ State Diagram Parser
```
