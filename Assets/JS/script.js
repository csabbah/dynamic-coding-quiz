// TO DOS
// - MAYBE - Shuffle questions? Make it random each time
// - When you get a wrong response, add a temporary class to the timer that flashes red (use SetTimeout())
// - Show the user when he got the answer right or wrong (via new element)
// - Add a 'Timer ran out!' element
// - Update the entire UI
// TO QUICKLY FIND THE EDIT POINTS, COMMAND F 'ADD CODE'

// Global variables ------ ------ ------ ------ ------ ------ ------ ------ ------ ------
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
  {
    question: 'Why is my ass haairy?',
    options: ['boss', 'ok', 'why', 'arab'],
    answer: 'arab',
  },
  {
    question: 'Is my dick big?',
    options: ['yes', 'no', 'maybe', 'possibly'],
    answer: 'yes',
  },
];

var mainContainer = document.getElementById('main-container');
var quizContainer = document.querySelector('.quiz-container');

// Initial values
var currentQuiz = 0; // Index of the quiz
var score = 0; // Keeps track of user score
var optionCounter = 1; // Counter for the button label i.e. (1. Green, 2. Blue, etc)
quizActive = true;
runOnce = true;

var mainPageEl = `<div class="timer hidden">60</div>
      <div id="intro">
      <h1>Welcome to the quiz!</h1>
      <button id="start-quiz">Start Quiz</button>
      </div>`;
mainContainer.innerHTML = mainPageEl;

// ------ ------ ------ Timer function
var timeLeft = 60;

const startTimer = () => {
  var label = document.querySelector('.timer');
  label.classList.remove('hidden');

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
const loadQuiz = () => {
  var returnContainer = document.createElement('div');
  returnContainer.classList.add('quiz-container');
  mainContainer.append(returnContainer);
  var elements = `
  <h1 id="question-label"></h1>
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

  runOnce = false; // Set to false so we don't re-run the timer function
};

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
    // ADD CODE - ADD A TEMPORARY CLASS TO THE .TIMER LABEL TO FLASH GREEN
    // - Also generate a new element that tells the user he got the answer right
    score++;
  };
  const incorrect = () => {
    // ADD CODE - ADD A TEMPORARY CLASS TO THE .TIMER LABEL TO FLASH RED
    // - Also generate a new element that tells the user he got the answer wrong
    timeLeft -= 5;
  };

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
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  var options = document.querySelectorAll('.option');
  options.forEach((option) => {
    option.remove();
  });
  optionCounter = 1; // Reset button label counter
}

// ------ ------ ------ Reset the quiz
function resetQuiz(mainContainer) {
  // Re-generate the initial quiz element
  var returnContainer = document.createElement('div');
  returnContainer.classList.add('quiz-container');
  mainContainer.append(returnContainer);
  var elements = `<h1 id="question-label"></h1>
        <ul class="questions"></ul>`;
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.innerHTML = elements;
}

// ------ ------ ------ Clear the data
function clearData() {
  // Reset all current data
  currentQuiz = 0; // Index of the quiz
  score = 0; // Correct answers
  optionCounter = 1; // For the button label
  timeLeft = 60; // Reset timer
  quizActive = true;
  runOnce = true;
}

const playAgain = () => {
  // Remove the end game screen
  var endGame = document.querySelector('.endgame-container');
  endGame.remove();

  clearData();

  startTimer();

  var label = document.querySelector('.timer');
  label.innerText = timeLeft;

  resetQuiz(mainContainer);
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  loadQuiz();
};
const returnHome = () => {
  mainContainer.innerHTML = mainPageEl;
  var startQuiz = document.getElementById('start-quiz');
  var introEl = document.getElementById('intro');

  // Upon starting the quiz again...
  startQuiz.addEventListener('click', () => {
    clearData();
    startTimer();
    // Remove intro screen and...
    introEl.remove();

    loadQuiz();
  });
};

// ------ ------ ------ Display the end game result and screen
function displayResults() {
  // ADD CODE - SHOW THE USER IF THEY BEAT THEIR PREVIOUS HIGH SCORE
  // - Inform the the user if they beat a high score (extract that data from local storage)
  //      - If local storage doesn't exist, add a score of 0 so there's something to compare it with
  //      - If you get stuck on tracking local high score, refer to the robot gladiator project
  // - Allow user to input their initials so we can submit score to local storage
  var label = document.querySelector('.timer');
  label.classList.add('hidden');
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  var endGame = document.createElement('div');
  endGame.classList.add('endgame-container');
  endGame.innerHTML = `<h1>Your score: ${score}</h1>
  <p>You got ${score} out of ${questions.length} correct with ${timeLeft} seconds remaining.</p>
  <form id='submit-initials'> 
  <label for='initials'>Enter your initials</label>
  <input id='initials'></input>
  <button type='submit'>Submit</button> 
  </form>
  <p>Want to play again?</p> 
  <button class='btn btn-action' id='yes'>Yes</button>
  <button class='btn btn-action' id='no'>No</button>`;

  mainContainer.append(endGame);
  var initials = document.getElementById('initials');
  var form = document.getElementById('submit-initials');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(initials.value); // This returns the input value
    initials.value = ''; // Reset value
    // ADD CODE - ENTER CODE HERE TO SAVE TO LOCAL STORAGE
  });

  var options = document.querySelectorAll('.btn-action');
  options.forEach((button) => {
    button.addEventListener('click', (e) => {
      if (e.target.innerText == 'Yes') {
        playAgain();
      } else {
        returnHome();
      }
    });
  });
}

var introEl = document.getElementById('intro');
var startQuiz = document.getElementById('start-quiz');

// This will execute upon first application load...
// Then the functions in displayResults() will from then on
startQuiz.addEventListener('click', () => {
  console.log('testttestt');
  // Remove intro screen and...
  introEl.remove();
  // Start the quiz
  startTimer();
  loadQuiz();
});
