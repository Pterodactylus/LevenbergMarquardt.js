# Multi-Function Solver Examples for GitHub README.md

This README provides examples of how to use a multi-function solver. Each example outlines different scenarios and mathematical problems being solved.

# Example 1: System of Linear Equations

Solving a system of linear equations can be fundamental yet crucial. Here, we address the system:

$$
\begin{align*}
x + 2y &= 5 \\
3x + 4y &= 11
\end{align*}
$$

Here's how you could set up the solver:

```javascript
const equations = (vars) => [
  vars[0] + 2 * vars[1] - 5,
  3 * vars[0] + 4 * vars[1] - 11
];

const initialGuess = [0, 0];
const solver = new MultiFunctionSolver();
const solution = solver.solve(equations, initialGuess);
console.log('Solution:', solution);
```

# Example 2: Nonlinear System

For nonlinear systems, which are more complex and prevalent in real-world applications, consider the following example where we solve the equations:


$$
\begin{align*}
x^2 + y^2 &= 4 \\
e^x + y &= 1
\end{align*}
$$


Here's the setup:

```javascript
const nonlinearEquations = (vars) => [
  vars[0]**2 + vars[1]**2 - 4,
  Math.exp(vars[0]) + vars[1] - 1
];

const initialGuessNonlinear = [1, 1];
const solverNonlinear = new MultiFunctionSolver();
const solutionNonlinear = solverNonlinear.solve(nonlinearEquations, initialGuessNonlinear);
console.log('Nonlinear Solution:', solutionNonlinear);
```

# Example 3: Fitting Data

Data fitting is a common problem in statistics and machine learning. Here, we fit a quadratic curve (y = ax^2 + bx + c) to a set of data points.

```javascript
const xData = [0, 1, 2, 3, 4];
const yData = [1, 2.1, 3.9, 8, 15.9];

const fittingFunction = (params) => xData.map((x, idx) => params[0] * x**2 + params[1] * x + params[2] - yData[idx]);

const initialGuessFitting = [1, 1, 1];
const solverFitting = new MultiFunctionSolver();
const solutionFitting = solverFitting.solve(fittingFunction, initialGuessFitting);
console.log('Fitting Parameters:', solutionFitting);
```