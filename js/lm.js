export default class LevenbergMarquardtSolver {
  
    static solve(f, initialGuess, maxIterations = 100, tolerance = 1e-8, lambda = 0.001, epsilon = 1e-8) {
      let iterationData = []; 
      let x = initialGuess;
      let iter = 0;
      let stop = false;
  
      while (!stop && iter < maxIterations) {
        const fval = f(x);
        const fNorm = this.norm(fval);
        iterationData.push({ iter, x: x.slice(), fNorm });
  
        // Stop if the norm of the function is small enough
        if (fNorm < tolerance) {
          stop = true;
          break;
        }
  
        // Compute the Gauss-Newton direction
        const jacobian = this.numericalJacobian(f, x, epsilon, fval);
        const Jt = this.transpose(jacobian);
        const JtJ = this.multiply(Jt, jacobian);
        const Jtf = this.multiply(Jt, fval);
        
        // Modify the normal equations for Levenberg-Marquardt
        const A = this.addLambdaToDiagonal(JtJ, lambda);
        const step = this.solveLinearSystem(A, this.negate(Jtf));
        
        // Evaluate the function at new candidate point
        const newX = this.add(x, step);
        const newFval = f(newX);
        const newFNorm = this.norm(newFval);
  
        // Check if we should accept the step (trust-region strategy)
        if (newFNorm < fNorm) {
          // Accept the step
          x = newX;
          lambda /= 2;
        } else {
          // Reject the step
          lambda *= 2;
        }
  
        iter++;
      }

      let status = null;
      if (this.norm(f(x)) < tolerance) {
        status = "Converged";
      }
      else {
        status = "Max Iterations Reached";
      }
  
      return {solution: x, status: status, iterationData: iterationData};
    }
  
    static norm(vec) {
      return Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
    }
  
    static transpose(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }
  
    static multiply(A, B) {
      if (B[0].length === undefined) {
        // B is a vector
        return A.map(row => row.reduce((acc, val, i) => acc + val * B[i], 0));
      } else {
        // B is a matrix
        return A.map(row =>
          B[0].map((_, j) =>
            row.reduce((acc, val, i) => acc + val * B[i][j], 0)
          )
        );
      }
    }
  
    static addLambdaToDiagonal(mat, lambda) {
      return mat.map((row, i) => row.map((val, j) => i === j ? val + lambda : val));
    }
  
    static solveLinearSystem(A, b) {
      // Implementing a simple Gaussian elimination here for demonstration purposes.
      // Note: Not the most stable or efficient method for large systems.
      const n = A.length;
      for (let i = 0; i < n; i++) {
        let max = i;
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(A[j][i]) > Math.abs(A[max][i])) {
            max = j;
          }
        }
  
        [A[i], A[max]] = [A[max], A[i]];
        [b[i], b[max]] = [b[max], b[i]];
  
        for (let j = i + 1; j < n; j++) {
          const factor = A[j][i] / A[i][i];
          b[j] -= factor * b[i];
          for (let k = i; k < n; k++) {
            A[j][k] -= factor * A[i][k];
          }
        }
      }
  
      const x = Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
          sum += A[i][j] * x[j];
        }
        x[i] = (b[i] - sum) / A[i][i];
      }
      return x;
    }
  
    static negate(vec) {
      return vec.map(v => -v);
    }
  
    static add(a, b) {
      return a.map((v, i) => v + b[i]);
    }

    static numericalJacobian(f, x, epsilon, fx) {
      let jacobian = [];
        
      //if (constraintFunc) {
      //    fx.push(constraintFunc(x));
      //}

      for (let i = 0; i < x.length; i++) {
          let x1 = x.slice();
          let x2 = x.slice();
          x1[i] += epsilon;
          x2[i] -= epsilon;
          let fx1 = f(x1);
          let fx2 = f(x2);
          //if (constraintFunc) {
          //    fx1.push(constraintFunc(x1));
          //    fx2.push(constraintFunc(x2));
          //}

          let column = fx1.map((_, j) => (fx1[j] - fx2[j]) / (2 * epsilon));
          jacobian.push(column);
      }

      return this.transpose(jacobian);
    }
}