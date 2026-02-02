const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");

let currentInput = "";
let firstValue = "";
let operator = "";
let history = [];

// Update display
function updateScreen() {
  screen.value = currentInput || "0";
}

// Add to history (max 5)
function addHistory(entry) {
  history.unshift(entry);
  if (history.length > 5) history.pop();
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
}

// Perform calculation
function compute(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);

  if (isNaN(x) || isNaN(y)) return "Error";

  switch (op) {
    case "+": return x + y;
    case "−": return x - y;
    case "×": return x * y;
    case "÷": return y !== 0 ? x / y : "Error";
    default: return y;
  }
}

// Button click handling
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const number = btn.dataset.number;
    const op = btn.dataset.operator;
    const action = btn.dataset.action;

    // Clear
    if (action === "clear") {
      currentInput = "";
      firstValue = "";
      operator = "";
      updateScreen();
      return;
    }

    // Backspace
    if (action === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateScreen();
      return;
    }

    // Equals
    if (action === "equals") {
      if (firstValue && operator && currentInput !== "") {
        const result = compute(firstValue, currentInput, operator);
        addHistory(`${firstValue} ${operator} ${currentInput} = ${result}`);

        currentInput = result.toString();
        firstValue = "";
        operator = "";
        updateScreen();
      }
      return;
    }

    // Numbers and decimal
    if (number) {
      if (number === "." && currentInput.includes(".")) return;
      currentInput += number;
      updateScreen();
      return;
    }

    // Operators (FIXED LOGIC ✅)
    if (op) {
      if (currentInput === "") return;

      firstValue = currentInput;
      operator = op;
      currentInput = "";
      updateScreen();
    }
  });
});

// Keyboard support (bonus)
document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9") {
    currentInput += e.key;
    updateScreen();
  }

  if (e.key === "." && !currentInput.includes(".")) {
    currentInput += ".";
    updateScreen();
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    if (currentInput === "") return;

    const sym =
      e.key === "*" ? "×" :
      e.key === "/" ? "÷" :
      e.key === "-" ? "−" : "+";

    firstValue = currentInput;
    operator = sym;
    currentInput = "";
    updateScreen();
  }

  if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateScreen();
  }

  if (e.key === "Escape") {
    currentInput = "";
    firstValue = "";
    operator = "";
    updateScreen();
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (firstValue && operator && currentInput !== "") {
      const result = compute(firstValue, currentInput, operator);
      addHistory(`${firstValue} ${operator} ${currentInput} = ${result}`);

      currentInput = result.toString();
      firstValue = "";
      operator = "";
      updateScreen();
    }
  }
});
