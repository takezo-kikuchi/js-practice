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
          decimalPlace = 1/10;
        } else {
          break; // Stop if an invalid character is found
        }
        if (hasDecimal) decimalPlace *= 10;
        index++;
      }
    if (decimalPlace > 0) num = num / decimalPlace;
    return sign * num;
}

const myEval = (a,b,operator) => {
    let result;
    a = myParseFloat(a)
    b = myParseFloat(b)
    if (operator == "+") {
        result = a+b  }
    else if (operator == "-") {
        result = a-b }
    else if (operator == "*") {
        result = a*b }
    else if (operator == "/"){
        // 0で割るとエラーになるので例外処理
        result = a/b
    }
    return result
}

const decideOperationOrder = (formula) => {
    const tokens = formula.match(/(\d+\.?\d?|\+|\-|\*|\/|\(|\))/g);
    const numbers = [];
    const operators = [];
    for (let i = 0; i < tokens.length; i++) {
        if (/\d+/.test(tokens[i])) {
          // If the token is a number, add to numbers array
          numbers.push(tokens[i]);
        } else {
          // If the token is an operator, add to operators array
          operators.push(tokens[i]);
        }
      }
      let firstOperator = operators[0];
      let secondOperator = operators[1];
      const operationOrder= ["*","/","+","-"]
      let intermediate_result;
      if (operationOrder.indexOf(firstOperator) < operationOrder.indexOf(secondOperator)) {
        intermediate_result = myEval(numbers[0],numbers[1],firstOperator)
        numbers.splice(0, 2, intermediate_result);
        operators.splice(0, 1);
      } else{
        intermediate_result = myEval(numbers[1],numbers[2],secondOperator)
        numbers.splice(1, 2, intermediate_result);
        operators.splice(1, 1);
      }
      return {
        intermediate_result,
        numbers,
        operators
      };
}
/*
const decideOperationOrder = (numbers, operators) => {
    const firstOperation = operators
    .map((operator, index) => (operator === "*" || operator === "/") ? index : -1)
    .filter((index) => index !== -1);
}
*/

const iterateOperation = (input) => {
    let step = decideOperationOrder(input);
   while (step.numbers.length > 1) {
    // reconstruct the formula from numbers and operators
    let formula = step.numbers[0].toString();
    for (let i = 0; i < step.operators.length; i++) {
        formula += step.operators[i] + step.numbers[i + 1];
      }
    step = decideOperationOrder(formula);
    
    }
    console.log("Current Step:", JSON.parse(JSON.stringify(step)));
    console.log("Numbers:", step.numbers.slice(), "Operators:", step.operators.slice());


    return step.intermediate_result;
}
    

document.getElementById("button2").addEventListener("click", function(event) {
    event.preventDefault();  // Prevents form submission
    let input = document.getElementById("formula-input").value;
    try {
        let result = iterateOperation(input);
        document.getElementById("result").textContent = result;
    } catch (e) {
        console.log(e);
        document.getElementById("result").textContent = "Error in formula!";
    }
});

