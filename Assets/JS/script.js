// Carlos Sabbah - Quiz Challenge - March 14th 2022

// ------ ------ ------ Global variables
var questions = [
  {
    question: 'Commonly used data types do NOT include:',
    options: ['Strings', 'Booleans', 'Alerts', 'Numbers'],
    answer: 'Alerts',
  },
  {
    question: 'The condition in an if/else statement is enclosed in:',
    options: ['Quotes', 'Parenthesis', 'Curly Brackets', 'Square Brackets'],
    answer: 'Parenthesis',
  },
  {
    question: 'Arrays in JavaScript can be used to store:',
    options: [
      'Numbers and Strings',
      'Other Arrays',
      'Booleans',
      'All of the above',
    ],
    answer: 'All of the above',
  },
  {
    question:
      'String values must be enclosed within ______ when being assigned to variables',
    options: ['Commas', 'Curly Brackets', 'Quotes', 'Parenthesis'],
    answer: 'Quotes',
  },
  {
    question:
      'A very useful tool used during development and debugging for printing content to the debugger is:',
    options: ['JavaScript', 'Terminal Bash', 'for loops', 'console.log'],
    answer: 'console.log',
  },
  {
    question: 'What does forEach do?',
    options: [
      'Loops over data',
      'Adds values',
      'Logs results',
      'Creates events',
    ],
    answer: 'Loops over data',
  },
  {
    question: 'The appendChild() method places a node as the ____ child.',
    options: ['First', 'Middle', 'Random', 'Last'],
    answer: 'Last',
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
var storedScores = [];

// This will create the main page element so we can revert back to this when user clicks 'no' to playing again
var mainPageEl = `<div class="timer hidden">60</div>
      <div id="intro-highscore-container">
        <div id="inner-score">
          <h1>Highscores</h1>
          <div class="box"></div>
          <button class="btn clear-score">Clear Highscore</button>
          <button class="btn go-back">Go back</button>
        </div>
      </div>
      <div id="intro">
      <h1>Coding Quiz Challenge!</h1>
      <p id='desc'>Try to answer the following code-related 
      questions within the time limit. Keep in mind that incorrect 
      answers will penalize your score/time by 5 seconds!</p>
      <div id='intro-options'>
      <button id="start-quiz">Start Quiz</button>
      <button id='highscore'>View highscore</button>
      </div>
      </div> 
      `;

// ------ ------ ------ Local Storage functions
// Return the local storage scores and assign them to the array
function returnLocalScore() {
  // Check for the local storage score...
  var localScore = localStorage.getItem('scores');
  // If it's empty, return nothing
  if (localScore === null) {
  } else {
    // Else, parse the data so we can use it throughout the application
    // Get the stored scores
    // Parse the data
    parsedScore = JSON.parse(localScore);
    // This adds the active scores from the local storage to the array

    parsedScore.forEach((item) => {
      if (item.initials == undefined || item.highscore == undefined) {
      } else {
        tempVal = {
          initials: item.initials,
          highscore: item.highscore,
          id: item.Id,
          timeLeft: item.timeLeft,
        };
        storedScores.push(tempVal);
      }
    });
  }
}
// Save the score to both the array and the local storage
function saveScore(initialVal, scoreVal, Id, timeLeft) {
  tempVal = {
    initials: initialVal,
    highscore: scoreVal,
    id: Id,
    timeLeft: timeLeft,
  };
  storedScores.push(tempVal);
  localStorage.setItem('scores', JSON.stringify(storedScores));
}
returnLocalScore();

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
      // The other instance in which we stop the timer involves...
      // when the quiz is done AFTER all questions have been answered
    } else if (!quizActive) {
      clearInterval(timeInterval);
    }
    // Decrement by 1 second each iteration
  }, 1000);
};

// ------ ------ ------ Load the quiz with the current index and check responses
const loadQuiz = () => {
  // Create the quiz container and include the question label and the UL which holds the options
  var returnContainer = document.createElement('div');
  returnContainer.classList.add('quiz-container');
  mainContainer.append(returnContainer);
  var elements = `
  <h1 id="question-label"></h1>
  <ul class="questions"></ul>`;
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.innerHTML = elements;

  // For each quiz, display the questions, options and add an event for the current buttons
  const currentQuizData = questions[currentQuiz]; // Go through the array using the currentQuiz index
  var questionLabel = document.getElementById('question-label');
  questionLabel.innerText = currentQuizData.question; // Add the question to the element innerText
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
      checkResponse(optionPicked); // Check the response the user chose
    });
  });
}

// Execute this if option picked is correct
const correct = () => {
  // Increment score
  score++;
  // Add a class of 'correct' to the label so it changes to green temporarily
  timerEl.classList.add('correct');
  // Create and display the label
  createLabel('Correct!', 'correct');
};
// Execute this if option picked is incorrect
const incorrect = () => {
  // Deduct 5 seconds from the timer
  timeLeft -= 5;
  // Add a class of 'incorrect' to the label so it changes to red temporarily
  timerEl.classList.add('flashRed');
  // Create and display the label
  createLabel('Incorrect!', 'incorrect');
};

// ------ ------ ------ This returns the 'Correct' or 'Incorrect' labels upon selecting options
// This function is being used in checkResponse()
function createLabel(status, classname) {
  var element = document.createElement('div');
  element.classList.add('update-label');
  element.innerHTML = `<hr />
      <h1 class="label ${classname}">${status}</h1>`;
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
    // Remove all button options
    var buttons = document.querySelectorAll('.option');
    buttons.forEach((button) => {
      button.remove();
    });

    // Add a 1.3 second delay before display the end game so it shows the final answer result
    // That way if the time is deducted for example, we see that happen THEN it shows the end result
    setTimeout(() => {
      var removeLabel = document.querySelector('.update-label');
      removeLabel.remove();
      displayResults(); // Display end game screen
      quizActive = false;
    }, 1300);
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
    questionEl.innerHTML = `<div><button data-option="${option}" 
    class='btn option'>${optionCounter}. ${option}</button></div>`;
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
  // reset the highscore scores
  var highscoreSubmission = document.querySelector('.box');
  highscoreSubmission.innerHTML = '';

  // Remove the dynamically added label when user plays again
  var infoEl = document.querySelector('.score-info');
  infoEl.remove();

  // Remove score element so user can see the questions again
  var mainHighscoreEl = document.getElementById('inner-score');
  mainHighscoreEl.style.display = 'none';

  // Update main container styling
  mainContainer.style.justifyContent = 'space-between';
  mainContainer.style.flexDirection = 'row-reverse';
  mainContainer.style.alignItems = 'unset';

  // Remove the end game screen
  var endGame = document.querySelector('.endgame-container');
  endGame.remove();

  // Set everything to initial status i.e. score = 0
  clearData();

  // Start the timer
  startTimer();
  // Reset the timer, right now, timeLeft is reverted back to 60 seconds
  var timerEl = document.querySelector('.timer');
  timerEl.innerText = timeLeft;

  resetQuiz(mainContainer);
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  loadQuiz();
};

// ------ ------ ------ End game function to go back to the intro page
const returnHome = () => {
  // Update main container styling
  mainContainer.style.justifyContent = 'space-between';
  mainContainer.style.flexDirection = 'row-reverse';
  mainContainer.style.alignItems = 'unset';

  // Revert back to the intro screen
  mainContainer.innerHTML = mainPageEl;
  var startQuiz = document.getElementById('start-quiz');
  var introEl = document.getElementById('intro');

  handleHighscore();
  oneTime = true;
  // Bring back the original buttons for the high score element
  // Note - when user finishes quiz, i remove the 'clear score' and 'go back' buttons
  var clearBtn = document.querySelector('.clear-score');
  var goBackBtn = document.querySelector('.go-back');
  clearBtn.style.display = 'unset';
  goBackBtn.style.display = 'unset';
  // // This is the label that informs the user where to reset the scores
  // var info = document.getElementById('score-info');
  // info.style.display = 'none';

  // Upon starting the quiz again...
  startQuiz.addEventListener('click', () => {
    clearData();
    startTimer();
    // Remove intro screen and...
    introEl.remove();

    loadQuiz();
  });
};

// ------ ------ ------ Generate the end game element
function generateEndgameEl() {
  // This will create the post submission element container
  var postSubmitEl = `<div class='post-submission-el hidden'> 
<div class='play-again'>
<p>Want to play again?</p> 
<div id='play-again-btns'>
<button class='btn btn-action' id='yes'>Yes</button>
<button class='btn btn-action' id='no'>No</button>
</div>
</div>
</div>`;

  // Hide the timer since we are in the results phase
  var timerEl = document.querySelector('.timer');
  timerEl.classList.add('hidden');
  // Remove the quiz container
  var quizContainer = document.querySelector('.quiz-container');
  quizContainer.remove();
  // Then create a dynamic end game screen including the form and the results from the quiz
  var endGame = document.createElement('div');
  endGame.classList.add('endgame-container');
  // If the time left is 0, generate a specific end game screen to inform the user
  endGame.innerHTML = `
  <div class='end-game-header'>
  ${
    timeLeft == 0
      ? `<h1 id='timeout'>Timer ran out!<h1/>`
      : `<h1 id='done'>All done!</h1>`
  } <em>Your final score is ${score} with ${timeLeft} seconds remaining.</em>
  </div>
  <form id='submit-initials'> 
  <label for='initials'>Enter initials:</label>
  <input id='initials'></input>
  <button id='submit' type='submit'>Submit</button> 
  </form>
  ${postSubmitEl}`;

  // Additional styling to the mainContainer
  mainContainer.style.justifyContent = 'center';
  mainContainer.style.flexDirection = 'column';
  mainContainer.style.alignItems = 'center';

  // Finally, append the elements we generated above to the main container
  mainContainer.append(endGame);
}

// ------ ------ ------ In the end game element, show all scores and then compare current score
// with saved scores (if they exist)
function displayHighscore(
  id,
  longestDuration,
  largestNum,
  highscoreSubmission
) {
  // Then after the sorting, generate the elements and add them to the score container
  for (let i = 0; i < parsedScore.length; ) {
    // Add a specific color and text to the most current score
    if (parsedScore[i].id == id) {
      prevScore = document.createElement('p');
      prevScore.classList.add('user-scores');
      prevScore.innerText = `${parsedScore[i].initials} - - Score: ${parsedScore[i].highscore} - - Time left: ${parsedScore[i].timeLeft} sec < Current Score`;
      prevScore.style.color = 'red';
    } else {
      // Otherwise just add the score with no special text or styling
      prevScore = document.createElement('p');
      prevScore.classList.add('user-scores');
      prevScore.innerText = `${parsedScore[i].initials} - - Score: ${parsedScore[i].highscore} - - Time left: ${parsedScore[i].timeLeft} sec`;
    }
    highscoreSubmission.appendChild(prevScore);
    i++;
  }

  // Compare the current stats with the stats in the local storage object
  if (parsedScore.length < 2) {
  } else {
    // Alert the user accordingly based on the conditions
    currentScore == largestNum
      ? alert(`You tied with the highest score with ${currentScore} score!`)
      : '';
    currentScore > largestNum
      ? alert(`You achieved the high score of ${score}!`)
      : '';
    currentScore < largestNum ? alert('You did not achieve a high score!') : '';
    currentTime > longestDuration
      ? alert(
          `You achieved the longest duration remaining of ${timeLeft} seconds!`
        )
      : '';
  }
}

// ------ ------ ------ Display the end game result and execute the various conditions
function displayResults() {
  generateEndgameEl();

  // Everything below handles the form handling and submission
  var initials = document.getElementById('initials');
  var form = document.getElementById('submit-initials');
  var highscoreSubmission = document.querySelector('.box');
  var endgameHeaderEl = document.querySelector('.end-game-header');
  var postSubmitEl = document.querySelector('.post-submission-el');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the browser from refreshing

    if (
      // If the field is empty, inform the user...
      initials.value == '' ||
      initials.value == null ||
      initials.value == undefined
    ) {
      alert('Please type an initial');
      // Else use the data and alter the elements
    } else {
      var mainHighscoreEl = document.getElementById('inner-score');
      mainHighscoreEl.style.display = 'unset';
      var clearBtn = document.querySelector('.clear-score');
      var goBackBtn = document.querySelector('.go-back');
      // Create an element specifically in the end game phase to inform the user where they can go to
      // reset their high score. This element will be removed when returning home
      var resetInfo = document.createElement('p');
      resetInfo.classList.add('score-info');
      resetInfo.innerHTML =
        'Score is sorted from highest to lowest. To reset data, click "No" & <em>view highscore</em>';
      mainHighscoreEl.append(resetInfo);

      // Hide the 'Clear highscore" and "Go back" buttons from the highscore container as there is no need.
      // Reason for this > there is already a "want to play again?" prompt that handles the functions
      clearBtn.style.display = 'none';
      goBackBtn.style.display = 'none';

      // Alter the end game screen elements styling
      endgameHeaderEl.style.display = 'none';
      postSubmitEl.classList.remove('hidden');
      postSubmitEl.classList.add('active');
      postSubmitEl.style.display = 'flex';
      form.style.display = 'none';

      // Extract the largest number from the local storage BEFORE we store the current value
      if (storedScores < 1) {
      } else {
        var largestNum = parsedScore.reduce(
          (num1, num2) =>
            (num1 = num1 > num2.highscore ? num1 : num2.highscore),
          0
        );
        var longestDuration = parsedScore.reduce(
          (num1, num2) => (num1 = num1 > num2.timeLeft ? num1 : num2.timeLeft),
          0
        );
      }

      // Assign a unique ID to each score for easy reference
      // We also refer to this ID when checking for the current score on the leader board
      var id = Math.ceil(Math.random(1) * 100000);

      timeLeft += 1; // The time decrements by 1 at this stage so i increment by 1 to account for this

      // Save the current score and time so we can compare it with the other scores
      currentScore = score;
      currentTime = timeLeft;

      // This adds the score and initials to the local storage
      saveScore(initials.value, score, id, timeLeft);

      // We then parse the local storage data
      var localScore = localStorage.getItem('scores');
      parsedScore = JSON.parse(localScore);

      // Sort the object from high to low (based on the score value)
      parsedScore.sort(function (a, b) {
        return b['highscore'] - a['highscore'];
      });

      displayHighscore(id, longestDuration, largestNum, highscoreSubmission);

      initials.value = ''; // Reset value
    }
  });

  // This tracks the 'Yes' and "No" prompts at the very end of the game
  var options = document.querySelectorAll('.btn-action');
  options.forEach((button) => {
    button.addEventListener('click', (e) => {
      // If they chose yes, playAgain() else returnHome()
      // playAgain() re-generates the quiz container elements and starts the game again
      // returnHome() returns the initial intro screen (the menu itself) and resets the quiz data (i.e. score)
      // So that if user plays again, it's good to go
      e.target.innerText == 'Yes' ? playAgain() : returnHome();
    });
  });
}

// This entire block preserves the event listeners for the highscore element (page)
// The reason for this > since we use innerHTML a lot, it disrupts MANY event listeners, therefore...
// anytime an edit is made using innerHTML, i re-call the event listeners ( i.e. handleHighscore() )
var oneTime = true;
const handleHighscore = () => {
  var introEl = document.getElementById('intro');
  var highscoreBtn = document.getElementById('highscore');
  var mainHighscoreEl = document.getElementById('inner-score');
  var main = document.getElementById('main-container');
  highscoreBtn.addEventListener('click', () => {
    // Upon clicking the view highscore button, hide the intro and display the highscore element instead
    introEl.style.display = 'none';
    mainHighscoreEl.style.display = 'unset';
    main.style.justifyContent = 'center';
    var highscoreValues = document.querySelector('.box');
    var clearScore = document.querySelector('.clear-score');

    returnLocalScore(); // Extract the local storage array and parse it so we have the most up to update set

    // If the score in local doesn't exist, then return nothing...
    var localScore = localStorage.getItem('scores');

    if (localScore === null) {
    } else {
      if (oneTime) {
        // Sort the object from high to low (based on the score value)
        parsedScore.sort(function (a, b) {
          return b['highscore'] - a['highscore'];
        });

        // else, add the local storage scores to the HTML element
        parsedScore.forEach((item) => {
          if (item.initials == undefined || item.highscore == undefined) {
          } else {
            // For each data in the array, create a <p> element with the stored initials and scores...
            const newEl = document.createElement('p');
            newEl.classList.add('user-scores');
            newEl.innerText = `${item.initials} - - Score: ${item.highscore} - - Time left: ${item.timeLeft} sec`;
            // Then append it to the appropriate container
            highscoreValues.appendChild(newEl);
          }
        });
      }
    }

    oneTime = false;

    clearScore.addEventListener('click', () => {
      // If there are no score, alert the user
      if (storedScores.length < 1) {
        alert('No high scores to reset');
      } else {
        // Otherwise, clear it
        highscoreValues.innerHTML = '';
        localStorage.clear();
        storedScores = [];
      }
    });

    var goBack = document.querySelector('.go-back');
    // If user hits 'go back'...
    goBack.addEventListener('click', () => {
      // Reload the page
      location.reload();
    });
  });
};

var highscoreBtn = document.getElementById('highscore');
var mainHighscoreEl = document.getElementById('inner-score');
var introEl = document.getElementById('intro');
var startQuiz = document.getElementById('start-quiz');

// Execute the event listener for the high score elements
handleHighscore();

// This will execute upon first application load...
// Then the functions in displayResults() will execute from then on
startQuiz.addEventListener('click', () => {
  mainHighscoreEl.style.display = 'none'; // When the quiz starts, hide the highscore element
  // so it doesn't disrupt the layout. It will re-display upon end game

  // Remove intro screen and...
  introEl.remove();
  // Start the quiz
  startTimer();
  loadQuiz();
});
