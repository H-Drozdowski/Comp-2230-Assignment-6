/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");
    const usernameInput = document.getElementById("username")

    // Initialize the game
    // checkUsername(); Uncomment once completed
    fetchQuestions();
    displayScores();
    initializeSession();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        //... form submission logic including setting cookies and calculating score
        storeUserDataCookie(usernameInput.value.trim())
        initializeSession()

        saveUserScore(retrieveUserDataCookie())
    }

    function newPlayer(event){
        newPlayerButton.classList.add("hidden")
        usernameInput.classList.remove("hidden")
    }
});

// Stores user data in cookies.
const storeUserDataCookie = (userNameEntered) => {
    document.cookie = `username=${userNameEntered}; max-age=${24 * 60 * 60}; path=/`
}

// Returns the username cookie
const retrieveUserDataCookie = () => {
    return document.cookie.split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];
}

// Returns true or false based on if the username cookie exists.
const checkForUserCookie = () => {
    let userNameCookie = retrieveUserDataCookie()
    if (userNameCookie != undefined){
        return true
    }
    else{
        return false
    }
}

// Initializes the session based on if the username cookie exists or not.
const initializeSession = () => {
    const newPlayerButton = document.getElementById("new-player")
    const usernameInput = document.getElementById("username")

    // if session exists new player button is not hidden, finish game not hidden
    if (checkForUserCookie()){
        newPlayerButton.classList.remove("hidden")
        usernameInput.classList.add("hidden")
    }
    // if session does not exist new player is hidden and finish game and username input is unhidden
    else{
        newPlayerButton.classList.add("hidden")
        usernameInput.classList.remove("hidden")
    }
}

const calculateUserScore = () => {
    let userCurrentScore = 0

    const correctAnswers = document.querySelectorAll('input[data-correct]')

    correctAnswers.forEach((answerRadio) => {
        if (answerRadio.checked){
            userCurrentScore += 1
        }
    })

    return userCurrentScore
}

const saveUserScore = (username) => {
    playerScore = calculateUserScore()
    localStorage.setItem(`GameUser_${username}`, playerScore)
}

const displayScores = () => {
    for (let i = 0; i < localStorage.length; i += 1){
        const key = localStorage.key(i)

        if(key.startsWith("GameUser_")){
            const score = localStorage.getItem(key)
            console.log(`${key} ${score}`)
        }
    }
}