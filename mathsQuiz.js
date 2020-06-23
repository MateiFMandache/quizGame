"use strict";

var score = 0;
var animationTime = 1000;
var penalty = 2;
var maxNumber = 12;
var timer = false;
var time = 10;

var answerBox = document.getElementById("answer-box");
var submitButton = document.getElementById("submit-button");
var question = document.getElementById("question");
var you = document.getElementById("you");
var dinosaur = document.getElementById("dinosaur");
var sheet = document.styleSheets[0];

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
  var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  // Score is capped between 10 and -10
  value = Math.min(Math.max(value, -10), 10);
  // Resize in accordance with new score
  resize(score, value, animationTime, doNextThing);
  score = value;
}

function doNextThing() {
  if (score == 10) {
    question.innerHTML = "You won!";
    sheet.insertRule("#you {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else if (score == -10) {
    question.innerHTML = "Quizasaurus has defeated you!";
    document.styleSheets[0].insertRule("#dinosaur {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else {
    currentQuestion = new Question();
    currentQuestion.display();
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

var currentQuestion = new Question();
currentQuestion.display();

function Question() {
  var num1 = 2 + Math.floor((maxNumber - 1) * Math.random());
  var num2 = 2 + Math.floor((maxNumber - 1) * Math.random());
  this.prompt = "What is " + num1 + " times " + num2 + "?";
  this.answer = num1 * num2;
  this.display = function () {
    question.innerHTML = currentQuestion.prompt;
    submitButton.addEventListener("click", evaluateAnswer);
  };
}

answerBox.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    submitButton.click();
  }
});