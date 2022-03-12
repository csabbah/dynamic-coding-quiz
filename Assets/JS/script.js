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
    question: 'Why do i like COD?',
    options: ['boss', 'ok', 'why', 'arab'],
    answer: 'arab',
  },
  {
    question: 'Am i tranny?',
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
      </div> 
      `;
mainContainer.innerHTML = mainPageEl;

// ------ ------ ------ Timer function
var timeLeft = 60;

const startTimer = () => {
  var timerEl = document.querySelector('.timer');
  timerEl.classList.remove('hidden');

  var timeInterval = setInterval(function () {
    timeLeft -= 1;

    timerEl.innerText = timeLeft;

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

// Execute this if option picked is correct
const correct = () => {
  // Increment score
  score++;
  // Add a class of 'correct' to the label so it changes to green temporarily
  timerEl.classList.add('correct');

  createLabel('Correct!', 'correct');
};
// Execute this if option picked is incorrect
const incorrect = () => {
  // Deduct 5 seconds from the timer
  timeLeft -= 5;
  // Add a class of 'incorrect' to the label so it changes to red temporarily
  timerEl.classList.add('flashRed');

  createLabel('Incorrect!', 'incorrect');
};

// ------ ------ ------ This returns the 'Correct' or 'Incorrect' labels upon selecting options
// This function is being used in checkResponse()
function createLabel(status, classname) {
  var element = document.createElement('div');
  element.classList.add('update-label');
  element.innerHTML = `<hr />
      <h1 class="label ${classname}">${status}!</h1>`;
  mainContainer.append(element);
}
// ------ ------ ------ Check result of the user input and determine next course of action
function checkResponse(response) {
  var timerEl = document.querySelector('.timer');

  // When going through each question, if the label exists, make sure to remove it
  // So that if the next question is the opposite (from correct to incorrect), it updates accordingly
  var removeLabel = document.querySelector('.update-label');
  if (removeLabel) {
    removeLabel.remove();
  }
  // Execute this if option picked is correct
  const correct = () => {
    // Increment score
    score++;
    // Add a class of 'correct' to the label so it changes to green temporarily
    timerEl.classList.add('correct');

    createLabel('Correct!', 'correct');
  };
  // Execute this if option picked is incorrect
  const incorrect = () => {
    // Deduct 5 seconds from the timer
    timeLeft -= 5;
    // Add a class of 'incorrect' to the label so it changes to red temporarily
    timerEl.classList.add('flashRed');

    createLabel('Incorrect!', 'incorrect');
  };

  // If the chosen answer is correct, execute correct() else incorrect()
  response == questions[currentQuiz].answer ? correct() : incorrect();
  currentQuiz++;

  const nextQuestion = () => {
    clearOptions(); // Clear current options
    loadQuiz(); // Load new ones (including new question)
  };
  const quizFinished = () => {
    var buttons = document.querySelectorAll('.option');

    buttons.forEach((button) => {
      button.remove();
    });

    // Add a 1 second delay before display the end game so it shows the final answer result
    // That way if the time is deducted for example, we see that happen THEN it shows the end result
    setTimeout(() => {
      var removeLabel = document.querySelector('.update-label');
      removeLabel.remove();
      displayResults(); // Display end game screen
      quizActive = false;
    }, 1400);
  };

  // If we have not finished the full length of the quiz, execute the nextQuestion() else...
  // Execute quizFinished() function
  currentQuiz < questions.length ? nextQuestion() : quizFinished();

  // Remove the labels and the classes for the timers upon FULL execution of checkResponse()
  var removeLabel = document.querySelector('.update-label');
  if (removeLabel) {
    setTimeout(() => {
      removeLabel.remove();
    }, 1500);
  }

  setTimeout(() => {
    timerEl.classList.remove('flashRed');
  }, 500);
  setTimeout(() => {
    timerEl.classList.remove('correct');
  }, 500);
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
  var elements = `
  <h1 id="question-label"></h1>
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

// ------ ------ ------ End game function to play again
const playAgain = () => {
  // Remove the end game screen
  var endGame = document.querySelector('.endgame-container');
  endGame.remove();

  clearData();

  startTimer();

  var timerEl = document.querySelector('.timer');
  timerEl.innerText = timeLeft;

  resetQuiz(mainContainer);
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  loadQuiz();
};

// ------ ------ ------ End game function to go back to the intro page
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
  var timerEl = document.querySelector('.timer');
  timerEl.classList.add('hidden');
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
      e.target.innerText == 'Yes' ? playAgain() : returnHome();
    });
  });
}

var introEl = document.getElementById('intro');
var startQuiz = document.getElementById('start-quiz');

// This will execute upon first application load...
// Then the functions in displayResults() will from then on
startQuiz.addEventListener('click', () => {
  console.log('testttt');
  // Remove intro screen and...
  introEl.remove();
  // Start the quiz
  startTimer();
  loadQuiz();
});
