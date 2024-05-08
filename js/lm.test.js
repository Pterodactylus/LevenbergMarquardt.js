// Import the solver
import LevenbergMarquardtSolver from './lm.js';
import {jest} from '@jest/globals';

function expectToBeCloseToArray(actual, expected) {
    expect(actual.length).toEqual(expected.length)
    actual.forEach((x, i) =>
      expect(x).toBeCloseTo(expected[i], 6)
    )
}

describe('LevenbergMarquardtSolver Tests', () => {

  test('It solves a simple linear system of equations', () => {
    const equations = (vars) => [
      vars[0] + 2 * vars[1] - 5,
      3 * vars[0] + 4 * vars[1] - 11
    ];
    const initialGuess = [0, 0];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(equations, initialGuess);
    expectToBeCloseToArray(equations(solution), [0, 0]);
  });

  test('It solves a simple nonlinear system', () => {
    const equations = (vars) => [
      vars[0]**2 + vars[1]**2 - 4,
      vars[0]*vars[0] + vars[1] - 3  // Example modified for clear readability
    ];
    const initialGuess = [1, 1];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(equations, initialGuess);
    expectToBeCloseToArray(equations(solution), [0, 0]);
  });

  test('It solves a second nonlinear system', () => {
    const equations = (vars) => [
      vars[0]**2 + vars[1]**2 - 4,
      Math.exp(vars[0]) + vars[1] - 1
    ];
    const initialGuess = [1, 1];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(equations, initialGuess);
    expectToBeCloseToArray(equations(solution), [0, 0]);
  });

  test('It returns null for inconsistent systems', () => {
    const equations = (vars) => [
      2 * vars[0] + 3 * vars[1] - 10,
      2 * vars[0] + 3 * vars[1] - 12  // Impossible scenario given a = 10 != 12
    ];
    const initialGuess = [0, 0];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(equations, initialGuess, 200);
    expect(status).toEqual("Max Iterations Reached");
  });

  test('It does data fitting', () => {
    const xData = [0, 1, 2, 3, 4];
    const yData = [1, 2.1, 3.9, 8, 15.9];

    const fittingFunction = (params) => xData.map((x, idx) => params[0] * x**2 + params[1] * x + params[2] - yData[idx]);

    const initialGuessFitting = [1, 1, 1];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(fittingFunction, initialGuessFitting);
    expect(LevenbergMarquardtSolver.norm(fittingFunction(solution))).toBeLessThan(1);
  });

  test('Solver returns array with the correct size of variables', () => {
    const equations = (vars) => [
      vars[0] + vars[1] + vars[2] - 6,
      vars[0] - vars[1] - 2*vars[2] - 1,
      2*vars[1] - 3*vars[2] - 9
    ];
    const initialGuess = [0, 0, 0];
    const {solution, status, iterationData} = LevenbergMarquardtSolver.solve(equations, initialGuess);
    expectToBeCloseToArray(equations(solution), [0, 0, 0]);
  });

});