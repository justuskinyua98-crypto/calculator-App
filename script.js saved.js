const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");

let currentInput = "";
let history = [];

// Format number with commas
function formatNumber(num) {
  if (num === "" || isNaN(num)) return num;
  return Number(num).toLocaleString();
}

// Update screen function with commas
function updateScreen() {
  let displayValue = currentInput;

  // Format only numbers, leave operators as-is
  displayValue = displayValue.replace(/\d+(\.\d+)?/g, (match) => {
    return formatNumber(match);
  });

  screen.value = displayValue;
}

// Add calculation to history
function addHistory(entry) {
  history.unshift(entry); // newest first
  if (history.length > 5) history.pop(); // keep last 5
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
}

// Evaluate expression safely-ish
function evaluateExpression(expr) {
  const sanitized = expr.replace(/×/g, "*").replace(/÷/g, "/");
  // allow only digits, operators, parentheses, decimal and spaces
  if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
    throw new Error("Invalid characters in expression");
  }
  // prevent trailing operator (e.g. "2+")
  if (/[*+\-\/.]$/.test(sanitized.trim())) {
    throw new Error("Incomplete expression");
  }
  // use Function instead of eval (slightly safer)
  return Function(`"use strict"; return (${sanitized})`)();
}

// Handle button clicks
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (action === "clear") {
      currentInput = "";
      updateScreen();
    } 
    else if (action === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateScreen();
    }
    else if (action === "equals") {
      try {
        const result = evaluateExpression(currentInput);
        addHistory(`${currentInput} = ${result}`);
        currentInput = String(result);
        updateScreen();
      } catch (err) {
        screen.value = "Error";
        currentInput = "";
      }
    } 
    else if (number) {
      currentInput += number;
      updateScreen();
    } 
    else if (operator) {
      currentInput += operator;
      updateScreen();
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") { // numbers
    currentInput += e.key;
    updateScreen();
    return;
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    const symbol = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key;
    currentInput += symbol;
    updateScreen();
    return;
  }

  if (e.key === ".") {
    currentInput += ".";
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
    updateScreen();
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    try {
      const result = evaluateExpression(currentInput);
      addHistory(`${currentInput} = ${result}`);
      currentInput = String(result);
      updateScreen();
    } catch (err) {
      screen.value = "Error";
      currentInput = "";
    }
    return;
  }
});