// ===============================
// Elements
// ===============================

const question = document.getElementById("question");
const generateBtn = document.getElementById("generateBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const sql = document.getElementById("sql");
const type = document.getElementById("type");
const explanation = document.getElementById("explanation");
const warning = document.getElementById("warning");

const copyBtn = document.getElementById("copyBtn");

const charCount = document.getElementById("charCount");

const toast = document.getElementById("toast");

const historyList = document.getElementById("historyList");

const clearHistory = document.getElementById("clearHistory");

const chips = document.querySelectorAll(".chip");

// ===============================
// Character Counter
// ===============================

question.addEventListener("input", () => {

    charCount.textContent = question.value.length;

});

// ===============================
// Example Chips
// ===============================

chips.forEach(chip => {

    chip.addEventListener("click", () => {

        question.value = chip.innerText;

        charCount.textContent = question.value.length;

        question.focus();

    });

});

// ===============================
// Loading Messages
// ===============================

const loadingMessages = [

    "🧠 Understanding your request...",

    "⚡ Building SQL Query...",

    "🤖 Asking Gemini...",

    "✨ Optimizing SQL..."

];

let loadingInterval;

// ===============================
// Typing Effect
// ===============================

async function typeSQL(text){

    sql.textContent="";

    for(let i=0;i<text.length;i++){

        sql.textContent += text[i];

        await new Promise(resolve=>setTimeout(resolve,8));

    }

}

// ===============================
// History
// ===============================

function getHistory(){

    return JSON.parse(localStorage.getItem("sql_history")) || [];

}

function saveHistory(prompt){

    let history = getHistory();

    history.unshift(prompt);

    history = history.slice(0,8);

    localStorage.setItem(

        "sql_history",

        JSON.stringify(history)

    );

    renderHistory();

}

function renderHistory(){

    const history = getHistory();

    historyList.innerHTML="";

    if(history.length===0){

        historyList.innerHTML=

        `<p class="empty">No history yet.</p>`;

        return;

    }

    history.forEach(item=>{

        const div=document.createElement("div");

        div.className="history-item";

        div.innerText=item;

        div.onclick=()=>{

            question.value=item;

            charCount.textContent=item.length;

        };

        historyList.appendChild(div);

    });

}

renderHistory();

// ===============================
// Copy Toast
// ===============================

function showToast(message = "✅ SQL Copied!") {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}

// ===============================
// Copy SQL
// ===============================

copyBtn.addEventListener("click", async () => {

    if (!sql.textContent.trim()) return;

    try {

        await navigator.clipboard.writeText(sql.textContent);

        showToast("✅ SQL copied successfully!");

    } catch {

        alert("Copy failed.");

    }

});

// ===============================
// Generate SQL
// ===============================

generateBtn.addEventListener("click", generateSQL);

question.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "Enter") {

        generateSQL();

    }

});

async function generateSQL() {

    const userQuestion = question.value.trim();

    if (!userQuestion) {

        alert("Please enter your request.");

        return;

    }

    saveHistory(userQuestion);

    result.classList.add("hidden");

    loading.classList.remove("hidden");

    let index = 0;

    loading.querySelector("p").textContent = loadingMessages[index];

    loadingInterval = setInterval(() => {

        index = (index + 1) % loadingMessages.length;

        loading.querySelector("p").textContent = loadingMessages[index];

    }, 1200);

    try {

        const response = await fetch("/generate", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                question: userQuestion

            })

        });

        const data = await response.json();

        clearInterval(loadingInterval);

        loading.classList.add("hidden");

        await typeSQL(data.query || "");

        type.textContent = data.type || "Unknown";

        explanation.textContent = data.explanation || "-";

        warning.textContent = data.warning || "None";

        result.classList.remove("hidden");

        result.scrollIntoView({

            behavior: "smooth"

        });

    }

    catch (err) {

        clearInterval(loadingInterval);

        loading.classList.add("hidden");

        alert("Something went wrong.");

        console.error(err);

    }

}

// ===============================
// Clear History
// ===============================

clearHistory.addEventListener("click", () => {

    localStorage.removeItem("sql_history");

    renderHistory();

    showToast("🗑️ History cleared");

});

// ===============================
// Welcome Prompt
// ===============================

window.addEventListener("load", () => {

    question.focus();

});

// ===============================
// Auto Resize Textarea
// ===============================

question.addEventListener("input", () => {

    question.style.height = "auto";

    question.style.height = question.scrollHeight + "px";

});

// ===============================
// Enter Animation
// ===============================

document.querySelectorAll(".card").forEach((card, i) => {

    card.style.animationDelay = `${i * 0.1}s`;

});
