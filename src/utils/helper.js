import { isEmpty, isFunction } from "lodash";

/**
 * 值是否為空
 *
 * @param {any} value - 判斷值
 * @returns {boolean}
 */
export function isEmptyValue(value) {
  return isEmpty(value);
}

/**
 * 產生亂數序號
 *
 * @returns {string} 回傳亂數序號
 */
export function uuid() {
  let currentDate = Date.now();

  if (!isEmptyValue(performance) && isFunction(performance.now)) {
    //use high-precision timer if available
    currentDate += performance.now();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (code) => {
    let randowID = (currentDate + Math.random() * 16) % 16 | 0;
    currentDate = Math.floor(currentDate / 16);
    return (code === "x" ? randowID : (randowID & 0x3) | 0x8).toString(16);
  });
}
