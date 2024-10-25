const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const submitButton = document.getElementById('submit');
const questionElement = document.getElementById('question');
const levelElement = document.getElementById('level');
const questionsLeftElement = document.getElementById('questionsLeft');
const correctCountElement = document.getElementById('correctCount');
const incorrectCountElement = document.getElementById('incorrectCount');
const answerElement = document.getElementById('answer');
const answerContainer = document.getElementById('answerContainer');
const messageElement = document.getElementById('message');
const answerHintElement = document.getElementById('answerHint');

let level = 1;
let correctCount = 0;
let incorrectCount = 0;
let questionCount = 0;
let questions = new Set();

function startGame() {
  correctCount = 0;
  incorrectCount = 0;
  questionCount = 0;
  level = 1;
  questions.clear();
  updateUI();
  answerContainer.style.display = 'block';
  answerElement.value = '';
  nextQuestion();
}

function nextQuestion() {
  if (questionCount >= 10) {
    checkLevelProgress();
    return;
  }

  let question = generateQuestion(level);
  while (questions.has(question.question)) {
    question = generateQuestion(level);
  }
  questions.add(question.question);

  questionElement.innerText = question.question;
  questionElement.dataset.answer = question.answer;
  questionCount++;
  updateUI();
}

function generateQuestion(level) {
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  let question, answer, answerType;

  switch (level) {
    case 1:
      const operators = ['+', '-', '*'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      question = `${num1} ${operator} ${num2}`;
      answer = eval(question);
      answerType = 'число';
      break;

    case 2:
      const comparators = ['>', '<', '==='];
      const comparator = comparators[Math.floor(Math.random() * comparators.length)];
      question = `${num1} ${comparator} ${num2}`;
      answer = eval(question) ? 'true' : 'false';
      answerType = 'true/false';
      break;

    case 3:
      num1 = Math.floor(Math.random() * 16).toString(2);
      num2 = Math.floor(Math.random() * 16).toString(2);
      const logicalOperators = ['&', '|'];
      const logicalOperator = logicalOperators[Math.floor(Math.random() * logicalOperators.length)];
      question = `${num1} ${logicalOperator} ${num2}`;
      answer = (eval(`0b${num1} ${logicalOperator} 0b${num2}`)).toString(2);
      answerType = 'двоичное число';
      break;

    default:
      question = '';
      answer = '';
      answerType = '';
      break;
  }

  answerHintElement.innerText = answerType;
  return { question, answer: answer.toString() };
}

function checkAnswer() {
  const userAnswer = answerElement.value.trim();
  const correctAnswer = questionElement.dataset.answer;

  if (userAnswer === correctAnswer) {
    correctCount++;
  } else {
    incorrectCount++;
  }

  answerElement.value = '';
  updateUI();
  nextQuestion();
}

function updateUI() {
  correctCountElement.innerText = correctCount;
  incorrectCountElement.innerText = incorrectCount;
  questionsLeftElement.innerText = 10 - questionCount;
  levelElement.innerText = ['Начальный', 'Средний', 'Продвинутый'][level - 1];
}

function checkLevelProgress() {
    if (correctCount / questionCount >= 0.8) {
      if (level < 3) {
        level++;
        updateUI();
        messageElement.innerText = `Поздравляем! Вы перешли на ${levelElement.innerText} уровень!`;
        questionCount = 0;
        questions.clear();
        nextQuestion();
      } else {
        messageElement.innerText = 'Поздравляем! Вы прошли игру!';
      }
    } else {
      messageElement.innerText = 'Не удалось пройти уровень. Попробуйте снова.';
      restartButton.style.display = 'block';
    }
  }
  

startButton.addEventListener('click', () => {
  startGame();
  startButton.style.display = 'none';
  restartButton.style.display = 'none';
  messageElement.innerText = '';
});

restartButton.addEventListener('click', () => {
  startGame();
  restartButton.style.display = 'none';
  messageElement.innerText = '';
});

submitButton.addEventListener('click', () => {
  if (answerElement.value.trim() !== '') checkAnswer();
});
