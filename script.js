document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    const inputElement = document.getElementById('input');
    const startButton = document.getElementById('start');
    const retryButton = document.getElementById('retry');
    const timeElement = document.getElementById('time');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');

    let timer;
    let timeLeft = 60;
    let isTestRunning = false;
    let correctCharacters = 0;
    let totalCharacters = 0;
    let startTime;
    let currentQuote = "";
    let currentCorrect = 0;
    let currentTotal = 0;

    const quotes = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is the art of telling another human what one wants the computer to do.",
        "The only way to learn a new programming language is by writing programs in it.",
        "The best error message is the one that never shows up.",
        "First, solve the problem. Then, write the code.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "The most disastrous thing that you can ever learn is your first programming language.",
        "The most important property of a program is whether it accomplishes the intention of its user."
    ];

    startButton.addEventListener('click', startTest);
    retryButton.addEventListener('click', startTest);

    inputElement.addEventListener('input', checkInput);

    inputElement.addEventListener('keydown', (e) => {
        const forbiddenKeys = ['Backspace', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Delete', 'End'];
        if(forbiddenKeys.includes(e.key)) {
            e.preventDefault();
        }
    
    });

    function startTest() {
        clearInterval(timer);
        startTime = new Date();
        timeLeft = 60;
        isTestRunning = true;
        correctCharacters = 0;
        totalCharacters = 0;

        timeElement.textContent = timeLeft;
        inputElement.value = '';
        inputElement.disabled = false;
        inputElement.focus();

        loadNewQuote();
        timer = setInterval(updateTimer, 1000);
    }

    function loadNewQuote() {
        inputElement.value = '';
        const randomIndex = Math.floor(Math.random() * quotes.length);
        currentQuote = quotes[randomIndex];
        displayQuote(currentQuote);
    }

    function displayQuote(quote) {
        quoteElement.innerHTML = '';

        quote.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            quoteElement.appendChild(charSpan);
        });
    }

    function updateTimer() {
        timeLeft--;
        timeElement.textContent = timeLeft;

        if(timeLeft <= 0) {
            endTest();
        }
    }

    function checkInput() {
        if(!isTestRunning) return;

        const inputText = inputElement.value;
        const quoteSpans = quoteElement.querySelectorAll('span');

        quoteSpans.forEach(span => {
            span.className = '';
        });

        let correctCount = 0;

        inputText.split('').forEach((char, index) => {
            if(index >= quoteSpans.length) return;

            if(char === quoteSpans[index].textContent) {
                quoteSpans[index].classList.add('correct');
                correctCount++;
            } else {
                quoteSpans[index].classList.add('incorrect');
            }
        });

        if(inputText.length < quoteSpans.length) {
            quoteSpans[inputText.length].classList.add('current');
        }

        updateStats(correctCount, inputText.length);

        if(inputText.length === currentQuote.length) {
            correctCharacters += correctCount;
            totalCharacters += currentQuote.length;
            inputElement.value = '';
            loadNewQuote();
        }
    }

    function updateStats(correctCount, totalCount) {
        const accuracy = (totalCharacters + totalCount) > 0 ? Math.round((correctCharacters + correctCount) / (totalCharacters + totalCount) * 100) : 0;
        accuracyElement.textContent = `${accuracy}%`;

        const words = (correctCharacters + correctCount) / 5;
        const minutes = (60 - timeLeft) / 60;
        const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
        wpmElement.textContent = wpm;
    }

    function endTest() {
        clearInterval(timer);
        isTestRunning = false;
        inputElement.disabled = true;

        const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 0;
        const words = correctCharacters / 5;
        const timeTakenInMinutes = (new Date() - startTime) / 1000 / 60;
        const wpm = timeTakenInMinutes > 0 ? Math.round(words / timeTakenInMinutes) : 0;

        wpmElement.textContent = wpm;
        accuracyElement.textContent = `${accuracy}`;
    }
});