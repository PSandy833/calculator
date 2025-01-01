let currentInput = '';
let previousInput = '';
let operator = '';
let isResultDisplayed = false; // Tracks if the result is displayed

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// Map keys to button values
const keyMap = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '+': '+', '-': '-', '*': '*', '/': '/', '.': '.',
  'Enter': '=', 'c': 'C'
};

// Button click logic
buttons.forEach(button => {
  button.addEventListener('click', () => handleButtonClick(button.getAttribute('data-value')));
});

// Keyboard input logic
document.addEventListener('keydown', event => {
  const value = keyMap[event.key];
  if (value) {
    handleButtonClick(value);
    event.preventDefault(); //prevent
  }
});

// Handle button logic
function handleButtonClick(value) {
  if (!value) return;

  // Handle clear (C) button
  if (value === 'C') {
    currentInput = '';
    previousInput = '';
    operator = '';
    isResultDisplayed = false;
    updateDisplay('0'); // Reset display
    return;
  }

  // Handle equals (=) button
  if (value === '=') {
    if (!currentInput || !previousInput || !operator) return;
    currentInput = calculate(previousInput, currentInput, operator);
    previousInput = '';
    operator = '';
    isResultDisplayed = true; // Result is now displayed
    updateDisplay(currentInput); // Show the result
    return;
  }

  // Handle operators (+, -, *, /)
  if (['+', '-', '*', '/'].includes(value)) {
    if (isResultDisplayed) {
      previousInput = currentInput;
      currentInput = '';
      isResultDisplayed = false;
    } else if (currentInput && previousInput && operator) {
      previousInput = calculate(previousInput, currentInput, operator);
      currentInput = '';
    } else if (currentInput) {
      previousInput = currentInput;
      currentInput = '';
    }
    operator = value;
    updateDisplay(); // Show the operator
    return;
  }

  // Handle decimal input
  if (value === '.' && currentInput.includes('.')) return;

  // Handle numeric input
  if (isResultDisplayed) {
    currentInput = ''; // Clear current input
    isResultDisplayed = false; // Reset result state
  }
  currentInput += value;
  updateDisplay();
}

function updateDisplay(value) {
  if (value !== undefined) {
    display.textContent = value; // Show explicit value
  } else if (operator && previousInput) {
    display.textContent = `${previousInput} ${operator} ${currentInput || ''}`;
  } else {
    display.textContent = currentInput || '0';
  }
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+': return (a + b).toString();
    case '-': return (a - b).toString();
    case '*': return (a * b).toString();
    case '/': return b !== 0 ? (a / b).toString() : 'Error';
    default: return '';
  }
}
