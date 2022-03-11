var questions = [
  {
    question: 'What color is the sky?',
    options: {
      incorrect: 'red',
      correct: 'blue',
      incorrect: 'orange',
      incorrect: 'gray',
    },
  },
];

for (let i = 0; i < questions[0].options.length; i++) {
  console.log(questions[0].options[i]);
}
