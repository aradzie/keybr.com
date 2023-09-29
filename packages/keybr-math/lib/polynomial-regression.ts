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

import { linearRegression } from "./linear-regression.ts";
import { Polynomial } from "./polynomial.ts";
import { Sle } from "./sle.ts";
import { type Vector } from "./vector.ts";

export function polynomialRegression(
  vx: Vector,
  vy: Vector,
  degree: number,
): Polynomial {
  if (degree === 1) {
    return linearRegression(vx, vy);
  }

  const { length } = vx;
  if (length !== vy.length) {
    throw new Error();
  }
  if (length === 0) {
    throw new Error();
  }

  const size = degree + 1;
  const sle = new Sle(size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let t = 0;
      for (let l = 0; l < length; l++) {
        t += vx.at(l) ** (i + j);
      }
      sle.A[i][j] = t;
    }
  }
  for (let i = 0; i < size; i++) {
    let t = 0;
    for (let l = 0; l < length; l++) {
      t += vx.at(l) ** i * vy.at(l);
    }
    sle.y[i] = t;
  }
  return Polynomial.from(sle.solve());
}
