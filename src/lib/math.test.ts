import { add, multiply } from './math';

describe('math', () => {
  it('add sums two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  it('multiply multiplies two numbers', () => {
    expect(multiply(2, 4)).toBe(8);
    expect(multiply(-3, 3)).toBe(-9);
  });
});
