"use strict";

function start() {
  document.getElementById("settings-and-start").style = "display: none;";
  document.getElementById("quiz-area").style = "display: block;";
  resize(0, 7, 3000);
}

document.getElementById("start-button").addEventListener("click", start);

function resize(currentScore, finalScore, duration) {
  /**
   * Resizes the smiley and the dinosaur, starting with appropriate
   * sizes based on currentScore, and ending after duration
   * milliseconds with sizes based on finalScore.
   */
  // set sizes based on current score
  document.getElementById("dinosaur").style = "width: " + (9 - 0.9 * currentScore) + "rem;";
  document.getElementById("you").style = "width: " + (6 + 0.6 * currentScore) + "rem;";
  // recursively resize after 30 milliseconds
  if (duration > 30) {
    setTimeout(function () {
      resize(currentScore + (finalScore - currentScore) * 30 / duration, finalScore, duration - 30);
    }, 30);
  } else if (duration > 0) {
    setTimeout(function () {
      resize(finalScore, finalScore, 0);
    }, duration);
  }
}

var quiz = { _score: 0,
  get score() {
    return this._score;
  },
  set score(value) {
    this._score = value;
  } };