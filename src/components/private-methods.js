import { isEmptyValue } from "@/utils";

/**
 * 取得指定節點
 *
 * @param {string} uuid - 節點序號
 * @returns {object}
 */
export const getNode = (uuid, { data }) => {
  const id = uuid?.value ?? uuid
  // 抵達子流程終點
  if (isEmptyValue(id)) return {};
  // 找不到節點資訊，結束流程
  if (isEmptyValue(data.store.value[id])) {
    return null;
  }
  // 返回指定節點資訊
  return data.store.value[id];
};
