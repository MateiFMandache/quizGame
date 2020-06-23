var score = 0;
var animationTime = 1000;
var penalty = 2;
var maxNumber = 12;
var timer = false;
var time = 10;

let answerBox = document.getElementById("answer-box");
let submitButton = document.getElementById("submit-button");
let question = document.getElementById("question");
let you = document.getElementById("you");
let dinosaur = document.getElementById("dinosaur");
let winner = document.getElementById("winner");
let endingMenu = document.getElementById("ending-menu");
let questionArea = document.getElementById("question-area");
let settings = document.getElementById("settings");
let sheet = document.styleSheets[0];
let currentQuestion;

function start() {
  document.getElementById("settings-and-start").style = "display: none;";
  document.getElementById("quiz-area").style = "display: flex;";
  // Clear answer box in case it already contains stuff
  answerBox.value = "";
  // reset score to 0
  score = 0;
  // stop any winning dances
  sheet.insertRule(`#you, #dinosaur {
    animation-name: none
  }`, sheet.cssRules.length);
  // reset sizes of characters
  dinosaur.style = "width: 9rem;";
  you.style = "width: 6rem;";
  // hide ending ending menu
  endingMenu.style = "display: none;";
  // show question area
  questionArea.style = "display: block;";
  // show first question
  currentQuestion = new Question();
  currentQuestion.display();
  // enable button
  submitButton.disabled = false;
}

function toggleSettingsVisibility() {
  if (settings.style.display == "none") {
    settings.style = "display: grid;"
  } else {
    settings.style = "display: none;"
  }
}

function resize(currentScore, finalScore, duration, callback) {
  /**
   * Resizes the smiley and the dinosaur, starting with appropriate
   * sizes based on currentScore, and ending after duration
   * milliseconds with sizes based on finalScore. When done, calls
   * function callback.
   */
  // set sizes based on current score
  dinosaur.style = `width: ${9-0.9*currentScore}rem;`;
  you.style = `width: ${6+0.6*currentScore}rem;`;
  // recursively resize after 30 milliseconds
  if (duration > 30) {
    setTimeout(function() {resize(currentScore
                                  + (finalScore - currentScore) * 30/duration,
                                  finalScore, duration - 30, callback)}, 30);
  } else if (duration > 0) {
    setTimeout(function() {resize(finalScore, finalScore, 0, callback)},
               duration);
  } else {
    if (callback !== null) callback();
  }
}

function updateScore(value, animate=true) {
  // Score is capped between 10 and -10
  value = Math.min(Math.max(value, -10), 10);
  // Resize in accordance with new score
  resize(score, value, animationTime, doNextThing);
  score = value;
}

function doNextThing() {
  if (score == 10) {
    endingMenu.style = "display: block;";
    questionArea.style = "display: none;";
    winner.innerHTML = "You won!";
    sheet.insertRule(`#you {
      animation-timing-function: linear;
      animation-name: winning-dance;
      animation-duration: 1.2s;
      animation-iteration-count: infinite;
    }`, sheet.cssRules.length);
  } else if (score == -10) {
    endingMenu.style = "display: block;";
    questionArea.style = "display: none;";
    winner.innerHTML = "Quizasaurus has defeated you!";
    document.styleSheets[0].insertRule(`#dinosaur {
      animation-timing-function: linear;
      animation-name: winning-dance;
      animation-duration: 1.2s;
      animation-iteration-count: infinite;
    }`, sheet.cssRules.length);
  } else {
    currentQuestion = new Question();
    currentQuestion.display()
    submitButton.disabled = false;
  }
}

function evaluateAnswer() {
  if (answerBox.value !== "") {
    submitButton.disabled = true;
    var receivedAnswer = answerBox.value;
    answerBox.value = "";
    var actualAnswer = currentQuestion.answer;
    if (receivedAnswer == actualAnswer) {
      question.innerHTML = "Correct!";
      updateScore(score + 1);
    } else {
      question.innerHTML = "Wrong!";
      updateScore(score - penalty);
    }
  }
}

function Question() {
  var num1 = 2 + Math.floor((maxNumber-1) * Math.random());
  var num2 = 2 + Math.floor((maxNumber-1) * Math.random());
  this.prompt = `What is ${num1} times ${num2}?`;
  this.answer = num1 * num2;
  this.display = function() {
    question.innerHTML = this.prompt;
    submitButton.addEventListener("click", evaluateAnswer);
  }
}

answerBox.addEventListener("keydown", event => {
  if (event.keyCode === 13) {
    submitButton.click();
  }
})
