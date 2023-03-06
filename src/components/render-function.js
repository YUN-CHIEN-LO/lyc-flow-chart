import { isFunction } from "lodash";
import { nodeType as TYPE } from "@/components/constants";
import { getNode } from "@/components/private-methods";
import { isEmptyValue } from "@/utils";



/**
 * 渲染插入節點
 *
 * @param {object} node - 節點
 * @param {object} context - 背景參數
 * @returns {Element}
 */
const renderAdd = (node, context) => {
  const { props, slots } = context;
  // 存在新增插槽
  const hasAddSlot = isFunction(slots.add);
  return (
    <div class="lyc-fc__insert">
      <div class="lyc-fc__arrow"></div>
      <div class="lyc-fc__add">
        {!props.showAdd ? (
          <div></div>
        ) : hasAddSlot ? (
          slots.add({
            // 節點資訊
            node: node,
            // 新增普通節點
            insertNode: (newNode) => {
              // this.insertNode(node.uuid, newNode);
            },
            // 新增分支
            insertFork: (newNode, branches = []) => {
              // this.insertFork(node.uuid, newNode, branches);
            },
          })
        ) : (
          "+"
        )}
      </div>
    </div>
  );
};

/**
 * 渲染結束節點
 *
 * @param {object} node - 節點資訊
 * @returns {Element}
 */
const renderEnd = (node, context) => {
  const { data, slots } = context;

  // 存在結束插槽
  const hasEndSlot = isFunction(slots.end);
  return (
    <div class="lyc-fc__wrapper">
      <div class={["lyc-fc__node", data.nodeClassName(node)]}>
        {hasEndSlot ? (
          slots.end({
            // 節點資訊
            node: node,
            // 更新節點
            // updateNode: (updates) => {
            //   this.updateNode(node.uuid, updates);
            // },
          })
        ) : (
          // TODO 多語系
          <div class="lyc-fc__node__content">
            <p>結束流程</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 渲染分支
 *
 * @param {object} node - 節點資訊
 * @returns {Element}
 */
const renderFork = (node, context) => {
  const { slots } = context;

  // 存在分支插槽
  const hasForkSlot = isFunction(slots.fork);
  return (
    <div
      class={[
        "lyc-fc__wrapper",
        "is-fork",
        { "is-empty-flow": isEmptyValue(getNode(node.next, context)) },
      ]}
    >
      {/* 新增分支按鈕 */}
      <div class="lyc-fc__fork">
        {hasForkSlot &&
          slots.fork({
            // 節點資訊
            node: node,
            // 新增分支
            insertBranch: (newNode) => {
              // this.insertBranch(node.uuid, newNode);
            },
            // 更新節點
            updateNode: (updates) => {
              // this.updateNode(node.uuid, updates);
            },
            // 刪除分支
            deleteFork: () => {
              // this.deleteFork(node);
            },
          })}
      </div>
      {/* 子流程 */}
      <div class="lyc-fc__next">
        <div class="lyc-fc__branch-flow">
          {node.children.map((child) => renderNode(child, context))}
        </div>
        {/* 插入節點 */}
        {renderAdd(node, context)}
        {/* 下一個節點 */}
        {renderNode(node.next, context)}
      </div>
    </div>
  );
};

/**
 * 渲染分支下的子流程
 *
 * @param {object} node - 節點資訊
 * @returns {Element}
 */
const renderBranch = (node, context) => {
  const { data, slots } = context;
  const { key, label } = data.map.value;
  // 節點序號
  const nodeId = node.data[key];

  // 子節點
  const nodeChildren = getNode(node.parent, context).children;
  const index = nodeChildren.findIndex((child) => child === node.uuid);

  // 存在子流程插槽
  const hasBranchSlot = isFunction(slots.branch);
  return (
    <div
      class={[
        "lyc-fc__wrapper",
        {
          "is-first-branch": index === 0,
          "is-last-branch": index === nodeChildren.length - 1,
        },
      ]}
      key={nodeId}
    >
      {
        /* 節點樣板 */
        <div class="lyc-fc__branch">
          <div
            class={["lyc-fc__node", { "is-root": node.isRoot }, data.nodeClassName(node)]}
            onClick={(evt) => {
              evt.stopPropagation();
              // this.handleSelected(node.uuid);
            }}
          >
            {hasBranchSlot ? (
              slots.branch({
                // 節點資訊
                node: node,
                // 更新節點
                updateNode: (updates) => {
                  // this.updateNode(node.uuid, updates);
                },
                // 刪除子流程
                deleteBranch: () => {
                  // this.deleteBranch(node);
                },
              })
            ) : (
              <div class="lyc-fc__node__content">
                <p>{node.data[label]}</p>
              </div>
            )}
          </div>
        </div>
      }
      {/* 插入節點 */}
      {renderAdd(node, context)}
      {/* 下一個節點 */}
      <div class={["lyc-fc__next", { "is-empty-next": isEmptyValue(getNode(node.next, context)) }]}>
        {renderNode(node.next, context)}
      </div>
    </div>
  );
};

/**
 * 渲染普通節點
 *
 * @param {object} node - 節點資訊
 * @returns {Element}
 */
const renderDefault = (node, context) => {
  const { slots, data } = context;
  if (isEmptyValue(node)) return "";
  const { key, label } = data.map.value;
  // 節點序號
  const nodeId = node.data[key];
  // 存在節點插槽
  const hasNodeSlot = isFunction(slots.node);

  return (
    <div class="lyc-fc__wrapper" key={nodeId}>
      {/* 普通節點 */}
      <div
        class={["lyc-fc__node", { ["is-root"]: node.isRoot }, data.nodeClassName(node)]}
        onClick={(evt) => {
          evt.stopPropagation();
          // this.handleSelected(node.uuid);
        }}
      >
        {hasNodeSlot ? (
          slots.node({
            // 節點資訊
            node: node,
            // 更新節點
            updateNode: (updates) => {
              // this.updateNode(node.uuid, updates);
            },
            // 刪除節點
            deleteNode: () => {
              // this.deleteNode(node.uuid);
            },
          })
        ) : (
          <div class="lyc-fc__node__content">
            <p>{node.data[label]}</p>
          </div>
        )}
      </div>
      {/* 插入節點 */}
      {renderAdd(node, context)}
      {/* 下一個節點 */}
      <div class={["lyc-fc__next", { "is-empty-next": isEmptyValue(getNode(node.next, context)) }]}>
        {renderNode(node.next, context)}
      </div>
    </div>
  );
};

/**
 * 渲染節點
 *
 * @param {String} nodeId - 節點序號
 * @param {object} context - 背景參數
 * @returns {Element}
 */
const renderNode = (nodeId, context) => {
  const node = getNode(nodeId, context);

  // 無效的節點
  if (isEmptyValue(node)) return <div></div>;

  switch (node.type) {
    // 結束節點
    case TYPE.end:
      return renderEnd(node, context);
    // 分支節點
    case TYPE.fork:
      return renderFork(node, context);
    // 子流程節點
    case TYPE.branch:
      return renderBranch(node, context);
    // 普通節點
    default:
      return renderDefault(node, context);
  }
};
/**
 * 渲染空資料
 *
 * @returns {Element}
 */
const renderEmpty = (context) => {
  // TODO 空白樣板
  // TODO 多語系
  const hasEmptySlot = isFunction(context.slots.empty);
  return hasEmptySlot ? context.slots.empty() : <div class="lyc-fc__empty">沒有資料</div>;
};
/**
 * 渲染根節點
 * @param {object} context - 背景參數
 * @returns {Element}
 */
const renderRoot = (context) => {
  const { isEmptyChart, root } = context.data;
  // 渲染流程圖
  try {
    return isEmptyChart.value ? renderEmpty(context) : renderNode(root, context);
  } catch (error) {
    console.warn("[LycFlowChart]: Render Failed.", error);
    return renderEmpty(context);
  }
};

export default function (context) {
  return {
    renderRoot: () => renderRoot(context),
  };
}
