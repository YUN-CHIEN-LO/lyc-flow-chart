<script>
import { ref, reactive, computed, onMounted } from "vue";
import { isEmptyValue } from "@/utils";
import { isFunction } from "lodash";
import publicMethods from "@/components/public-methods";
import renderFunctions from "@/components/render-function";

export default {
  name: "LycFlowChart",
  props: {
    // 流程圖資料
    data: {
      type: Array,
      default: () => [],
    },
    // 節點自訂樣式
    nodeClassName: {
      type: [String, Function],
      default: "",
    },
    // 資料鍵值對應
    keyMap: {
      type: Object,
      default: () => ({}),
    },
    // 刪除節點前的 callback
    beforeDelete: {
      type: Function,
      default: null,
    },
    // 刪除唯一子流程
    removeRemainingBranch: {
      type: Boolean,
      default: true,
    },
    // 是否禁用元件
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否顯示新增節點插槽
    showAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    // 格式化後的的渲染物件
    const store = reactive({});
    // 根節點序號
    const root = ref("");

    /**
     * 流程圖是否為空
     *
     * @returns {boolean}
     */
    const isEmptyChart = computed(() => isEmptyValue(store));

    /**
     * 資料鍵值對應
     *
     * @returns {object}
     */
    const map = computed(() => ({
      key: "key", // 節點序號
      label: "label", // 節點標籤
      children: "children", // 分支所有子流程
      ...props.keyMap,
    }));

    /**
     * 自訂樣式命名
     *
     * @param {Object} node - 節點資訊
     * @returns {String}
     */
    const nodeClassName = (node) =>
      isFunction(props.nodeClassName) ? props.nodeClassName(node) : props.nodeClassName;

    // 返回樣板數據
    const data = {
      root, // ----------- 根節點序號
      store, // ---------- 格式化後的的渲染物件
      map, // ------------ 資料鍵值對應
      isEmptyChart, // --- 流程圖是否為空
      nodeClassName, // -- 自訂樣式命名
    };

    const thisContext = {
      ...context,
      props: props,
      data: data,
    };

    const { initStoreData, ...publicFunctions } = publicMethods(thisContext);

    /**
     * 更新元件渲染
     */
    const doLayout = () => {
      try {
        // 產生資料
        const { root: newRoot, store: newStore } = initStoreData(props.data, map);
        root.value = newRoot;
        store.value = newStore;
      } catch (error) {
        // 錯誤捕獲
        console.warn("[LycFlowChart] Init Error: ", error);
      }
    };

    // 公開方法
    context.expose({ doLayout, ...publicFunctions });

    onMounted(() => {
      // 初始渲染
      doLayout();
    });

    // 渲染根節點
    const { renderRoot } = renderFunctions(thisContext);

    return {
      renderRoot,
    };
  },
  render(h) {
    return <div class="lyc-fc">{this.renderRoot()}</div>;
  },
};
</script>

<style lang="scss" scoped>
.lyc-fc {
  color: $black;
  background-color: $background-color;
  padding: 8px;
  transform-origin: top left;
  // 節點 wrapper
  &__wrapper {
    @include setFlex($fd: column, $jc: flex-start);
    align-self: stretch;
    flex: 1;
    position: relative;
    &.is-first-branch {
      &::before {
        content: "";
        @include setPosition($p: absolute, $t: -3px, $l: 0%);
        width: calc(50% - 1px);
        height: calc(100% - 6px);
        border-top: solid 6px $background-color;
        border-bottom: solid 6px $background-color;
        pointer-events: none;
      }
    }
    &.is-last-branch {
      &::after {
        content: "";
        @include setPosition($p: absolute, $t: -3px, $r: 0%);
        width: calc(50% - 1px);
        height: calc(100% - 6px);
        border-top: solid 6px $background-color;
        border-bottom: solid 6px $background-color;
        pointer-events: none;
      }
    }
    &.is-fork {
      &.is-empty-flow > .lyc-fc__next > .lyc-fc__insert {
        min-height: 16px;
        flex: 1;
      }
    }
  }
  // 節點樣式
  &__node {
    position: relative;
    margin: 16px 8px 0px 8px;
    // 預設節點樣版
    &__content {
      @extend .box-sizing-border;
      min-width: 220px;
      background-color: $node-color;
      border-radius: 4px;
      border: solid 1px $primary;
      @include setTransition();
      padding: 8px;
      & p {
        width: 100%;
        text-align: center;
      }
    }

    // 若不是發起節點，顯示指向箭頭
    &:not(.is-root) {
      &::after {
        content: "";
        @include setPosition($p: absolute, $t: -16px, $l: 50%);
        transform: translateX(-50%) rotate(45deg);
        width: 12px;
        height: 12px;
        border-right: solid $line-color 2px;
        border-bottom: solid $line-color 2px;
      }
      &::before {
        content: "";
        @extend .box-sizing-border;
        @include setPosition($p: absolute, $t: -18px, $l: calc(50% - 1px));
        height: 16px;
        border-left: solid $line-color 2px;
      }
    }
    // hover 時，顯示陰影
    &:not(.is-selected):hover {
      & .lyc-fc__node__content {
        @include shadow(4px 4px rgba($black, 0.2));
      }
    }
    // 普通節點 - 節點標題
    &__title {
      @include setFlex($jc: flex-start, $fw: nowrap);
      & p {
        // @include setTextEllipsis();
        width: 146px;
        margin: 0;
        padding-left: 8px;
      }
    }
    // 普通節點 - 分隔線
    &__bar {
      height: 4px;
      width: 100%;
      border-radius: 4px;
      margin: 4px 0px 8px 0px;
    }
    // 普通節點 - 工具列
    &__tools {
      @include setFlex();
      margin-left: auto;
      display: none;
    }
    // 普通節點 - 狀態列
    &__status {
      margin-left: auto;
      display: flex;
    }
    // hover 時，顯示工具列
    &:hover {
      & .lyc-fc__node__tools {
        display: flex;
        & + .lyc-fc__node__status {
          display: none;
        }
      }
    }
    // 普通節點 - 內容
    &__content {
      @include setFlex($jc: flex-start);
      min-height: 32px;
      width: 100%;
      // color: $gray-15;
      font-size: 14px;
    }
    // 流程發起節點
    &.is-root {
      & .lyc-fc__node__tools {
        display: none !important;
      }
    }
    // 流程結束節點
    &.is-end {
      width: 72px;
      min-width: 72px;
      height: 72px;
      border-radius: 100%;
      padding: 0;
      @include setFlex();
      color: $line-color;
      text-align: center;
      margin-bottom: 16px;
    }
    // 分支下的子流程節點
    &.is-branch {
      height: 68px;
      margin: 36px 8px 0px 8px;
      &::before {
        content: "";
        @extend .box-sizing-border;
        @include setPosition($p: absolute, $t: -38px, $l: calc(50% - 1px));
        height: 38px;
        border-left: solid $line-color 2px;
      }
    }
    // 當前選中的節點
    &.is-selected {
      border: solid 1px $primary;
      @include shadow(0px 0px 0px rgba($primary, 0.5));
    }
  }
  // 節點插入區域
  &__insert {
    @include setFlex($ai: flex-start);
    position: relative;
    min-height: 36px;
  }
  // 接點指向線
  &__arrow {
    @include setPosition($p: absolute, $t: 0px, $l: 50%);
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 2px);
    background-color: $line-color;
  }
  // 插入節點按鈕
  &__add {
    z-index: 100;
    margin: 8px;
  }
  // 下一個節點
  &__next {
    @include setFlex($fd: column, $jc: flex-start);
    flex: 1;
    &.is-empty-next {
      background-color: $line-color;
      width: 2px;
    }
  }
  // 分支
  &__fork {
    z-index: 10;
    position: relative;
    padding-bottom: 16px;
    &::before {
      content: "";
      @extend .box-sizing-border;
      @include setPosition($p: absolute, $b: 0px, $l: calc(50% - 1px));
      height: 16px;
      border-left: solid $line-color 2px;
    }
  }
  // 子流程開始
  &__branch {
    min-width: 48px;
    margin: 0px 4px;
    margin-top: 16px;
    &::before {
      content: "";
      @extend .box-sizing-border;
      @include setPosition($p: absolute, $t: 0px, $l: calc(50% - 1px));
      height: 16px;
      border-left: solid $line-color 2px;
    }
  }
  // 分支下的子流程
  &__branch-flow {
    border-top: solid 2px $line-color;
    border-bottom: solid 2px $line-color;
    @include setFlex($ai: flex-start, $fw: nowrap);
  }
}
</style>
