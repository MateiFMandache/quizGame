var score = 0;
var animationTime = 1000;
var penalty = 2;
var timer = false;
var time = 10;
var secondsLeft;

let quizList = document.getElementById("quiz-list")
let question = document.getElementById("question");
let you = document.getElementById("you");
let dinosaur = document.getElementById("dinosaur");
let winner = document.getElementById("winner");
let endingMenu = document.getElementById("ending-menu");
let questionArea = document.getElementById("question-area");
let settings = document.getElementById("settings");
let clock = document.getElementById("clock");
let clockNumber = document.getElementById("seconds-left");
let sheet = document.styleSheets[0];
let quitButton = document.getElementById("quit");
let button1 = document.getElementById("option1");
let button2 = document.getElementById("option2");
let button3 = document.getElementById("option3");
let currentQuestion;
// an object representing the current quiz we are doing
let quiz = null;

// Get quiz list from server and display it in the quiz-list option
// menu

let getQuizList = new XMLHttpRequest();
getQuizList.open("GET", "./quizIndex.txt", true);
getQuizList.onreadystatechange = function() {
  if (getQuizList.readyState == 4 && getQuizList.status == 200) {
    let rawQuizList = getQuizList.responseText;
    let quizArray = rawQuizList.split("\n");
    let menuifiedArray = quizArray.map(name =>
      `<option value = "${name}">${name}</option>`);
    quizList.innerHTML = menuifiedArray.join("\n");
    // Start off by selecting the blank entry
    quizList.selectedIndex = quizArray.length-1;
  }
}
getQuizList.send();

// Get quiz when user selects a quiz, and store in quiz variable
quizList.addEventListener("change", function() {
  if (this.value !== "") {
    let getQuiz = new XMLHttpRequest();
    getQuiz.open("GET", `./${this.value}.json`, true);
    getQuiz.onreadystatechange = function() {
      if (getQuiz.readyState == 4 && getQuiz.status == 200) {
        quiz = JSON.parse(getQuiz.responseText);
      } else if (getQuiz.readyState == 4 && getQuiz.status == 404) {
        alert("quiz not found");
      }
    }
    getQuiz.send();
  } else {
    // No quiz selected
    quiz = null;
  }
});

// Change variables penalty, timer and time when they are changed in
// settings.

let penaltyButtons = document.querySelectorAll("input[name='penalty']");
let timerCheckbox = document.getElementById("timer-checkbox");
let timeEntry = document.getElementById("time-entry")
// Default settings: no timer, 10 seconds, penalty is 2
timeEntry.value = 10;
timerCheckbox.checked = false;
document.getElementById("2").checked = true;
for (let i = 0; i < penaltyButtons.length; i++) {
  let button = penaltyButtons[i];
  button.addEventListener("click", () => {
    penalty = Number(button.value);
  });
}
timerCheckbox.addEventListener("change", () => {
  timer = timerCheckbox.checked;
  // shade in time entry if no timer
  if (timer) {
    timeEntry.style = "background-color: rgba(48, 24, 0, 0);";
  } else {
    timeEntry.style = "background-color: rgba(48, 24, 0, 0.7);";
  }
});
timeEntry.addEventListener("change", () => {
  time = parseInt(timeEntry.value);
});

function start() {
  if (quiz == null) {
    alert("You need to select a quiz");
    return
  }
  // Actions to be performed when user starts quiz
  document.getElementById("settings-and-start").style = "display: none;";
  document.getElementById("quiz-area").style = "display: flex;";
  // reset score to 0
  score = 0;
  // stop any winning dances
  sheet.insertRule(`#you, #dinosaur {
    animation-name: none
  }`, sheet.cssRules.length);
  // reset sizes of characters
  dinosaur.style = "width: 9rem;";
  you.style = "width: 6rem;";
  // hide ending menu
  endingMenu.style = "display: none;";
  // show question area
  questionArea.style = "display: block;";
  // show quit button
  quitButton.style.display = "block"
  // show first question
  currentQuestion = new Question();
  currentQuestion.display();
}

function toggleSettingsVisibility() {
  if (settings.style.display == "none") {
    settings.style.display = "grid";
  } else {
    settings.style.display = "none";
  }
}

function goToSettings() {
  settings.style.display = "grid";
  endingMenu.style.display = "none";
  document.getElementById("settings-and-start").style.display = "flex";
  document.getElementById("quiz-area").style.display =  "none";
}

function quit() {
  // Quit current quiz and go to start menu
  settings.style.display = "none";
  document.getElementById("settings-and-start").style.display = "flex";
  document.getElementById("quiz-area").style.display =  "none";
  currentQuestion.deactivate();
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

function updateScore(value) {
  // Score is capped between 10 and -10
  value = Math.min(Math.max(value, -10), 10);
  // Resize in accordance with new score
  resize(score, value, animationTime, doNextThing);
  score = value;
}

function doNextThing() {
  /**
   * Function to be called after score change animation.
   * Checks for wins or losses and responds accordingly.
   */
  if ((score == 10) || (score == -10)) {
    endingMenu.style.display = "block";
    clock.style.display = "none";
    quitButton.style.display = "none";
    questionArea.style.display = "none";
    if (score == 10) {
      winner.innerHTML = "You won!";
      sheet.insertRule(`#you {
        animation-timing-function: linear;
        animation-name: winning-dance;
        animation-duration: 1.2s;
        animation-iteration-count: infinite;
      }`, sheet.cssRules.length);
    } else if (score == -10) {
      winner.innerHTML = "Quizasaurus has defeated you!";
      document.styleSheets[0].insertRule(`#dinosaur {
        animation-timing-function: linear;
        animation-name: winning-dance;
        animation-duration: 1.2s;
        animation-iteration-count: infinite;
      }`, sheet.cssRules.length);
    }
  } else {
    currentQuestion = new Question();
    currentQuestion.display()
  }
}

function evaluateAnswer(receivedAnswer) {
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

function Question() {
  /**
   * Constructor for a multiple choice question
   */
  let questionData = quiz[Math.floor(Math.random()*quiz.length)]
  this.prompt = questionData.question;
  // Get a random permutation of 1, 2, 3 to tell us which answer goes
  // where
  let buttons = [1, 2, 3];
  this.perm = [ ];
  for (let i = 0; i < 3; i++) {
    this.perm.push(buttons.splice(Math.floor(Math.random()*(3-i)), 1).pop());
  }
  this.answer = this.perm[0];
  this.active = true;
  this.deactivate = function() {
    this.active = false;
    button1.disabled = true;
    button2.disabled = true;
    button3.disabled = true;
  }
  this.display = function() {
    question.innerHTML = this.prompt;
    document.getElementById(`option${this.perm[0]}`).innerHTML =
                                        questionData.correctAnswer;
    document.getElementById(`option${this.perm[1]}`).innerHTML =
                                        questionData.wrongAnswers[0];
    document.getElementById(`option${this.perm[2]}`).innerHTML =
                                        questionData.wrongAnswers[1];
    button1.disabled = false;
    button2.disabled = false;
    button3.disabled = false;
    if (timer) {
      secondsLeft = time;
      clock.style = "display: flex;";
      decreaseClockNumber();
    }
  }
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
      clockNumber.style.fontSize = `${3/(secondsLeft.toString().length)}rem`;
      setTimeout(decreaseClockNumber, 1000);
    } else {
      currentQuestion.deactivate();
      question.innerHTML = "Out of time!"
      updateScore(score - penalty);
    }
  }
}
