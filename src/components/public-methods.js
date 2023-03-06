import { nodeType as TYPE } from "@/components/constants";
import { isEmptyValue, uuid } from "@/utils";
import { isFunction, isArray } from "lodash";

const initStoreData = (data, map) => {
  // 倉儲數據
  let store = {};
  // 結束節點
  let end = null;
  // 子節點 key 值
  const { children: childrenKey } = map.value;
  /**
   * 遞迴展開數據
   *
   * @param {Array} source - 陣列數據
   * @returns {string} - 第一個節點的序號
   */
  const recursiveFormat = (source) => {
    // 節點序號
    let uid = null;
    // 流程開始節點
    let start = null;
    // 前一個節點序號
    let prev = null;
    source.forEach((node) => {
      // 儲存前一個節點序號
      prev = uid;
      // 賦予節點序號
      uid = uuid();
      // 紀錄結束節點
      end = uid;
      // 如果是流程發起節點，紀錄節點序號
      if (!start) start = uid;
      // 新增節點
      store[uid] = {
        // 序號
        uuid: uid,
        // 原始數據
        data: node,
      };
      // 分支節點
      if (!isEmptyValue(node[childrenKey])) {
        // 賦予分支節點類型
        store[uid].type = TYPE.fork;
        // 初始子流程陣列
        store[uid].children = [];
        // 節點是分支
        store[uid].isFork = true;
        // 處理分支節點下的子流程
        node[childrenKey].forEach((child) => {
          // 遞迴展開子流程
          const branchId = recursiveFormat(child);
          // 維護分支的子流程陣列
          store[uid].children.push(branchId);
          // 維護將子流程起始節點的父層資訓
          store[branchId].parent = uid;
          // 將子流程起始節點的類型設為子流程
          store[branchId].type = TYPE.branch;
        });
      } else {
        // 節點為普通節點
        store[uid].type = TYPE.default;
      }
      // 銜接前一節點
      if (!isEmptyValue(store[prev])) {
        store[uid].prev = prev;
        store[prev].next = uid;
      }
    });
    // 返回流程起始節點序號
    return start;
  };
  // 遞迴展開數據
  let root = recursiveFormat(data);
  // 維護起始節點
  store[root].isRoot = true;
  // 維護結束節點
  store[end].isEnd = true;
  store[end].type = TYPE.end;
  // 更新資料
  return {
    root: root,
    store: store,
  };
};

/**
 * 取得節點 id
 *
 * @param {string} nodeId - 節點序號
 * @returns {string}
 */
const getNodeId = (nodeId, { data, }) => {
  const { id } = data.map.value;
  const nodes = data.store.value;
  return Object.keys(nodes).find((key) => nodes[key].data[id] === nodeId);
};

/**
 * 透過 id 取得節點
 *
 * @param {string} nodeId - 節點 id
 * @returns {object}  - 節點
 */
const getNodeById = (nodeId, context) => {
  const target = getNodeId(nodeId, context);
  const nodes = context.data.store.value;
  return nodes[target] ?? {};
};
/**
 * 新增普通節點
 *
 * @param {string} target  - 插入的標的節點序號
 * @param {object} newNode - 新節點內容
 */
const insertNodeById = (target, newNode) => {
  const node = this.getNodeById(target);
  // 若項目不存在，返回
  if (!node) return;
  // 新增普通節點
  this.insertNode(node.uuid, newNode);
};
/**
 * 新增子流程
 *
 * @param {string} target  - 插入的標的節點序號
 * @param {object} newNode - 新節點內容
 */
const insertBranchById = (target, newNode) => {
  const node = this.getNodeById(target);
  // 若項目不存在，返回
  if (!node) return;
  // 新增子流程
  this.insertBranch(node.uuid, newNode);
};
/**
 * 新增分支
 *
 * @param {string} target  - 插入的標的節點序號
 * @param {object} newNode - 新節點內容
 * @param {Array} branches - 預設子流程
 */
const insertForkById = (target, newNode, branches = []) => {
  const node = this.getNodeById(target);
  // 若項目不存在，返回
  if (!node) return;
  // 新增子流程
  this.insertFork(node.uuid, newNode, branches);
};
/**
 * 使用 id 更新節點
 *
 * @param {string | Array} nodeId - 節點 id
 * @param {object} updates - 更新內容
 */
const updateNodeById = (nodeId, updates = {}) => {
  // 節點不存在
  if (isEmptyValue(nodeId)) return;
  // 修改單一節點，或是修改多個節點
  const nodes = isArray(nodeId) ? nodeId : [nodeId];
  nodes.forEach((id) => {
    const node = this.getNodeById(id);
    // 更新原來的項目
    if (node.uuid) this.updateNode(node.uuid, updates);
    else console.warn("[BpmFlowChart]: node not found. " + id);
  });
};
/**
 * 使用 id 刪除節點
 *
 * @param {string} nodeId - 要刪除的節點 id
 */
const deleteNodeById = (nodeId) => {
  const node = this.getNodeById(nodeId);
  // 若項目不存在，返回
  if (!node) return;
  // 刪除節點
  this.deleteNode(node.uuid);
};
/**
 * 刪除子流程
 *
 * @param {string} nodeId - 要刪除的子流程節點 id
 */
const deleteBranchById = (nodeId) => {
  const node = this.getNodeById(nodeId);
  // 若項目不存在，返回
  if (!node) return;
  // 刪除子流程節點
  this.deleteBranch(node);
};
/**
 * 刪除分支
 *
 * @param {string} nodeId - 要刪除的分支節點 id
 */
const deleteForkById = (nodeId) => {
  const node = this.getNodeById(nodeId);
  // 若項目不存在，返回
  if (!node) return;
  // 刪除分支節點
  this.deleteFork(node);
};
/**
 * 返回巢狀數據
 *
 * @returns {Array}
 */
const getNestedData = () => {
  const { children } = this.map;
  // 組合巢狀陣列
  const nestedFormat = (nodeId) => {
    let data = [];
    let node = this.store[nodeId];
    while (node) {
      // 分支節點
      if (node.type === TYPE.fork) {
        data.push(
          Object.assign(node.data, {
            // 遞迴子節點
            [children]: node.children.map((child) => nestedFormat(child)),
          })
        );
      }
      // 其他節點
      else {
        data.push(node.data);
      }
      node = this.store[node.next];
    }
    return data;
  };
  return nestedFormat(this.root);
};
/**
 * 取得某節點之前的所有節點
 *
 * @param {string} nodeId - 節點 id
 * @returns {Array}
 */
const getPrevousNodes = (nodeId, {store}) => {
  // 節點清單
  let list = [];
  // 指標，指著被選中的節點
  let pointer = nodeId;
  // 被選中的節點
  let node = {};
  // 上一個節點
  let prevNode = {};

  // 當節點存在，進行迴圈，否則輸出節點清單
  while (!isEmptyValue(pointer)) {
    // 被選中的節點
    node = this.store[pointer];
    // 上一個節點
    prevNode = this.store[node.prev];

    // 若上一個節點是分支，需要遍歷分支下所有子流程與其節點
    if (prevNode?.type === TYPE.fork) {
      list = [
        ...prevNode.children.reduce(
          (accumulator, child) => [...accumulator, ...this.walkBranch(child)],
          []
        ),
        ...list,
      ];
      // 移動指標到上一節點
      pointer = node.prev;
    }
    // 若上一個節點是子流程起始點，需往上遍歷
    else if (prevNode?.type === TYPE.branch) {
      // 移動指標到父層 (所屬分支節點)
      pointer = prevNode.parent;
    }
    // 否則，若上一節點存在，插入節點資訊
    else if (prevNode?.uuid) {
      list.unshift(prevNode);
      // 移動指標到上一節點
      pointer = node.prev;
    }
    // 例外狀況，終止回圈
    else {
      pointer = null;
    }
  }
  return list;
};
/**
 * 遍歷所有節點
 *
 * @param {Function} callback -  回呼函式 callback
 */
const forEachNode = (callback, {data}) => {
  if (!isFunction(callback)) return;
  const nodes = data.store.value
  Object.keys(nodes).forEach((key) => {
    callback(nodes[key]);
  });
};

export default function (context) {
  return {
    initStoreData,
    getNodeId: (nodeId) => getNodeId(nodeId, context),
    getNodeById: (nodeId) => getNodeById(nodeId, context),
    forEachNode: (callback) => forEachNode(callback, context)
  };
}
