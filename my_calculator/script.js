'use strict';

const myParseFloat = (str) => {
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
      firstOperator = operators[0];
      secondOperator = operators[1];
      const operationOrder= ["*","/","+","-"]
      if (operationOrder.indexOf(firstOperator) < operationOrder.indexOf(secondOperator)) {
          return myEval(numbers[0],numbers[1],firstOperator)
      } else{
        return myEval(numbers[1],numbers[2],secondOperator)
      }
      // Returning an object containing numbers and operators
  return {
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

    

document.getElementById("button2").addEventListener("click", function(event) {
    event.preventDefault();  // Prevents form submission
    let formula = document.getElementById("formula-input").value;
    let process=splitFormula(formula);
    console.log(process.numbers);
    console.log(process.operators);
    try {
        let result = myEval(formula);
        document.getElementById("result").textContent = result;
    } catch (e) {
        console.log(e);
        document.getElementById("result").textContent = "Error in formula!";
    }
});

