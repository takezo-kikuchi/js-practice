'use strict';

document.getElementById("button2").addEventListener("click", function (event) {
    event.preventDefault();  // Prevents form submission
    let input = document.getElementById("formula-input").value;

    try {
        let result = evaluateExpression(input);  // Use evaluateExpression to get the result
        document.getElementById("result").textContent = result;
    } catch (e) {
        console.log(e);
        document.getElementById("result").textContent = "Error in formula!";
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
            return evaluateSimpleExpression(subExpression);
        });
    }
    return formula;
};

// Function to evaluate simple expressions without parentheses (order of operations)
const evaluateSimpleExpression = (expression) => {
    const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
    const numbers = [];
    const operators = [];

    // Parse numbers and operators
    for (let token of tokens) {
        if (/[\+\-\*\/]/.test(token)) operators.push(token);
        else numbers.push(parseFloat(token));
    }

    // Apply multiplication and division first
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '*' || operators[i] === '/') {
            const result = simpleOperation(numbers[i], numbers[i + 1], operators[i]);
            numbers.splice(i, 2, result); // Replace the two numbers with the result
            operators.splice(i, 1);       // Remove the operator
            i--; // Adjust index due to array modification
        }
    }

    // Apply addition and subtraction next
    while (operators.length > 0) {
        const result = simpleOperation(numbers[0], numbers[1], operators[0]);
        numbers.splice(0, 2, result); // Replace the two numbers with the result
        operators.shift();            // Remove the operator
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
};
