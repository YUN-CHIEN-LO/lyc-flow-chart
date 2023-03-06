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
