# Typing recording contract (version 1)

`@keybr/recording` defines and validates JSON records. `@keybr/recording-browser`
observes practice input; it has no storage, account, or transport dependencies.
Recording is disabled when `RecordingContext` is null (the default). The delivery
integration can supply a stable context value containing `applicationRevision`,
nullable `board` and `keymap` version references (`{ id, version }`), and an
`onRecord` sink. The revision should identify the running application build;
references identify saved configuration versions, not editable display names.
An optional `onError` receives sink failures. Observer failures never interrupt
native input or result handling.

The provider must live above the practice controller. Only its practice text area
receives the original-event observer. Settings and other pages receive no input
observer. After leaving practice, a window capture listener observes only releases
of outstanding practice presses and removes itself when none remain. Reentering
practice preserves release ownership across recorder instances. A subsequent
non-repeating press of the same physical code supersedes an unreleased press;
the old release remains missing.

## Records and ordering

Every record has `schemaVersion: 1`, an `attemptId` UUID, a zero-based `sequence`,
and `observedAt` (milliseconds on the browser performance clock). Identity is
`(attemptId, sequence)`. Sequences increase in observation order, independently
of browser event timestamps or the timestamps of accepted steps. Records from
different attempts may interleave, particularly when a key is held across
exercises. Group by UUID and order by sequence before reading an attempt.

- `start`: exact flattened exercise `text`, application revision, Board/Keymap
  version references (null when unselected), and effective `settings`. All typing,
  exercise-generation, keyboard-layout, and emulation properties are resolved
  through `Settings.get`, including defaults and normalized values. Layout data
  also includes the actual resolved layout and geometry IDs. The application
  revision versions keybr's built-in layout definitions.
- `original`: browser `keydown`, `keyup`, `input`, or composition event **before**
  trust/repeat filtering, mapping, or emulation. The timestamp is copied exactly,
  including zero; `timeOrigin` is recorded separately. Key/code, location,
  modifier states, repeat, inputType/data, composition and trust flags are copied
  where available, with null for unavailable fields. `pressSequence` links a
  release or repeated keydown to its original press within the same attempt.
- `processed`: event delivered after layout emulation, with `originalSequence`
  linking its original browser event. Input synthesized by forward emulation has
  `synthetic: true` and links to a keydown; it is not a second physical press.
  Composition input links to `compositionend`. Ignored repeats, paste, and
  ignored composition updates have original records without processed records.
- `state`: `processedSequence`, numeric native `feedback` (0 succeeded,
  1 recovered, 2 failed), explicit `effect`, and detached `before`/`after`
  snapshots. A snapshot contains the accepted `steps`, pending wrong characters
  (`pending`, even when hidden by stop-on-error), cursor, typo flag and completion
  flag. `accepted` and `pending` splices each contain `from`, `removed`, and
  `inserted`: replace the corresponding old suffix starting at `from` with
  `inserted`. Recovery inserts earlier-timestamped steps at the current sequence;
  word deletion removes previously accepted steps. Effects distinguish accepted,
  rejected, ignored-space, delete-character, delete-word, skip-word, forgiven,
  replace-character, and skip-character.
- `end`: explicit reason (`completed`, `reset`, `skipped`, `inactivity`,
  `focus-loss`, `settings-change`, `keyboard-change`, or `navigation`). Completed
  attempts include the native result's ordinary JSON representation and the
  boolean `resultAccepted` from native validation, even when false. Other endings
  have null result and validation fields. No changes are made to the native result
  format or to progression's existing validation gate.

All positions and splice offsets count Unicode code points, not UTF-16 code
units, bytes, or grapheme clusters. Step timestamps retain native semantics;
`timeToType` is the native metric, not a newly calculated physical-key duration.

An attempt begins with the first original typing event in practice, including
modifier keys or composition. Focus/reset notifications alone produce no attempt.
Overlapping lifecycle notifications produce one end record. An end record does
not seal the sequence: matching key releases can arrive later. While still in
practice, repeats of a held press and the browser input following a completing
forward-emulated keydown can also be appended to their owning attempt, linked by
`pressSequence`; these filtered continuations produce no new attempt or state.
Only matching releases are observed after leaving practice. Missing releases
are never synthesized. There is no guarantee that a release or an end survives
process termination; consumers must identify incomplete attempts.

`recordSchema.parse` validates individual records (suitable for later batches).
`parseAttempt` additionally validates a complete ordered attempt's identity,
causal links, press ownership, splices, cursor bounds, and unique ending. A
missing end makes an attempt incomplete, rather than implying completion.

## Reference fixtures

[Version 1 fixtures](../packages/keybr-recording/fixtures/v1.json) contain plain
JSON scenario inputs, settings, expected records, feedback, final engine state,
and native results with validation, scores, and accuracy. Python readers can
load these directly with `json.load`; no JavaScript execution is needed. Group
`scenario["expected"]["records"]` by `attemptId` when a scenario spans exercises.
They cover ordinary typing, multiple wrong characters, Backspace, clear-word,
stop-on-error, forgiveness, word skipping, both automatic recovery paths,
non-BMP Unicode, forward/reverse emulation, ignored repeats, composition, late
releases, held keys across exercises, missing releases, empty resets and all end
reasons. Tests replay the fixtures both with and without recording and compare
native outcomes. Controller tests additionally compare native progress and
exercise completion and exercise the React lifecycle in StrictMode.

After an intentional contract change, regenerate expected fixture data from the
repository root and review the JSON diff:

```sh
npx tsnode --import=@keybr/test-env-browser --import=@keybr/test-env-bundler packages/keybr-recording-browser/scripts/generate-fixtures.ts
```

There is no persistence in this ticket. The next integration supplies the
configuration, revision and sink, durably queues records, and exposes delivery
status. The default null provider retains no typing records.
