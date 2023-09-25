// The MIT License (MIT)
//
// Copyright (c) Tom Alexander <me@tomalexander.co.nz>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

type Vector = Array<number>;
type Matrix = Array<Vector>;

/**
 * A system of linear equations which solves `A * x = y` for `x`,
 * where `A` is an input matrix, `y` is an input vector.
 */
export class Sle {
  readonly size: number;
  readonly A: Matrix;
  readonly y: Vector;

  constructor(size: number) {
    const A = new Array<Array<number>>(size + 1);
    for (let i = 0; i < size; i++) {
      A[i] = new Array<number>(size).fill(0);
    }
    const y = new Array<number>(size).fill(0);
    A[size] = y;
    this.size = size;
    this.A = A;
    this.y = y;
  }

  solve(): Vector {
    const { size, A } = this;

    for (let i = 0; i < size; i++) {
      let maxrow = i;
      for (let j = i + 1; j < size; j++) {
        if (Math.abs(A[i][j]) > Math.abs(A[i][maxrow])) {
          maxrow = j;
        }
      }

      for (let k = i; k < size + 1; k++) {
        const tmp = A[k][i];
        A[k][i] = A[k][maxrow];
        A[k][maxrow] = tmp;
      }

      for (let j = i + 1; j < size; j++) {
        for (let k = size; k >= i; k--) {
          A[k][j] -= (A[k][i] * A[i][j]) / A[i][i];
        }
      }
    }

    const x = new Array<number>(size);
    for (let j = size - 1; j >= 0; j--) {
      let s = 0;
      for (let k = j + 1; k < size; k++) {
        s += A[k][j] * x[k];
      }
      x[j] = (A[size][j] - s) / A[j][j];
    }
    return x;
  }
}
