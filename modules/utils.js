/**
 * utils.js — Shared utilities
 * Used by: scam-detector.js, main.js (locator + currency)
 */

/**
 * Simple deterministic hash → stable demo results per input.
 * @param {string} str
 * @returns {number}
 */
export function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
