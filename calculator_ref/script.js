'use strict';

// Event listener for button click
document.getElementById("button2")?.addEventListener("click", (event) => {
    event.preventDefault(); // Prevents form submission
    const input = document.getElementById("formula-input")?.value;

    try {
        const result = evaluateExpression(input); // Use evaluateExpression to get the result
        const resultElement = document.getElementById("result");
        if (resultElement) {
            resultElement.textContent = result.toString();
        }
    } catch (e) {
        console.error(e);
        const resultElement = document.getElementById("result");
        if (resultElement) {
            resultElement.textContent = "Error in formula!";
        }
    }
});

// Main function to evaluate expressions with parentheses and operators
const evaluateExpression = (formula) => {
    // Resolve all expressions within parentheses first
    formula = resolveParentheses(formula);

    // Parse the final formula without parentheses and evaluate
    return evaluateSimpleExpression(formula);
};

// Function to resolve parentheses by recursively evaluating inner expressions
const resolveParentheses = (formula) => {
    while (/\(([^()]+)\)/.test(formula)) {
        formula = formula.replace(/\(([^()]+)\)/, (match, subExpression) => {
            return evaluateSimpleExpression(subExpression).toString();
        });
    }
    return formula;
};

// Function to evaluate simple expressions without parentheses (order of operations)
const evaluateSimpleExpression = (expression) => {
    const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
    if (!tokens) {
        throw new Error("Invalid expression");
    }

    const numbers = [];
    const operators = [];

    // Parse numbers and operators
    for (const token of tokens) {
        if (/[\+\-\*\/]/.test(token)) {
            operators.push(token);
        } else {
            numbers.push(parseFloat(token));
        }
    }

    // Apply multiplication and division first
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '*' || operators[i] === '/') {
            const result = simpleOperation(numbers[i], numbers[i + 1], operators[i]);
            numbers.splice(i, 2, result); // Replace the two numbers with the result
            operators.splice(i, 1);      // Remove the operator
            i--; // Adjust index due to array modification
        }
    }

    // Apply addition and subtraction next
    while (operators.length > 0) {
        const result = simpleOperation(numbers[0], numbers[1], operators[0]);
        numbers.splice(0, 2, result); // Replace the two numbers with the result
        operators.shift();           // Remove the operator
    }

    return numbers[0];
};

// Function to handle individual operations
const simpleOperation = (a, b, operator) => {
    if (operator === "+") return a + b;
    if (operator === "-") return a - b;
    if (operator === "*") return a * b;
    if (operator === "/") {
        if (b === 0) throw new Error("Division by zero!");
        return a / b;
    }
    throw new Error(`Invalid operator: ${operator}`);
};

// Test cases to verify the implementation
const snapshots = new Map([
    ["1+2", 3],
    ["2*3", 6],
    ["(1+2)*3", 9],
    ["(1+2)*3+4", 13],
]);

let hasError = false;
for (const [input, expected] of snapshots) {
    const result = evaluateExpression(input);
    if (result !== expected) {
        console.error(`Input: ${input}, Expected: ${expected}, Result: ${result}`);
        hasError = true;
    }
}

if (!hasError) {
    console.log("All test cases passed!");
}
