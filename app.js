(() => {
  "use strict";

  const questions = [
    { category: "THE LITTLE THINGS", mood: "sweet", question: "What's a tiny thing I do that makes your day better?", hint: "The little things are usually the big things.", reveal: "The best kind of love lives in the details. Tell each other why that little thing matters." },
    { category: "A LITTLE PLAYFUL", mood: "playful", question: "If we had a completely free day together, what would we do first?", hint: "No budget, no plans, no alarm clock.", reveal: "Build your dream day one detail at a time. You might discover a new plan to make real." },
    { category: "GETTING CLOSER", mood: "deep", question: "What's something you wish people understood about you?", hint: "Listen to understand, not to fix.", reveal: "Thank you for letting each other in. You don't need to solve anything—being heard is a gift." },
    { category: "OUR STORY", mood: "sweet", question: "What's a memory of us that you replay in your head?", hint: "Take a little trip back in time.", reveal: "Try remembering one detail the other person might have forgotten. Make the story yours again." },
    { category: "JUST FOR FUN", mood: "playful", question: "Which fictional world would be the most fun for us to live in?", hint: "Fantasy, sitcom, space station—anything goes.", reveal: "Make your case for the world, then decide what your first adventure would be." },
    { category: "A LITTLE BRAVER", mood: "deep", question: "What's one thing you'd love for us to try together someday?", hint: "Big adventure or tiny first step.", reveal: "Dreaming together is a start. If it feels right, pick one small step you could take this month." },
    { category: "THE LITTLE THINGS", mood: "sweet", question: "What song feels a little bit like us?", hint: "There can be more than one answer.", reveal: "Share the song and the moment it reminds you of. Bonus points for listening together." },
    { category: "A LITTLE PLAYFUL", mood: "playful", question: "If our relationship had a mascot, what would it be?", hint: "The weirder the answer, the better.", reveal: "Give your mascot a name, a personality, and one very important job." },
    { category: "GETTING CLOSER", mood: "deep", question: "When do you feel most understood by me?", hint: "Specific moments can mean a lot.", reveal: "Ask one gentle follow-up: “What can I do more often to help you feel that way?”" },
    { category: "OUR STORY", mood: "sweet", question: "What's something new you've learned about me recently?", hint: "We keep discovering each other.", reveal: "People change in lovely ways. Share what surprised you and what you'd like to learn next." }
  ];

  const encouragements = {
    sweet: ["That’s the lovely little stuff.", "A small detail, a big feeling.", "There’s your little love note."],
    playful: ["Excellent. The fun version of you is invited.", "A little silly is a love language too.", "This could become an inside joke."],
    deep: ["A little honesty can bring you closer.", "Make room for the answer, whatever it is.", "Curiosity is a kind way to care."]
  };

  const $ = (selector) => document.querySelector(selector);
  const storage = {
    get(key, fallback) {
      try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { showToast("Your browser couldn't save this. Check your storage settings."); return false; }
    }
  };

  let round = 0;
  let selectedMood = "sweet";
  let currentQuestion = null;
  let saved = storage.get("twofold-saved", []);
  let completedDays = storage.get("twofold-days", []);
  let soundOn = false;

  const localDateKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const dayNumber = () => Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 86400000);
  const dailyOffset = ((dayNumber() % questions.length) + questions.length) % questions.length;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function renderQuestion() {
    currentQuestion = questions[(dailyOffset + round) % questions.length];
    $("#category-label").textContent = round === 0 ? "TODAY'S QUESTION" : currentQuestion.category;
    $("#round-count").textContent = `${String(round + 1).padStart(2, "0")} / 05`;
    $("#progress-fill").style.width = `${((round % 5) + 1) * 20}%`;
    $("#game-title").textContent = currentQuestion.question;
    $("#question-hint").textContent = currentQuestion.hint;
    $("#answer-input").value = "";
    $("#char-count").textContent = "0 / 240";
    selectedMood = currentQuestion.mood;
    document.querySelectorAll(".mood-option").forEach(button => {
      button.classList.toggle("selected", button.dataset.mood === selectedMood);
    });
    $("#question-view").classList.remove("hidden");
    $("#result-view").classList.add("hidden");
    $("#answer-input").focus({ preventScroll: true });
  }

  function markCompletedToday() {
    const today = localDateKey();
    if (!completedDays.includes(today)) {
      completedDays.push(today);
      completedDays = completedDays.slice(-60);
      storage.set("twofold-days", completedDays);
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const hadYesterday = completedDays.includes(`${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`);
    $("#streak-count").textContent = hadYesterday ? "Your ritual is growing" : (completedDays.length > 1 ? `${completedDays.length} moments made` : "Your first day");
    $("#streak-caption").textContent = "A little time, just for each other";
  }

  function reveal() {
    const answer = $("#answer-input").value.trim();
    const mood = selectedMood;
    const options = encouragements[mood];
    const phrase = options[(dailyOffset + round) % options.length];
    $("#result-title").textContent = phrase;
    $("#result-copy").textContent = currentQuestion.reveal;
    if (answer) {
      $("#your-answer").textContent = answer;
      $("#your-answer-wrap").classList.remove("hidden");
    } else {
      $("#your-answer-wrap").classList.add("hidden");
    }
    $("#save-button").textContent = saved.some(item => item.question === currentQuestion.question) ? "♥ Saved to your collection" : "♡ Save this question";
    $("#save-button").disabled = saved.some(item => item.question === currentQuestion.question);
    $("#question-view").classList.add("hidden");
    $("#result-view").classList.remove("hidden");
    markCompletedToday();
    if (soundOn) { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 660; gain.gain.value = 0.025; osc.start(); osc.stop(ctx.currentTime + 0.09); } catch { /* sound is optional */ } }
  }

  function renderSaved() {
    $("#saved-count").textContent = String(saved.length);
    $("#clear-saved").disabled = saved.length === 0;
    const list = $("#saved-list");
    list.replaceChildren();
    if (!saved.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const heart = document.createElement("div"); heart.className = "empty-heart"; heart.textContent = "♡";
      const strong = document.createElement("strong"); strong.textContent = "Your collection starts here";
      const span = document.createElement("span"); span.textContent = "Tap “Save this question” after a round you love.";
      empty.append(heart, strong, span); list.append(empty); return;
    }
    saved.forEach((item, index) => {
      const card = document.createElement("article"); card.className = "saved-item";
      const question = document.createElement("p"); question.textContent = item.question;
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove saved question: ${item.question}`);
      remove.addEventListener("click", () => { saved.splice(index, 1); storage.set("twofold-saved", saved); renderSaved(); showToast("Removed from your collection."); });
      card.append(question, remove); list.append(card);
    });
  }

  document.querySelectorAll(".mood-option").forEach(button => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      document.querySelectorAll(".mood-option").forEach(option => option.classList.toggle("selected", option === button));
    });
  });
  $("#answer-input").addEventListener("input", event => { $("#char-count").textContent = `${event.target.value.length} / 240`; });
  $("#reveal-button").addEventListener("click", reveal);
  $("#next-button").addEventListener("click", () => { round = (round + 1) % 5; renderQuestion(); });
  $("#save-button").addEventListener("click", () => {
    if (saved.some(item => item.question === currentQuestion.question)) return;
    saved.unshift({ question: currentQuestion.question, category: currentQuestion.category });
    storage.set("twofold-saved", saved); renderSaved();
    $("#save-button").textContent = "♥ Saved to your collection"; $("#save-button").disabled = true;
    showToast("Saved for another moment ♡");
  });
  $("#clear-saved").addEventListener("click", () => {
    if (!saved.length) return;
    if (window.confirm("Clear all saved questions from this browser?")) {
      saved = []; storage.set("twofold-saved", saved); renderSaved(); showToast("Your collection has been cleared.");
    }
  });
  $("#sound-toggle").addEventListener("click", () => {
    soundOn = !soundOn;
    $("#sound-toggle").textContent = soundOn ? "♫" : "♪";
    $("#sound-toggle").title = soundOn ? "Sound effects are on" : "Sound effects are off";
    $("#sound-toggle").setAttribute("aria-label", soundOn ? "Turn sound effects off" : "Turn sound effects on");
    showToast(soundOn ? "Tiny sound effects are on." : "Sound effects are off.");
  });

  $("#today-label").textContent = new Intl.DateTimeFormat("en-IN", { weekday: "short", month: "short", day: "numeric" }).format(new Date()).toUpperCase();
  renderQuestion();
  renderSaved();
  if (completedDays.includes(localDateKey())) {
    $("#streak-count").textContent = "You made time today";
    $("#streak-caption").textContent = "Come back for another little moment";
  }
})();