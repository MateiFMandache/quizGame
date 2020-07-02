/**
 * A simple script to generate a quiz about ionic compounds in
 * chemistry
 */

let cations = {
  "Li": {
    "name": "lithium",
    "valency": 1
  },
  "Na": {
    "name": "sodium",
    "valency": 1
  },
  "K": {
    "name": "potassium",
    "valency": 1
  },
  "Rb": {
    "name": "rubidium",
    "valency": 1
  },
  "Cs": {
    "name": "caesium",
    "valency": 1
  },
  "Mg": {
    "name": "magnesium",
    "valency": 2
  },
  "Ca": {
    "name": "calcium",
    "valency": 2
  },
  "Sr": {
    "name": "strontium",
    "valency": 2
  },
  "Ba": {
    "name": "barium",
    "valency": 2
  },
}
let anions = {
  "O": {
    "name": "oxide",
    "valency": 2
  },
  "S": {
    "name": "sulfide",
    "valency": 2
  },
  "F": {
    "name": "fluoride",
    "valency": 1
  },
  "Cl": {
    "name": "chloride",
    "valency": 1
  },
  "Br": {
    "name": "bromide",
    "valency": 1
  },
  "I": {
    "name": "iodide",
    "valency": 1
  },
}
let quiz = [ ];
for (let cation in cations) {
  for (let anion in anions) {
    // create a question asking for the formula of a compound formed
    // out of these ions
    let q = {"question": `What is the formula for ${cations[cation]["name"]}
    ${anions[anion]["name"]}`.replace(/\s{2,}/, " ")};
    let answers = [
      `${cation}<sub>2</sub>${anion}`,
      `${cation}${anion}`,
      `${cation}${anion}<sub>2</sub>`
    ]
    let correctAnswerIndex;
    if (cations[cation]["valency"] == anions[anion]["valency"]) {
      correctAnswerIndex = 1;
    } else if (cations[cation]["valency"] == 1 &&
               anions[anion]["valency"] == 2) {
      correctAnswerIndex = 0;
    } else if (cations[cation]["valency"] == 2 &&
               anions[anion]["valency"] == 1) {
      correctAnswerIndex = 2;
    }
    q.correctAnswer = answers.splice(correctAnswerIndex, 1).pop();
    q.wrongAnswers = answers;
    quiz.push(q);
  }
}
let fs = require('fs');
fs.writeFile("Ionic-compounds.json", JSON.stringify(quiz), function(err) {
  if (err) throw err;
  console.log("quiz written");
});
