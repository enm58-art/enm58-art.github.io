// Variable initialization
let questions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let canAnswer = true;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('current-score');
const streakDisplay = document.getElementById('current-streak');
const progressBar = document.getElementById('progress-bar');
const feedbackArea = document.getElementById('feedback-area');
const resultScreen = document.getElementById('result-screen');

// Load questions from your JSON file
fetch('questions.json')
    .then(response => {
        if (!response.ok) throw new Error("Could not load questions.json");
        return response.json();
    })
    .then(data => {
        questions = data;
        renderQuestion();
    })
    .catch(err => {
        questionText.innerText = "Error: Ensure questions.json is in the same folder.";
        console.error(err);
    });

function renderQuestion() {
    canAnswer = true;
    feedbackArea.innerText = "";
    const q = questions[currentIndex];
    
    // Update Question and Progress
    questionText.innerText = q.question;
    progressBar.style.width = `${((currentIndex) / questions.length) * 100}%`;

    // Clear and create option buttons
    optionsContainer.innerHTML = "";
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, btn) {
    if (!canAnswer) return;
    canAnswer = false;

    const correctAnswer = questions[currentIndex].answer;
    const allButtons = document.querySelectorAll('.option-btn');

    if (selected === correctAnswer) {
        // Scoring logic: Base 100 points + streak bonus
        score += 100 + (streak * 20);
        streak++;
        btn.classList.add('correct');
        feedbackArea.innerText = "Correct! 🔥";
        feedbackArea.style.color = "var(--success-green)";
    } else {
        streak = 0;
        btn.classList.add('wrong');
        feedbackArea.innerText = `Incorrect. The answer was: ${correctAnswer}`;
        feedbackArea.style.color = "var(--error-red)";
        
        // Show the correct answer to the user
        allButtons.forEach(