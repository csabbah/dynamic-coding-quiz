// Global variables ------ ------ ------ ------ ------ ------ ------ ------ ------ ------
var mainContainer = document.getElementById('main-container');

var questions = [
  {
    question: 'What color is the sky?',
    options: ['red', 'green', 'blue', 'orange'],
    answer: 'blue',
  },
  {
    question: 'Why am i gay?',
    options: ['idk', 'suure', 'why', 'yes'],
    answer: 'idk',
  },
  {
    question: 'Why is soup good?',
    options: ['warm', 'good', 'hot', 'sexy'],
    answer: 'hot',
  },
];

var currentQuiz = 0; // Index of the quiz
var score = 0; // Keeps track of user score
var optionCounter = 1; // Counter for the button label i.e. (1. Green, 2. Blue, etc)
var quizActive = false;
var runOnce = true;

// ------ ------ ------ Timer function
var label = document.querySelector('.timer');
var timeLeft = 60;

const startTimer = () => {
  var timeInterval = setInterval(function () {
    timeLeft -= 1;
    label.innerText = timeLeft;

    // If the timer his 0, stop it and displayResults() which is the end game screen
    if (timeLeft == 0) {
      clearInterval(timeInterval);
      displayResults();
      // The other instance in which we stop the timer involves when the quiz is done AFTER all questions have been answered
    } else if (!quizActive) {
      clearInterval(timeInterval);
    }
  }, 1000);
};
// ------ ------ ------ Load the quiz with the current index and check responses
function loadQuiz() {
  // Run the startTimer function ONCE upon loading quiz
  if (runOnce) {
    quizActive = true;
    startTimer();
    // We run the function again ONLY once the quiz is done, that way we can stop the timer
    // In the startTimer function, if quizActive == false, it stops the timer
  } else if (!quizActive) {
    startTimer();
  }
  runOnce = false; // Set to false so we don't re-run the timer function (This causes a decrement at a faster rate)

  var returnContainer = document.createElement('div');
  returnContainer.classList.add('quiz-container');
  mainContainer.append(returnContainer);
  var elements = `<h1 id="question-label"></h1>
        <ul class="questions"></ul>`;
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.innerHTML = elements;

  // For each quiz, display the questions, options and add an event for the current buttons
  const currentQuizData = questions[currentQuiz];
  var questionLabel = document.getElementById('question-label');
  questionLabel.innerText = currentQuizData.question;
  loadOptions(); // Load all option button elements
  trackEvent(); // Add event listener to all the buttons we generated
  // And check the response we clicked on
}

// ------ ------ ------ Listen for the clicks on the option buttons and extract their data
function trackEvent() {
  var buttons = document.querySelectorAll('.option');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Extract the data attributes from the button (which is the response itself)
      optionPicked = e.target.attributes['data-option'].value;
      checkResponse(optionPicked);
    });
  });
}

// ------ ------ ------ Check result of the user input and determine next course of action
function checkResponse(response) {
  const correct = () => {
    score++;
  };
  const incorrect = () => {};

  response == questions[currentQuiz].answer ? correct() : incorrect();
  currentQuiz++;

  const nextQuestion = () => {
    clearOptions(); // Clear current options
    loadQuiz(); // Load new ones (including new question)
  };
  const quizFinished = () => {
    displayResults(); // Display end game screen
    quizActive = false;
  };

  currentQuiz < questions.length ? nextQuestion() : quizFinished();
}
// ------ ------ ------ Generate the option button elements
function loadOptions() {
  var quizUl = document.querySelector('.questions');

  questions[currentQuiz].options.forEach((option) => {
    var questionEl = document.createElement('li');
    questionEl.innerHTML = `<div><button data-option="${option}" class='btn option'>${optionCounter}. ${option}</button></div>`;
    optionCounter++;
    quizUl.append(questionEl);
  });
}

// ------ ------ ------ Remove current option buttons to replace with the new ones
function clearOptions() {
  var options = document.querySelectorAll('.option');
  options.forEach((option) => {
    option.remove();
  });
  optionCounter = 1; // Reset button label counter
}

function resetQuiz(mainContainer) {
  // Remove the end game screen
  var endGame = document.querySelector('.endgame-container');
  endGame.remove();
  // Re-generate the initial quiz element
  var returnContainer = document.createElement('div');
  returnContainer.classList.add('quiz-container');
  mainContainer.append(returnContainer);
  var elements = `<h1 id="question-label"></h1>
        <ul class="questions"></ul>`;
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.innerHTML = elements;
  // Reset all current data
  currentQuiz = 0; // Index of the quiz
  score = 0; // Correct answers
  optionCounter = 1; // For the button label
  timeLeft = 60; // Reset timer
  label.innerText = timeLeft;
}
// ------ ------ ------ Display the end game result and screen
function displayResults() {
  // End game screen
  // - Inform the user what score they achieved
  // - Inform the user how many questions they got right out of (i.e. 5/10)
  // - Inform the user how much time they had left
  // - Inform the the user if they beat a high score (extract that data from local storage)
  //      - If local storage doesn't exist, add a score of 0 so there's something to compare it with
  //      - If you get stuck on tracking local high score, refer to the robot gladiator project
  // - Allow user to input their initials so we can submit score to local storage
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  var endGame = document.createElement('div');
  endGame.classList.add('endgame-container');
  endGame.innerHTML = `
  <h1>Your score: ${score}</h1>
  <p>You got ${score} out of ${questions.length} correct! Want to play again?</p> 
  <button class='btn btn-action' id='yes'>Yes</button>
  <button class='btn btn-action' id='no'>No</button>
  `;
  mainContainer.append(endGame);

  var options = document.querySelectorAll('.btn-action');
  options.forEach((button) => {
    button.addEventListener('click', (e) => {
      if (e.target.innerText == 'Yes') {
        resetQuiz(mainContainer);
        loadQuiz();
      } else {
        mainContainer.innerHTML = `<div id="intro">
        <h1>Welcome to the quiz!</h1>
        <button id="start-quiz">Start Quiz</button>
        </div>`;

        // Return to the original display
        alert('Done!');
      }
    });
  });
}

var introEl = document.getElementById('intro');
var startQuiz = document.getElementById('start-quiz');

// Upon starting the quiz
startQuiz.addEventListener('click', () => {
  // Remove intro screen and...
  introEl.remove();
  // Start the quiz
  loadQuiz();
});
