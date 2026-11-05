// 1. calculator.js - Basic arithmetic calculator
class Calculator {
    constructor() {
        this.result = 0;
    }

    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
    }

    power(base, exponent) {
        return Math.pow(base, exponent);
    }

    squareRoot(num) {
        if (num < 0) throw new Error("Cannot take square root of negative number");
        return Math.sqrt(num);
    }
}

module.exports = Calculator;
