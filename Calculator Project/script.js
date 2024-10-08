let display = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let buttonsArray = Array.from(buttons); // stores variables in array form
let string = '';
let equationsCount = 0; // number of equations
let mode = 0; // 2 = 2 variables 2 equations, 3 = 3 equations 3 variables
let isChoosingVariables = false; // so that 2 and 3 variables selecting 2 act differently
let coefficients = []; // Array to hold coefficients of the equations
let exp = "";
buttonsArray.forEach(btn => { // from arrays to each variable form and put in different functions

    btn.addEventListener('click', (e) => {
        const value = e.target.innerHTML;

        if (value === 'DEL') {
            string = string.substring(0, string.length - 1);
            display.value = string;

        } else if (value === '3var') {
            string = "unknowns? 2 3?";
            display.value = string;
            isChoosingVariables = true;

        } else if (value === '2' && isChoosingVariables) {              // for 2 equations 2 variables
            mode = 2;
            equationsCount = 0; // Reset equation count
            string = 'Enter coefficients for Equation 1 (a,b,c):';
            display.value = string;

        } else if (value === '3' && isChoosingVariables) {          // for 3 equations 3 variables
            mode = 3;
            equationsCount = 0;                     // Reset equation count
            string = 'Enter coefficients for Equation 1 (a,b,c,d):';
            display.value = string;

        } else if (value === '=') {          
            if (mode > 0) {             // If in equation mode, process equations
                processEquations();
                console.log()
            } else {                    // If in normal mode, evaluate the expression
                calculateExpression();
            }
        }else if (value === '↵') {          // for space
            string += ' ';
            display.value = string;
        } else if (value === 'AC') {        // Clear krne k lie
            string = '';
            coefficients = []; 
            display.value = string;
        } else if (['log', 'ln', 'sin', 'cos', 'sqrt', 'e<sup>x</sup>', 'x<sup>-1</sup>', 'x<sup>?</sup>'].includes(value)) {
            // Handle mathematical functions
            calculateFunctions(value);
        } else {                // Normal button clicks (numbers, operators, etc.)
            if (mode > 0) {                 // eqn wale case k lie
                exp += value;
                display.value = string + exp;
            } else {                        // baki k lie
                string += value;
                display.value = string + exp;
            }
        }
    });
});

function calculateExpression() {
    try {
        // Evaluate the expression in the display
        let result = eval(string); // Replace 'x' with '*' for multiplication
        string = result.toString();
        display.value = string; // Update the display with the result
    } catch (error) {
        display.value = 'Syntax Error'; // Handle syntax errors
    }
}


function calculateFunctions(func) {
    let currentValue = parseFloat(display.value);
    if (func === 'log') {
        if (!isNaN(currentValue) && currentValue > 0) {
            string = Math.log10(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'ln') {
        if (!isNaN(currentValue) && currentValue > 0) {
            string = Math.log(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'sin') {
        if (!isNaN(currentValue)) {
            string = Math.sin(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'cos') {
        if (!isNaN(currentValue)) {
            string = Math.cos(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'sqrt') {
        if (!isNaN(currentValue) && currentValue >= 0) {
            string = Math.sqrt(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'e<sup>x</sup>') {
        if (!isNaN(currentValue)) {
            string = Math.exp(currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'x<sup>-1</sup>') {
        if (!isNaN(currentValue) && currentValue !== 0) {
            string = (1 / currentValue).toString();
        } else {
            string = 'Syntax Error';
        }
    } else if (func === 'x<sup>?</sup>') {
        string += '^'; // Append the exponent symbol
    }

    display.value = string; // Update display with the result
}

function processEquations() {
    exp = ""
    const inputs = exp.split(' ').map(num => parseFloat(num));
    console.log(inputs)
    coefficients.push(inputs); // Add the inputted coefficients to the array

    equationsCount++;
    string = `Enter coefficients for Equation ${equationsCount + 1} (a,b,c${mode === 3 ? ',d' : ''}):`;
    display.value = string + exp;
    console.log(coefficients);
    // If all equations are entered, solve the equations
    if ((mode === 2 && equationsCount === 2) || (mode === 3 && equationsCount === 3)) {
        solveEquations();
    }
}

function solveEquations() {
    let equations;
    if (mode === 2) {
        equations = [
            [...coefficients[0], 0], // 2 variables + constant
            [...coefficients[1], 0],
        ];
    } else if (mode === 3) {
        equations = [
            [...coefficients[0]],
            [...coefficients[1]],
            [...coefficients[2]],
        ];
    }

    let [a11, a12, a13, b1] = equations[0];
    let [a21, a22, a23, b2] = equations[1];
    let [a31, a32, a33, b3] = equations[2] || [0, 0, 0, 0];

    let D = determinant(a11, a12, a13, a21, a22, a23, a31, a32, a33);
    let Dx = determinant(b1, a12, a13, b2, a22, a23, b3, a32, a33);
    let Dy = determinant(a11, b1, a13, a21, b2, a23, a31, b3, a33);
    let Dz = determinant(a11, a12, b1, a21, a22, b2, a31, a32, b3);

    if (D !== 0) {
        let x = Dx / D;
        let y = Dy / D;
        let z = Dz / D;
        display.value = `x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`;
    } else {
        if (Dx === 0 && Dy === 0 && Dz === 0) {
            display.value = "Infinite Solutions";
        } else {
            display.value = "No Solution";
        }
    }
}

function determinant(a1, b1, c1, a2, b2, c2, a3, b3, c3) {
    return (a1 * ((b2 * c3) - (b3 * c2)) 
          - b1 * ((a2 * c3) - (a3 * c2)) 
          + c1 * ((a2 * b3) - (a3 * b2)));
}
