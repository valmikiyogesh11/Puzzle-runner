let level = 1;
let streak = 0;
let highScore = localStorage.getItem("highScore") || 0;

let timeLeft = 5;
let timerInterval;

/* START */
function startGame() {
  loadLevel();
}

/* TIMER */
function startTimer() {
  clearInterval(timerInterval);

  timeLeft = Math.max(2, 6 - Math.floor(level / 3));
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

function updateTimer() {
  document.getElementById("timer").innerText = "Time: " + timeLeft;
}

/* DASHBOARD */
function updateDashboard() {
  document.getElementById("status").innerText = "Level: " + level;
  document.getElementById("streak").innerText = "🔥 Streak: " + streak;
  document.getElementById("highscore").innerText = "🏆 Best: " + highScore;
}

/* RANDOM QUESTION */
function generateQuestion() {
  let type = Math.floor(Math.random() * 5);

  let question = "";
  let correct;
  let options = [];

  switch (type) {

    // 🧮 Math
    case 0:
      let a = rand(1, level + 5);
      let b = rand(1, level + 5);
      correct = a + b;
      question = a + " + " + b + " = ?";
      options = [correct, correct + 1, correct - 1];
      break;

    // 🔢 Sequence
    case 1:
      let start = rand(1, 5);
      let diff = rand(1, 5);
      let n1 = start;
      let n2 = n1 + diff;
      let n3 = n2 + diff;
      correct = n3 + diff;
      question = n1 + ", " + n2 + ", " + n3 + ", ?";
      options = [correct, correct + diff, correct - diff];
      break;

    // 🔠 Alphabet
    case 2:
      let c = rand(65, 85);
      let char = String.fromCharCode(c);
      correct = String.fromCharCode(c + 1);
      question = char + ", ?";
      options = [correct, String.fromCharCode(c + 2), String.fromCharCode(c - 1)];
      break;

    // 🧠 Logic
    case 3:
      const logic = [
        { q: "Which is a fruit?", a: "Apple", o: ["Apple","Car","Stone"] },
        { q: "Which is an animal?", a: "Dog", o: ["Dog","Table","Pen"] },
        { q: "Which flies?", a: "Bird", o: ["Bird","Rock","Chair"] }
      ];
      let l = logic[rand(0, logic.length - 1)];
      return { question: l.q, correct: l.a, options: shuffle(l.o) };

    // 🧩 Pattern
    case 4:
      let x = rand(1, 5);
      correct = x * x;
      question = x + " × " + x + " = ?";
      options = [correct, correct + x, correct - x];
      break;
  }

  return { question, correct, options: shuffle(options) };
}

/* RANDOM */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* SHUFFLE */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* LOAD LEVEL */
function loadLevel() {
  startTimer();
  updateDashboard();

  const game = document.getElementById("game");
  const q = generateQuestion();

  game.innerHTML = "<p>" + q.question + "</p>";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = function () {
      checkAnswer(opt, q.correct);
    };

    game.appendChild(btn);
  });
}

/* CHECK ANSWER (FIXED) */
function checkAnswer(selected, correct) {
  clearInterval(timerInterval);

  if (selected === correct) {
    streak++;
    level++;

    if (streak > highScore) {
      highScore = streak;
      localStorage.setItem("highScore", highScore);
    }

    loadLevel();
  } else {
    resetGame();
  }
}

/* GAME OVER */
function gameOver() {
  clearInterval(timerInterval);
  resetGame();
}

/* RESET */
function resetGame() {
  const game = document.getElementById("game");

  game.innerHTML = `
    <h2>❌ Wrong / Time Up!</h2>
    <p>Your Streak: ${streak}</p>
    <button onclick="restartGame()">Restart</button>
  `;

  streak = 0;
  level = 1;
  updateDashboard();
}

/* RESTART */
function restartGame() {
  loadLevel();
}

/* SERVICE WORKER */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}