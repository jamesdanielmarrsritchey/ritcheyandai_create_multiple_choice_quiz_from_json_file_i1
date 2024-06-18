// Function to generate the quiz form from a JSON file
async function generateFormFromJSON(jsonFilePath) {
  try {
    const response = await fetch(jsonFilePath);
    const questions = await response.json();
    const form = document.getElementById('quizForm');
    questions.forEach((question, index) => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = question.questionText;
      fieldset.appendChild(legend);
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question${index}`;
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        fieldset.appendChild(label);
        fieldset.appendChild(document.createElement('br'));
      });
      form.appendChild(fieldset);
    });
  } catch (error) {
    console.error('Error loading quiz:', error);
  }
}

// Function to evaluate the quiz answers and display results
async function evaluateQuiz(event, jsonFilePath) {
  event.preventDefault(); // Prevent the default form submission
  let score = 0; // Initialize score

  try {
    const response = await fetch(jsonFilePath);
    const questions = await response.json();
    questions.forEach((question, index) => {
      const selectedOption = document.querySelector(`input[name="question${index}"]:checked`)?.value;
      if (selectedOption === question.correctOption) {
        score++; // Increment score for correct answer
      }
    });

    // Display the score and correct answers
    displayResults(score, questions);
  } catch (error) {
    console.error('Error evaluating quiz:', error);
  }
}

// Function to display results
function displayResults(score, questions) {
  const resultsSection = document.getElementById('results') || document.createElement('div');
  resultsSection.innerHTML = ''; // Clear previous results
  const scoreElement = document.createElement('p');
  scoreElement.textContent = `Your Score: ${score} out of ${questions.length}`;
  resultsSection.appendChild(scoreElement);

  questions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question${index}"]:checked`)?.value;
    console.log(`Question ${index + 1} selected option:`, selectedOption); // Debugging line
    console.log(`Question ${index + 1} correct option:`, question.correctOption); // Debugging line

    if (selectedOption !== question.correctOption) {
      const answerElement = document.createElement('p');
      answerElement.textContent = `Q${index + 1}: Correct answer is "${question.correctOption}"`;
      resultsSection.appendChild(answerElement);
    }
  });

  document.body.appendChild(resultsSection);
}

// Setup event listeners and initial function calls
document.addEventListener('DOMContentLoaded', () => {
  const jsonFilePath = 'quiz.json'; // Define the JSON file path here
  generateFormFromJSON(jsonFilePath).then(() => {
    const form = document.getElementById('quizForm');
    form.addEventListener('submit', (event) => evaluateQuiz(event, jsonFilePath));
  });
});