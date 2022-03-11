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

// Count down timer
var label = document.querySelector('.timer');
var timeLeft = 60;
var timeInterval = setInterval(function () {
  timeLeft -= 1;
  label.innerText = timeLeft;

  if (timeLeft == 0) {
    clearInterval(timeInterval);
    displayResults();
  }
}, 1000);

// ------ ------ ------ ------ ------ ------ ------ ------ ------ ------

var currentQuiz = 0; // Index of the quiz
var score = 0; // Keeps track of user score
var optionCounter = 1; // Counter for the button label i.e. (1. Green, 2. Blue, etc)

// ------ ------ ------ Load the quiz with the current index and check responses
function loadQuiz() {
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
    console.log(true);
  };
  const incorrect = () => {
    console.log(false);
  };

  response == questions[currentQuiz].answer ? correct() : incorrect();
  currentQuiz++;

  const nextQuestion = () => {
    clearOptions(); // Clear current options
    loadQuiz(); // Load new ones (including new question)
  };
  const quizFinished = () => {
    displayResults(); // Display end game screen
    clearInterval(timeInterval); // Stop the timer
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

  alert(score);
}

loadQuiz();
