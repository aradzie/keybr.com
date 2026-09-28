const lessons = [
  { name: 'Warmup', text: 'The quick brown fox jumps over the lazy dog while building steady typing rhythm.' },
  { name: 'Focus', text: 'Slow hands make clear sentences, and clear sentences build lasting typing confidence.' },
  { name: 'Speed', text: 'Moments of calm effort turn into smooth momentum when the fingers know the pattern.' },
  { name: 'Accuracy', text: 'Each correct key strengthens your memory, so keep your posture relaxed and your eyes ahead.' },
  { name: 'Sprint', text: 'Practice with patience and precision to turn skill into speed without breaking your flow.' },
  { name: 'Pro', text: 'Master the rhythm, trust the motion, and let repetition create a natural, fast cadence.' },
];

const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Delete'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

const state = {
  lessonIndex: 0,
  typed: '',
  startedAt: 0,
  elapsedMs: 0,
  timerId: null,
  finished: false,
};

const lessonSelect = document.getElementById('lessonSelect');
const typingInput = document.getElementById('typingInput');
const targetText = document.getElementById('targetText');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const elapsedEl = document.getElementById('elapsed');
const lessonLabel = document.getElementById('lessonLabel');
const keyboard = document.getElementById('keyboard');
const prevLessonBtn = document.getElementById('prevLesson');
const nextLessonBtn = document.getElementById('nextLesson');
const restartBtn = document.getElementById('restartBtn');

function getCurrentLesson() {
  return lessons[state.lessonIndex];
}

function countCorrectChars(source, target) {
  return source.split('').reduce((total, char, index) => {
    if (char === target[index]) {
      return total + 1;
    }
    return total;
  }, 0);
}

function renderLessonOptions() {
  lessonSelect.innerHTML = lessons
    .map((lesson, index) => `<option value="${index}">${index + 1}. ${lesson.name}</option>`)
    .join('');
}

function renderTarget() {
  const lesson = getCurrentLesson();
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < lesson.text.length; index += 1) {
    const char = lesson.text[index];
    const node = document.createElement('span');
    node.className = 'char';

    if (char === ' ') {
      node.classList.add('space');
      node.textContent = '\u00A0';
    } else {
      node.textContent = char;
    }

    if (index < state.typed.length) {
      if (state.typed[index] === char) {
        node.classList.add('correct');
      } else {
        node.classList.add('incorrect');
      }
    } else if (index === state.typed.length) {
      node.classList.add('current');
    }

    fragment.appendChild(node);
  }

  targetText.replaceChildren(fragment);
  lessonLabel.textContent = `Lesson ${state.lessonIndex + 1} • ${lesson.name}`;
  lessonSelect.value = String(state.lessonIndex);
}

function renderKeyboard() {
  keyboard.innerHTML = keyboardRows
    .map((row) => {
      const rowMarkup = row
        .map((key) => {
          const className = ['Tab', 'Caps', 'Shift', 'Ctrl', 'Alt', 'Backspace', 'Delete', 'Enter', 'Space'].includes(key)
            ? 'key wide'
            : key === 'Space'
              ? 'key space'
              : 'key';

          const keyValue = key === 'Space' ? 'space' : key.toLowerCase();
          return `<div class="${className}" data-key="${keyValue}">${key}</div>`;
        })
        .join('');

      return `<div class="keyboard-row">${rowMarkup}</div>`;
    })
    .join('');
}

function updateStats() {
  const lesson = getCurrentLesson();
  const correctChars = countCorrectChars(state.typed, lesson.text);
  const elapsedSeconds = state.startedAt ? Math.max(state.elapsedMs / 1000, 0.1) : 0;
  const accuracy = state.typed.length ? Math.round((correctChars / state.typed.length) * 100) : 100;
  const wpm = state.startedAt && elapsedSeconds > 0 ? Math.max(0, Math.round((correctChars / 5) / (elapsedSeconds / 60))) : 0;

  wpmEl.textContent = String(wpm);
  accuracyEl.textContent = `${accuracy}%`;
  elapsedEl.textContent = `${Math.max(0, Math.round(elapsedSeconds))}s`;
}

function setLesson(index) {
  state.lessonIndex = (index + lessons.length) % lessons.length;
  state.typed = '';
  state.startedAt = 0;
  state.elapsedMs = 0;
  state.finished = false;
  typingInput.value = '';
  typingInput.disabled = false;

  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  renderTarget();
  updateStats();
  typingInput.focus();
}

function startCounter() {
  if (state.startedAt !== 0 || state.finished) {
    return;
  }

  state.startedAt = performance.now();
  state.timerId = window.setInterval(() => {
    state.elapsedMs = performance.now() - state.startedAt;
    updateStats();
  }, 100);
}

function finishLesson() {
  if (state.finished) {
    return;
  }

  state.finished = true;
  typingInput.disabled = true;

  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }

  updateStats();
}

function handleInput(event) {
  const text = getCurrentLesson().text;
  const nextValue = event.target.value.slice(0, text.length);
  state.typed = nextValue;

  if (state.typed.length > 0 && state.startedAt === 0) {
    startCounter();
  }

  renderTarget();
  updateStats();

  if (state.typed.length >= text.length) {
    finishLesson();
  }
}

function highlightKey(keyName, active) {
  const keyEl = document.querySelector(`[data-key="${keyName}"]`);
  if (!keyEl) {
    return;
  }

  keyEl.classList.toggle('active', active);

  if (!active && state.typed.length > 0) {
    const lastIndex = state.typed.length - 1;
    const targetChar = getCurrentLesson().text[lastIndex];
    if (state.typed[lastIndex] === targetChar) {
      keyEl.classList.add('correct');
      window.setTimeout(() => keyEl.classList.remove('correct'), 250);
    }
  }
}

lessonSelect.addEventListener('change', (event) => {
  setLesson(Number(event.target.value));
});

prevLessonBtn.addEventListener('click', () => setLesson(state.lessonIndex - 1));
nextLessonBtn.addEventListener('click', () => setLesson(state.lessonIndex + 1));
restartBtn.addEventListener('click', () => setLesson(state.lessonIndex));
typingInput.addEventListener('input', handleInput);

typingInput.addEventListener('keydown', (event) => {
  const keyName = event.key === ' ' ? 'space' : event.key.toLowerCase();
  const keyEl = document.querySelector(`[data-key="${keyName}"]`);
  if (!keyEl) {
    return;
  }

  keyEl.classList.add('active');
  window.setTimeout(() => keyEl.classList.remove('active'), 150);

  if (event.key === 'Backspace' && state.typed.length > 0) {
    state.typed = state.typed.slice(0, -1);
    event.preventDefault();
    typingInput.value = state.typed;
    renderTarget();
    updateStats();
  }
});

window.addEventListener('keydown', (event) => {
  const keyName = event.key === ' ' ? 'space' : event.key.toLowerCase();
  const keyEl = document.querySelector(`[data-key="${keyName}"]`);
  if (!keyEl) {
    return;
  }

  keyEl.classList.add('active');
  window.setTimeout(() => keyEl.classList.remove('active'), 150);
});

window.addEventListener('keyup', (event) => {
  const keyName = event.key === ' ' ? 'space' : event.key.toLowerCase();
  highlightKey(keyName, false);
});

renderLessonOptions();
renderKeyboard();
setLesson(0);
