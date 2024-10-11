const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerInput = [];
let level = 0;
let score = 0;
let speedMultiplier = 1000;
let currentUser = null;
let userScores = JSON.parse(localStorage.getItem("userScores")) || [];

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const messageDisplay = document.getElementById("message");
const scoreDisplay = document.getElementById("scoreValue");
const userNameDisplay = document.getElementById("userNameDisplay");
const rankingBtn = document.getElementById("rankingBtn");
const rankingTable = document.getElementById("rankingTable");
const rankingBody = document.getElementById("rankingBody");

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
rankingBtn.addEventListener("click", showRanking);

function startGame() {
    resetGame();
    messageDisplay.textContent = "Prepare-se...";
    setTimeout(nextSequence, 1000);
}

function resetGame() {
    sequence = [];
    playerInput = [];
    level = 0;
    score = 0;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = "";
    userNameDisplay.textContent = currentUser ? `Usuário: ${currentUser}` : "";
    document.querySelectorAll('.button').forEach(button => {
        button.style.pointerEvents = "auto";
    });
}

function nextSequence() {
    playerInput = [];
    level++;
    score++;
    scoreDisplay.textContent = score;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            enableUserInput();
            return;
        }
        const color = sequence[i];
        flashButton(color);
        i++;
    }, speedMultiplier);
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.style.transition = "all 0.2s ease";
    button.style.opacity = "1";
    button.style.boxShadow = `0 0 20px ${color}`;
    setTimeout(() => {
        button.style.opacity = "0.8";
        button.style.boxShadow = "none";
    }, 500);
}

function enableUserInput() {
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener("click", handleUserInput);
        button.style.pointerEvents = "auto";
    });
}

function handleUserInput(e) {
    const clickedColor = e.target.id;
    playerInput.push(clickedColor);
    flashButton(clickedColor);
    checkInput(playerInput.length - 1);
}

function checkInput(index) {
    if (playerInput[index] === sequence[index]) {
        if (playerInput.length === sequence.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    messageDisplay.textContent = "Fim de Jogo! Clique em 'RESET' para tentar novamente.";
    document.querySelectorAll('.button').forEach(button => {
        button.style.pointerEvents = "none";
    });
    updateRanking();
}

function updateRanking() {
    if (currentUser) {
        const existingUser = userScores.find(user => user.username === currentUser);

        if (existingUser) {
            if (score > existingUser.score) {
                existingUser.score = score;
            }
        } else {
            const newUserScore = { username: currentUser, score: score };
            userScores.push(newUserScore);
        }

        localStorage.setItem("userScores", JSON.stringify(userScores));
    }
}

function displayRanking() {
    rankingBody.innerHTML = "";

    userScores.sort((a, b) => b.score - a.score);

    userScores.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.score}</td>`;
        rankingBody.appendChild(row);
    });

    rankingTable.style.width = "80%";
    rankingTable.style.display = "block";
}

function deleteUser(e) {
    const index = e.target.getAttribute("data-index");
    userScores.splice(index, 1);
    localStorage.setItem("userScores", JSON.stringify(userScores));
    displayRanking();
}

function initializeRanking() {
    userScores.forEach(user => {
        user.score = 0;
    });
    localStorage.setItem("userScores", JSON.stringify(userScores));
}

function showRanking() {
    displayRanking();
}

window.onload = initializeRanking;

rankingBtn.addEventListener("click", showRanking);

function closeRanking() {
    rankingTable.style.display = "none";
}

// Sistema de login e cadastro
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");
const submitLogin = document.getElementById("submitLogin");
const submitSignup = document.getElementById("submitSignup");

loginBtn.addEventListener("click", () => {
    loginForm.style.display = "block";
});

closeLogin.addEventListener("click", () => {
    loginForm.style.display = "none";
});

closeSignup.addEventListener("click", () => {
    signupForm.style.display = "none";
});

submitLogin.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    currentUser = username;
    userNameDisplay.textContent = `Usuário: ${currentUser}`;
    loginForm.style.display = "none";
});

document.getElementById("signupLink").addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});

submitSignup.addEventListener("click", () => {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    currentUser = username;
    userNameDisplay.textContent = `Usuário: ${currentUser}`;
    signupForm.style.display = "none";
});

function closeRanking() {
    rankingTable.style.display = "none";
}
