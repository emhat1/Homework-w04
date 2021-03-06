
//Setting start parameters
var userScore = 0;
var startTime = 30;
var intervalID;
var time;
var currentQuestion;

//Array of questions for the quiz
const questions = [
    {
        questionText: "In JavaScript, what brackets surround a function?",
        answerOptions: ["1. Normal brackets ()", "2. Square brackets []", "3. Curly brackets {}", "4. Triangular brackets <>"],
        correctAnswer: "3. Curly brackets {}",
    },
    {
        questionText: "What kind of data can be stored in JavaScript arrays?",
        answerOptions: ["1. Numbers", "2. Strings", "3. Booleans", "4. All of the above"],
        correctAnswer: "4. All of the above",
    },
    {
        questionText: "What is the primary function of JavaScript in web pages?",
        answerOptions: ["1. To store basic content", "2. To alter the appearance of the page", "3. To provide functionality to the page and allow interaction", "4. All of the above"],
        correctAnswer: "3. To provide functionality to the page and allow interaction",
    },
    {
        questionText: "Which of the below is a JavaScript command?",
        answerOptions: ["1. class='MainHeading'", "2. font-family=serif", "3. meta charset='UTF-8'", "4. var name = document.getElementById('name')"],
        correctAnswer: "4. var name = document.getElementById('name')"
    },
    {
        questionText: "What is the correct way to call the random method on the Math global object?",
        answerOptions: ["1. random.Math()", "2. Math(random)", "3. Math.random()", "4. math.random()"],
        correctAnswer: "3. Math.random()",
    },
    {
        questionText: "What is string concatenation?",
        answerOptions: ["1. When you print string to the console", "2. When you join strings together", "3. When you assign a string to a variable", "4. When you change a variable's value"],
        correctAnswer: "2. When you join strings together",
        
    },
]

//Organise cards and label with variables
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

//Hide all cards initially
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

//Let's get things started!
document.querySelector("#start-btn").addEventListener("click", startQuiz);
const resultDiv = document.getElementById("result-div");
const resultText = document.getElementById("result-text");

function startQuiz() {
    hideCards();
    userScore = 0;
    questionCard.removeAttribute("hidden");
  
    //Assign numbers to questions (to allow cycling through)
    currentQuestion = 0;
    displayQuestion();

    //Set time (5 seconds per question; allows for addition of futher questions in the future)
    time = questions.length * 5;
  
    intervalID = setInterval(countdown, 1000);
}

// Populate the question and options from questions[]
function displayQuestion() {
  document.getElementById("question-text").textContent = questions[currentQuestion].questionText;
  document.getElementById("option0").textContent = questions[currentQuestion].answerOptions[0];
  document.getElementById("option1").textContent = questions[currentQuestion].answerOptions[1];
  document.getElementById("option2").textContent = questions[currentQuestion].answerOptions[2];
  document.getElementById("option3").textContent = questions[currentQuestion].answerOptions[3];
}

// Hide and display the result
function hideResultText() {
  resultText.removeAttribute("hidden");
}

//Have the counter counting down, then stopping at the end
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
      endQuiz();
    }
  }

//Show the current time of the page
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

//Behaviour when an answer button is clicked
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//Check for correct answer and penalise if incorrent
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].correctAnswer;
}

function checkAnswer(eventObject) { 
  let optionBtn = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionBtn)) {
    resultText.textContent = "That's right";
    userScore ++;
    setTimeout(hideResultText, 1000);
      } else {
    resultText.textContent = "That's not right";
    setTimeout(hideResultText, 1000);
    if (time >= 5) {
      time = time-5;
      displayTime();
  } else {
    time = 0;
    displayTime();
    endQuiz();
  }
}
  
//Increment current question by 1, continue until all questions used
  currentQuestion++;
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

// Done
function endQuiz() {
  questionCard.setAttribute("hidden", true);
  document.getElementById("score").textContent = userScore;
  scoreCard.removeAttribute("hidden");
  clearInterval(intervalID);
}

//Update the leaderboard on local storage
function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//Access locally stored leaderboard and transform into a javascript object
function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    let leaderboardArray = [];
    return leaderboardArray;
  }  
}

//Display the leaderboard on the leaderboard card
function renderLeaderboard() {
  //let sortedLeaderboardArray = sortLeaderboard();
  let leaderboardArray = getLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < leaderboardArray.length; i++) {
    let leaderboardEntry = leaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score + " of " + questions.length;
    highscoreList.append(newListItem);
  }
}

//Clear the leaderboard and local storage
const clearButton = document.querySelector("#clear-btn");
clearButton.addEventListener("click", clearHighscores);
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

//Save score and display the leaderboard
var submitBtn = document.querySelector("#submit-btn");
submitBtn.addEventListener("click", leaderboardDisplay);

function leaderboardDisplay() {
  var leaderboardEntry = {
    initials:document.getElementById("initials").value, 
    score:userScore
  }
  //updateStoredLeaderboard(document.getElementById("initials").value);
  updateStoredLeaderboard(leaderboardEntry);
  renderLeaderboard();
  hideCards();
  leaderboardCard.removeAttribute("hidden");
}

//Return to starting page
const backBtn = document.querySelector("#back-btn");
backBtn.addEventListener("click", returnToStart);

function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}
