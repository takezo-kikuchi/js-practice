'use strict';

const myParseFloat = (str) => {
    if (typeof str !== 'string') return NaN;
    let index = 0;
    let sign = 1;
    let num = 0;
    let decimalPlace = 0;
    let hasDecimal = false;

    while (index < str.length && str[index] === " ") index++;

    if (str[index] === "+") index++;
    else if (str[index] === "-") {
        sign = -1;
        index++;
    }

    while (index < str.length) {
        const char = str[index];
        if (char >= '0' && char <= '9') {
            num = num * 10 + (char.charCodeAt(0) - '0'.charCodeAt(0));
        } else if (char === '.' && !hasDecimal) {
            hasDecimal = true;
            decimalPlace = 1 / 10;
        } else {
            break; // Stop if an invalid character is found
        }
        if (hasDecimal) decimalPlace *= 10;
        index++;
    }
    if (decimalPlace > 0) num = num / decimalPlace;
    return sign * num;
}

const myEval = (a, b, operator) => {
    let result;
    a = myParseFloat(a);
    b = myParseFloat(b);
    if (operator == "+") {
        result = a + b;
    } else if (operator == "-") {
        result = a - b;
    } else if (operator == "*") {
        result = a * b;
    } else if (operator == "/") {
        if (b === 0) throw new Error("Division by zero!");
        result = a / b;
    }
    return result;
}

const decideOperationOrder = (formula) => {
    const tokens = formula.match(/(\d+\.?\d*|\+|\-|\*|\/|\(|\))/g);
    const numbers = [];
    const operators = [];

    for (let i = 0; i < tokens.length; i++) {
        if (/\d+/.test(tokens[i])) {
            numbers.push(tokens[i]);
        } else {
            operators.push(tokens[i]);
        }
    }

    if (numbers.length < 2 || operators.length === 0) {
        throw new Error("Invalid formula or insufficient operators!");
    }

    const operationOrder = ["*", "/", "+", "-"];
    let firstOperator = operators[0];
    let secondOperator = operators[1] || ""; // Handle case with only one operator

    let intermediate_result;

    if (operationOrder.indexOf(firstOperator) < operationOrder.indexOf(secondOperator)) {
        intermediate_result = myEval(numbers[0], numbers[1], firstOperator);
        numbers.splice(0, 2, intermediate_result);
        operators.splice(0, 1);
    } else {
        intermediate_result = myEval(numbers[1], numbers[2], secondOperator);
        numbers.splice(1, 2, intermediate_result);
        operators.splice(1, 1);
    }

    return {
        intermediate_result,
        numbers,
        operators
    };
}

const iterateOperation = (input) => {
    let step = decideOperationOrder(input);
    let safetyCounter = 0; // Safety counter to prevent infinite loops
    while (step.numbers.length > 1) {
        safetyCounter++;
        if (safetyCounter > 100) { // Limit iterations to prevent infinite loops
            throw new Error("Infinite loop detected! Please check the formula.");
        }

        // Reconstruct the formula from numbers and operators
        let formula = step.numbers[0];
        for (let i = 0; i < step.operators.length; i++) {
            formula += step.operators[i] + step.numbers[i + 1];
        }

        console.log("Current formula:", formula);
        step = decideOperationOrder(formula);
    }

    console.log("Final Step:", JSON.parse(JSON.stringify(step)));
    return step.numbers[0]; // Return the final result as a string
}

// Ensure the script runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("button2").addEventListener("click", function (event) {
        event.preventDefault();  // Prevents form submission
        let input = document.getElementById("formula-input").value;

        try {
            let result = iterateOperation(input);  // Use iterateOperation to get the result
            document.getElementById("result").textContent = result;
        } catch (e) {
            console.log(e);
            document.getElementById("result").textContent = "Error in formula!";
        }
    });
});
