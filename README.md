# quizGame
A simple educational quiz game. To run this on your own computer, follow the following steps:
 - Download the files or clone the repository
 - [Install node](https://nodejs.org/)
 - Run quizServer.js. To do this, go to the directory where quizServer.js is and type node quizServer.js into the command line
 - Open a browser and go to localhost:3210
You can choose to play with a timer, and change the penalty for wrong answers in the settings. 

You can either play a times table quiz or one of the multiple choice quizzes. There are two built in multiple choice quizzes. The Henry the eighth only has one question, and is mainly included for testing purposes. The ionic compounds quiz has 54 questions, and tests knowledge about various ionic compounds.
# How to create your own quiz
In addition to the built in multiple choice quizzes, you can create your own multiple choice quiz by following the following steps:
 - Create a file called Your-quiz-name.json (replace Your-quiz-name with the name of your quiz)
 - Inside the file, write out the questions that make up your quiz in the following format:
```
[{question: "First question goes here", correctAnswer:"Correct answer goes here",
  wrongAnswers: ["First wrong answer goes here", "Second wrong answer goes here"]},
 {question: "Second question goes here", correctAnswer:"Correct answer goes here",
  wrongAnswers: ["First wrong answer goes here", "Second wrong answer goes here"]},
                                        ...
 {question: "Last question goes here", correctAnswer:"Correct answer goes here",
  wrongAnswers: ["First wrong answer goes here", "Second wrong answer goes here"]}]
```
 - Add the name of your quiz on a new line in the file quizIndex.txt (Make sure the name matches the file name you gave for Your-quiz-name.json, but without the .json)
 - Now when you play the quiz game and choose multiple choice quizzes, your new quiz should appear in the dropdown menu
