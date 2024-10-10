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

const myEval = (formula) => {
    const operator = formula.match(/[^0-9.]/g);
    let result;
    // constしているのはa,bのみ　arrayではない
    let [a,b] = formula.split(operator[0]);
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


document.getElementById("button2").addEventListener("click", function(event) {
    event.preventDefault();  // Prevents form submission
    let formula = document.getElementById("formula-input").value;
    try {
        let result = myEval(formula);
        document.getElementById("result").textContent = result;
    } catch (e) {
        console.log(e);
        document.getElementById("result").textContent = "Error in formula!";
    }
});
