const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");

let currentInput = "";
let firstValue = "";
let operator = "";
let history = [];

// Update screen
function updateScreen() {
  screen.value = currentInput || "0";
}

// Add history (bonus)
function addHistory(entry) {
  history.unshift(entry);
  if (history.length > 5) history.pop();
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join("");
}

// Handle basic arithmetic without eval
function compute(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch(op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : "Error";
    default: return b;
  }
}

// Button clicks
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const number = btn.dataset.number;
    const op = btn.dataset.operator;
    const action = btn.dataset.action;

    if(action === "clear") {
      currentInput = "";
      firstValue = "";
      operator = "";
      updateScreen();
    }
    else if(action === "backspace") {
      currentInput = currentInput.slice(0,-1);
      updateScreen();
    }
    else if(action === "equals") {
      if(firstValue && operator) {
        currentInput = compute(firstValue, currentInput, operator);
        addHistory(`${firstValue} ${operator} ${currentInput} = ${currentInput}`);
        firstValue = "";
        operator = "";
        updateScreen();
      }
    }
    else if(number) {
      currentInput += number;
      updateScreen();
    }
    else if(op) {
      if(firstValue && operator) {
        currentInput = compute(firstValue, currentInput, operator);
        firstValue = currentInput;
      } else {
        firstValue = currentInput;
      }
      operator = op;
      currentInput = "";
      updateScreen();
    }
  });
});

// Keyboard support (bonus)
document.addEventListener("keydown", e => {
  if(e.key >= "0" && e.key <= "9") {
    currentInput += e.key;
    updateScreen();
  }
  if(["+", "-", "*", "/"].includes(e.key)) {
    const sym = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key === "-" ? "−" : "+";
    if(firstValue && operator) {
      currentInput = compute(firstValue, currentInput, operator);
      firstValue = currentInput;
    } else {
      firstValue = currentInput;
    }
    operator = sym;
    currentInput = "";
    updateScreen();
  }
  if(e.key === ".") {
    currentInput += ".";
    updateScreen();
  }
  if(e.key === "Backspace") {
    currentInput = currentInput.slice(0,-1);
    updateScreen();
  }
  if(e.key === "Escape") {
    currentInput = "";
    firstValue = "";
    operator = "";
    updateScreen();
  }
  if(e.key === "Enter") {
    e.preventDefault();
    if(firstValue && operator) {
      currentInput = compute(firstValue, currentInput, operator);
      addHistory(`${firstValue} ${operator} ${currentInput} = ${currentInput}`);
      firstValue = "";
      operator = "";
      updateScreen();
    }
  }
});
