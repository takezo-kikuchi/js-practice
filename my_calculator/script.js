'use strict';

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

const iterateOperation = (input) => {
    let parsedInput = parseFormula(input);
    console.log("数字と記号に分解する:", JSON.parse(JSON.stringify(parsedInput)));
    if (parsedInput.operators.length > 1){
    let step = decideOperationOrder(input);
    let safetyCounter = 0; // Safety counter to prevent infinite loops
    let answer;
    while (step.numbers.length >= 3) {
        safetyCounter++;
        if (safetyCounter > 100) { // Limit iterations to prevent infinite loops
            throw new Error("Infinite loop detected! Please check the formula.");
        }
        let formula = step.numbers[0];
        for (let i = 0; i < step.operators.length; i++) {
            formula += step.operators[i] + step.numbers[i + 1];
        }
        console.log("今はこんな感じ：", formula);
        step = decideOperationOrder(formula);
    }
    if (step.numbers.length == 2) {
        answer = myEval(step.numbers[0], step.numbers[1], step.operators[0]);
        console.log("今はこんな感じ：", step.numbers[0], step.operators[0], step.numbers[1]);
    } else if (step.numbers.length == 1) {
        answer = step.numbers[0];
    } else { throw new Error("Invalid formula or insufficient operators!")};
    return answer; // Return the final result as a string
}
else {
    console.log(input);
    return myEval(parsedInput.numbers[0], parsedInput.numbers[1], parsedInput.operators[0]);
}}

const decideOperationOrder = (formula) => {
    let parsed = parseFormula(formula);
    const operationOrder = ["*", "/", "+", "-"];
    let firstOperator = parsed.operators[0];
    let secondOperator = parsed.operators[1] || ""; // Handle case with only one operator
    let intermediate_result;

    if (operationOrder.indexOf(firstOperator) <= operationOrder.indexOf(secondOperator)) {
        intermediate_result = myEval(parsed.numbers[0], parsed.numbers[1], firstOperator);
        parsed.numbers.splice(0, 2, intermediate_result.toString());
        parsed.operators.splice(0, 1);
    } else {
        intermediate_result = myEval(parsed.numbers[1], parsed.numbers[2], secondOperator);
        parsed.numbers.splice(1, 2, intermediate_result.toString());
        parsed.operators.splice(1, 1);
    }
    return {
        intermediate_result,
        numbers: parsed.numbers,
        operators: parsed.operators
    };
}

const parseFormula = (formula) => {
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
    return {
        numbers,
        operators
    }
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









    


