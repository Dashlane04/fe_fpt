/**
 * Problem 03: Algorithm
 * Given an integer n. Write a function called makeDigitZero() that takes n as parameter.
 * Each steps, the value of n is changed, we can subtract n from a value which is equal to one of the digits in n.
 * Calculate the minimum number of steps so that n = 0.
 *
 * @param {number} n (0 <= n <= 10^6)
 * @returns {number} minimum number of steps
 */
function makeDigitZero(n) {
    if (n === 0) return 0;

    // Use a dynamic programming approach to find the minimum steps for each number from 1 to n
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= n; i++) {
        let temp = i;
        while (temp > 0) {
            let digit = temp % 10;
            if (digit > 0) {
                dp[i] = Math.min(dp[i], dp[i - digit] + 1);
            }
            temp = Math.floor(temp / 10);
        }
    }

    return dp[n];
}

// Example
console.log("n = 27. Output makeDigitZero(n) =", makeDigitZero(27));
