let display = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let buttonsArray = Array.from(buttons); // stores buttons in array form
let string = '';
let equationsCount = 0; // for number of equations
let mode = 0; // 2 = 2 variables 2 equations, 3 = 3 equations 3 variables
let isChoosingVariables = false; // to handle variable selection
let coefficients = []; // array to hold coefficients of the equations
let exp = "";
let currentCoefficientIndex = 0; // Keeps track of which coefficient is being entered
let currentEquation = 0;  // Keeps track of which equation is being entered
let coefficientLabels = [];   // Stores the labels for coefficients based on mode

function initializeCoefficientLabels() {
    if (mode === 2) {
        coefficientLabels = ['a11', 'a12', 'b1', 'a21', 'a22', 'b2']; // Coefficients for 2x2 system
    } else if (mode === 3) {
        coefficientLabels = ['a11', 'a12', 'a13', 'd1', 'a21', 'a22', 'a23', 'd2', 'a31', 'a32', 'a33', 'd3']; // 3x3 system
    }
}

buttonsArray.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const value = e.target.innerHTML;

        if (value === 'DEL') {
            string = string.substring(0, string.length - 1);
            display.value = string;

        } else if (value === '3var') {
            string = "unknowns? 2 3?";
            display.value = string;
            isChoosingVariables = true;

        } else if (value === '2' && isChoosingVariables) { // for 2 equations 2 variables
            mode = 2;
            equationsCount = 0; // Reset equation count
            isChoosingVariables = false;
            initializeCoefficientLabels(); 
            processEquations();

        } else if (value === '3' && isChoosingVariables) {  // for 3 equations 3 variables
            mode = 3;
            equationsCount = 0;                     
            isChoosingVariables = false;
            initializeCoefficientLabels(); // Initialize coefficients
            processEquations(); 

        } else if (value === '=') {          
            if (mode > 0) {             
                let enteredValue = parseFloat(exp);
                if (!isNaN(enteredValue)) {
                    coefficients.push(enteredValue); 
                    exp = ''; 
                    currentCoefficientIndex++; 

                    
                    if (currentCoefficientIndex === coefficientLabels.length) {
                        solveEquations(); 
                    } else {
                        processEquations();
                    }
                }
            } else {              
                calculateExpression();
            }
        } else if (value === '↵') {   
            string += ' ';
            display.value = string;
        } else if (value === 'AC') {  //All clear
            string = '';
            coefficients = []; 
            display.value = string;
            currentCoefficientIndex = 0;  // Reset for coefficient input
            currentEquation = 0;
        } else if (['log', 'ln', 'sin', 'cos', 'sqrt', 'e<sup>x</sup>', 'x<sup>-1</sup>', 'x<sup>?</sup>'].includes(value)) {
            // this has all the mathematical functions
            calculateFunctions(value);
        } else {                
            if (mode > 0) {                 
                exp += value;
                display.value = string + exp;
            } else {                        
                string += value;
                display.value = string + exp;
            }
        }
    });
});

function processEquations() {
    
    if (currentCoefficientIndex < coefficientLabels.length) {
        string = `Enter ${coefficientLabels[currentCoefficientIndex]}:`;
        display.value = string;
    }
}

function calculateExpression() {
    try {
        
        let result = eval(string); //eval is an inbuilt function for string --> code
        string = result.toString();
        display.value = string; 
    } catch (error) {
        display.value = 'Syntax Error'; 
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
        string += '^'; 
    }

    display.value = string; 
}

function solveEquations() {
    let equations = [];
    if (mode === 2) {
        equations = [
            [coefficients[0], coefficients[1], coefficients[2]], // a11, a12, b1
            [coefficients[3], coefficients[4], coefficients[5]], // a21, a22, b2
        ];
    } else if (mode === 3) {
        equations = [
            [coefficients[0], coefficients[1], coefficients[2], coefficients[3]], // a11, a12, a13, d1
            [coefficients[4], coefficients[5], coefficients[6], coefficients[7]], // a21, a22, a23, d2
            [coefficients[8], coefficients[9], coefficients[10], coefficients[11]], // a31, a32, a33, d3
        ];
    }

    if (mode === 2) {
        // Solving the 2x2 system of equations
        let [a11, a12, b1] = equations[0];
        let [a21, a22, b2] = equations[1];

        let D = a11 * a22 - a12 * a21;
        let Dx = b1 * a22 - b2 * a12;
        let Dy = a11 * b2 - a21 * b1;

        if (D !== 0) {
            let x = Dx / D;
            let y = Dy / D;
            display.value = `x=${x.toFixed(2)}, y=${y.toFixed(2)}`;
        } else {
            display.value = (Dx === 0 && Dy === 0) ? "Infinite Solutions" : "No Solution";
        }

    } else if (mode === 3) {
        // Solving the 3x3 system of equations using determinants
        let [a11, a12, a13, d1] = equations[0];
        let [a21, a22, a23, d2] = equations[1];
        let [a31, a32, a33, d3] = equations[2];

        // Calculate determinants
        let D = determinant(a11, a12, a13, a21, a22, a23, a31, a32, a33);
        let Dx = determinant(d1, a12, a13, d2, a22, a23, d3, a32, a33);
        let Dy = determinant(a11, d1, a13, a21, d2, a23, a31, d3, a33);
        let Dz = determinant(a11, a12, d1, a21, a22, d2, a31, a32, d3);

        if (D !== 0) {
            let x = Dx / D;
            let y = Dy / D;
            let z = Dz / D;
            display.value = `x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`;
        } else {
            display.value = (Dx === 0 && Dy === 0 && Dz === 0) ? "Infinite Solutions" : "No Solution";
        }
    }

    // Reset for new input
    currentCoefficientIndex = 0;
    coefficients = [];
}

//function to calculate the determinant of a 3x3 matrix
function determinant(a1, b1, c1, a2, b2, c2, a3, b3, c3) {
    
    return (
        a1 * (b2 * c3 - b3 * c2) -
        b1 * (a2 * c3 - a3 * c2) +
        c1 * (a2 * b3 - a3 * b2)
    );

}


function determinant(a1, b1, c1, a2, b2, c2, a3, b3, c3) {
    
    return (a1 * ((b2 * c3) - (b3 * c2)) 
          - b1 * ((a2 * c3) - (a3 * c2)) 
          + c1 * ((a2 * b3) - (a3 * b2)));

}

