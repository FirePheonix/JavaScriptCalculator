let display = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');



let buttonsArray = Array.from(buttons); // stores variables in array form
let string = '';
let equationsCount = 0; //kitne number of equations??
let mode = 0; // 2 = 2 variables 2 equations, 3 = 3 equations 3 variables

let isChoosingVariables = false; // so that 2 and 3 variables selecting 2 act differently


buttonsArray.forEach(btn => { // from arrays to each variable form and put in different functions

    btn.addEventListener('click', (e) => {

        if (e.target.innerHTML == 'DEL') {
            string = string.substring(0, string.length - 1);
            display.value = string;

        } else if (e.target.innerHTML == '3var') {
            string = "unknowns? 2 3?";
            display.value = string;
            isChoosingVariables = true;
            
        } else if (e.target.innerHTML == '2' && isChoosingVariables) { //for 2 equations 2 variables
                
            mode=2;
            equationsCount=1;
            string = 'Enter Eqn' + equationsCount + "(a,b,c)"
            display.value = string;

        }

        else if (e.target.innerHTML == '3' && isChoosingVariables) { // for 3 equations 3 variables

            mode=3;
            equationsCount = 1;
            string = 'Enter Eqn' + equationsCount + "(a,b,c,d)"
            display.value = string;

            let equations = []; //made 2d array, coefficients yahaan store
            let [a11, a12, a13, b1] = equations[0];
            let [a21, a22, a23, b2] = equations[1];
            let [a31, a32, a33, b3] = equations[2];

            for (let i = 0; i < 3; i++) {

                let equation = []; //made array for EACH equation
        
                // Ask the user for coefficients of x, y, z, and the constant
                let x = parseFloat(prompt(`Enter coefficient of x for equation ${i + 1}:`));
                let y = parseFloat(prompt(`Enter coefficient of y for equation ${i + 1}:`));
                let z = parseFloat(prompt(`Enter coefficient of z for equation ${i + 1}:`));
                let constant = parseFloat(prompt(`Enter constant for equation ${i + 1}:`));
        
                //adding the coefficients and constant to the array named equations
                equation.push(x, y, z, constant);
        
                //adding the equation to the 2D equations array
                equations.push(equation);
            }

            for(equationsCount = 1; equationsCount<=3; equationsCount++ ) {
                equations

            }
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
        else if (e.target.innerHTML == 'log') { // log function
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue) && currentValue > 0) {
                string = Math.log10(currentValue).toString(); //math logic uska
                display.value = string;
            } else {
                display.value = 'Sytax Error';
            }

        } else if (e.target.innerHTML == 'ln') { //natural log (ln)
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue) && currentValue > 0) {
                string = Math.log(currentValue).toString(); //math logic uska
                display.value = string;
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'sin') { // for sin function (in radians)
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue)) {
                string = Math.sin(currentValue).toString(); // math logic iska
                display.value = string;
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'cos') { // for cosine function (in radians)
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue)) {
                string = Math.cos(currentValue).toString(); 
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'AC') { // for "All Clear"
            string = '';
            display.value = string;

        } else if (e.target.innerHTML == '=') { // result
            if (string.includes('^')) { // Exponentiation handling
                let parts = string.split('^'); 
                let base = parseFloat(parts[0]);
                let exponent = parseFloat(parts[1]);

                if (!isNaN(base) && !isNaN(exponent)) {
                    string = Math.pow(base, exponent).toString(); 
                } else {
                    string = 'Syntax Error';
                }
                display.value = string;

            } else {
                try {
                    string = eval(string); //inbuilt function for basic arithmetic operations
                    display.value = string;
                } catch {
                    display.value = 'Syntax Error'; // it is the case of invalid expressions
                }
            }

        } else if (e.target.innerHTML == 'x<sup>-1</sup>') { // (1/x)
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue) && currentValue !== 0) {
                string = (1 / currentValue).toString();
                display.value = string;
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'sqrt') { 
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue) && currentValue >= 0) {
                string = Math.sqrt(currentValue).toString(); // Calculate square root
                display.value = string;
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'e<sup>x</sup>') { 
            let currentValue = parseFloat(display.value);
            if (!isNaN(currentValue)) {
                string = Math.exp(currentValue).toString(); // Calculate e^x
                display.value = string;
            } else {
                display.value = 'Syntax Error';
            }

        } else if (e.target.innerHTML == 'x<sup>?</sup>') { //for custom exponent (x^y)
            string += '^'; // Append the exponent symbol and wait for user input
            display.value = string;

        } else { // for normal button clicks (numbers, operators)
            string += e.target.innerHTML;
            display.value = string;
        }

    });

});

function determinant(a1, b1, c1, a2, b2, c2, a3, b3, c3) {
    return (a1 * ((b2 * c3) - (b3 * c2)) 
          - b1 * ((a2 * c3) - (a3 * c2)) 
          + c1 * ((a2 * b3) - (a3 * b2)));
}