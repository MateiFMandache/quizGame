"use strict";

var score = 0;
var animationTime = 1000;
var penalty = 2;
var maxNumber = 12;
var timer = false;
var time = 10;
var secondsLeft;

var answerBox = document.getElementById("answer-box");
var submitButton = document.getElementById("submit-button");
var question = document.getElementById("question");
var you = document.getElementById("you");
var dinosaur = document.getElementById("dinosaur");
var winner = document.getElementById("winner");
var endingMenu = document.getElementById("ending-menu");
var questionArea = document.getElementById("question-area");
var settings = document.getElementById("settings");
var clock = document.getElementById("clock");
var clockNumber = document.getElementById("seconds-left");
var sheet = document.styleSheets[0];
var currentQuestion = void 0;

// Change variables penalty, timer and time when they are changed in
// settings.

var penaltyButtons = document.querySelectorAll("input[name='penalty']");
var timerCheckbox = document.getElementById("timer-checkbox");
var timeEntry = document.getElementById("time-entry");
// Default settings: no timer, 10 seconds, penalty is 2
timeEntry.value = 10;
timerCheckbox.checked = false;
document.getElementById("2").checked = true;

var _loop = function _loop(i) {
  var button = penaltyButtons[i];
  button.addEventListener("click", function () {
    penalty = Number(button.value);
  });
};

for (var i = 0; i < penaltyButtons.length; i++) {
  _loop(i);
}
timerCheckbox.addEventListener("change", function () {
  timer = timerCheckbox.checked;
  // shade in time entry if no timer
  if (timer) {
    timeEntry.style = "background-color: rgba(48, 24, 0, 0);";
  } else {
    timeEntry.style = "background-color: rgba(48, 24, 0, 0.7);";
  }
});
timeEntry.addEventListener("change", function () {
  time = parseInt(timeEntry.value);
});

function start() {
  document.getElementById("settings-and-start").style = "display: none;";
  document.getElementById("quiz-area").style = "display: flex;";
  // Clear answer box in case it already contains stuff
  answerBox.value = "";
  // reset score to 0
  score = 0;
  // stop any winning dances
  sheet.insertRule("#you, #dinosaur {\n    animation-name: none\n  }", sheet.cssRules.length);
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
    settings.style = "display: grid;";
  } else {
    settings.style = "display: none;";
  }
}

function goToSettings() {
  settings.style = "display: grid;";
  endingMenu.style = "display: none;";
  document.getElementById("settings-and-start").style = "display: flex;";
  document.getElementById("quiz-area").style = "display: none;";
}

function resize(currentScore, finalScore, duration, callback) {
  /**
   * Resizes the smiley and the dinosaur, starting with appropriate
   * sizes based on currentScore, and ending after duration
   * milliseconds with sizes based on finalScore. When done, calls
   * function callback.
   */
  // set sizes based on current score
  dinosaur.style = "width: " + (9 - 0.9 * currentScore) + "rem;";
  you.style = "width: " + (6 + 0.6 * currentScore) + "rem;";
  // recursively resize after 30 milliseconds
  if (duration > 30) {
    setTimeout(function () {
      resize(currentScore + (finalScore - currentScore) * 30 / duration, finalScore, duration - 30, callback);
    }, 30);
  } else if (duration > 0) {
    setTimeout(function () {
      resize(finalScore, finalScore, 0, callback);
    }, duration);
  } else {
    if (callback !== null) callback();
  }
}

function updateScore(value) {
  // Score is capped between 10 and -10
  value = Math.min(Math.max(value, -10), 10);
  // Resize in accordance with new score
  resize(score, value, animationTime, doNextThing);
  score = value;
}

function doNextThing() {
  if (score == 10) {
    endingMenu.style = "display: block;";
    clock.style = "display: none;";
    questionArea.style = "display: none;";
    winner.innerHTML = "You won!";
    sheet.insertRule("#you {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else if (score == -10) {
    endingMenu.style = "display: block;";
    clock.style = "display: none;";
    questionArea.style = "display: none;";
    winner.innerHTML = "Quizasaurus has defeated you!";
    document.styleSheets[0].insertRule("#dinosaur {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else {
    currentQuestion = new Question();
    currentQuestion.display();
  }
}

function evaluateAnswer() {
  if (answerBox.value !== "") {
    var receivedAnswer = answerBox.value;
    var actualAnswer = currentQuestion.answer;
    currentQuestion.deactivate();
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
  var num1 = 2 + Math.floor((maxNumber - 1) * Math.random());
  var num2 = 2 + Math.floor((maxNumber - 1) * Math.random());
  this.prompt = "What is " + num1 + " times " + num2 + "?";
  this.answer = num1 * num2;
  this.active = true;
  this.deactivate = function () {
    this.active = false;
    submitButton.disabled = true;
    answerBox.value = "";
    answerBox.disabled = true;
  };
  this.display = function () {
    question.innerHTML = this.prompt;
    submitButton.disabled = false;
    answerBox.disabled = false;
    answerBox.focus();
    submitButton.addEventListener("click", evaluateAnswer);
    if (timer) {
      secondsLeft = time;
      clock.style = "display: flex;";
      decreaseClockNumber();
    }
  };
}

function decreaseClockNumber() {
  if (currentQuestion.active) {
    if (secondsLeft > 0) {
      secondsLeft--;
      clockNumber.innerHTML = secondsLeft.toString();
      // Set color of timer depending on seconds left
      switch (secondsLeft) {
        case 2:
          clockNumber.style.color = "#FF7F00";
          break;
        case 1:
          clockNumber.style.color = "#FF3F00";
          break;
        case 0:
          clockNumber.style.color = "#FF0000";
          break;
        default:
          clockNumber.style.color = "var(--brown)";
      }
      // set font size to an appropriate size given the number of digits
      clockNumber.style.fontSize = 3 / secondsLeft.toString().length + "rem";
      setTimeout(decreaseClockNumber, 1000);
    } else {
      currentQuestion.deactivate();
      question.innerHTML = "You ran out of time!";
      updateScore(score - penalty);
    }
  }
}

answerBox.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    submitButton.click();
  }
});