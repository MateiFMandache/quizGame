"use strict";

var score = 0;
var animationTime = 1000;
var penalty = 2;
var maxNumber = 12;
var timer = false;
var time = 10;

function start() {
  document.getElementById("settings-and-start").style = "display: none;";
  document.getElementById("quiz-area").style = "display: flex;";
  // Clear answer box in case it already contains stuff
  document.getElementById("answer-box").value = "";
}

function resize(currentScore, finalScore, duration, callback) {
  /**
   * Resizes the smiley and the dinosaur, starting with appropriate
   * sizes based on currentScore, and ending after duration
   * milliseconds with sizes based on finalScore. When done, calls
   * function callback.
   */
  // set sizes based on current score
  document.getElementById("dinosaur").style = "width: " + (9 - 0.9 * currentScore) + "rem;";
  document.getElementById("you").style = "width: " + (6 + 0.6 * currentScore) + "rem;";
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
  var sheet = document.styleSheets[0];
  if (score == 10) {
    document.getElementById("question").innerHTML = "You won!";
    sheet.insertRule("#you {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else if (score == -10) {
    document.getElementById("question").innerHTML = "Quizasaurus has defeated you!";
    document.styleSheets[0].insertRule("#dinosaur {\n      animation-timing-function: linear;\n      animation-name: winning-dance;\n      animation-duration: 1.2s;\n      animation-iteration-count: infinite;\n    }", sheet.cssRules.length);
  } else {
    currentQuestion = new Question();
    currentQuestion.display();
    document.getElementById("submit-button").disabled = false;
  }
}

function evaluateAnswer() {
  document.getElementById("submit-button").disabled = true;
  var receivedAnswer = document.getElementById("answer-box").value;
  document.getElementById("answer-box").value = "";
  var actualAnswer = currentQuestion.answer;
  if (receivedAnswer == actualAnswer) {
    document.getElementById("question").innerHTML = "Correct!";
    updateScore(score + 1);
  } else {
    document.getElementById("question").innerHTML = "Wrong!";
    updateScore(score - penalty);
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
    document.getElementById("question").innerHTML = currentQuestion.prompt;
    document.getElementById("submit-button").addEventListener("click", evaluateAnswer);
  };
}

document.getElementById("answer-box").addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("submit-button").click();
  }
});