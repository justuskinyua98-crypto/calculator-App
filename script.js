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

  switch(op) {
    case "+": return x + y;
    case "−": return x - y; // Unicode minus
    case "×": return x * y;
    case "÷": return y !== 0 ? x / y : "Error";
    default: return y;
  }
}

// Handle number/operator buttons
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const number = btn.dataset.number;
    const op = btn.dataset.operator;
    const action = btn.dataset.action;

    if (action === "clear") {
      currentInput = "";
      firstValue = "";
      operator = "";
      updateScreen();
      return;
    }

    if (action === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateScreen();
      return;
    }

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

    if (number) {
      if (number === "." && currentInput.includes(".")) return;
      currentInput += number;
      updateScreen();
      return;
    }

    if (op) {
      if (currentInput === "") return;

      // If already have firstValue & operator, compute first
      if (firstValue && operator) {
        const result = compute(firstValue, currentInput, operator);
        firstValue = result.toString();
      } else {
        firstValue = currentInput;
      }

      operator = op;
      currentInput = "";
      updateScreen();
    }
  });
});

// Keyboard support
document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9") {
    currentInput += e.key;
    updateScreen();
    return;
  }

  if (e.key === "." && !currentInput.includes(".")) {
    currentInput += ".";
    updateScreen();
    return;
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    if (currentInput === "") return;

    const sym =
      e.key === "*" ? "×" :
      e.key === "/" ? "÷" :
      e.key === "-" ? "−" : "+";

    if (firstValue && operator) {
      const result = compute(firstValue, currentInput, operator);
      firstValue = result.toString();
    } else {
      firstValue = currentInput;
    }

    operator = sym;
    currentInput = "";
    updateScreen();
    return;
  }

  if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateScreen();
    return;
  }

  if (e.key === "Escape") {
    currentInput = "";
    firstValue = "";
    operator = "";
    updateScreen();
    return;
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
    return;
  }
});
