<script>
import { ref, reactive, computed } from "vue";
import { isEmpty, isFunction } from "lodash";

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
    const isEmptyChart = computed(() => {
      // 沒有資料
      return isEmpty(context.store);
    });

    /**
     * 資料鍵值對應
     *
     * @returns {Object}
     */
    const map = computed(() => {
      return {
        // 節點序號
        id: "id",
        // 節點類型
        type: "type",
        // 節點狀態
        status: "status",
        // 分支所有子流程
        children: "children",
        ...props.keyMap,
      };
    });

    return {
      /* ref */
      root, // ----------- 根節點序號
      /* reactive */
      store, // ---------- 格式化後的的渲染物件
      /* computed */
      map, // ------------ 資料鍵值對應
      isEmptyChart, // --- 流程圖是否為空
    };
  },
  methods: {
    /**
     * 渲染空資料
     */
    renderEmpty() {
      const hasEmptySlot = isFunction(this.$slots.empty);
      return hasEmptySlot ? this.$slots.empty() : <div class="lyc-fc__empty">沒有資料</div>;
    },
    /**
     * 渲染根節點
     *
     * @returns {Element}
     */
    renderRoot() {
      // 渲染流程圖
      try {
        return this.isEmptyChart ? this.renderEmpty() : this.renderNode(this.root);
      } catch (error) {
        console.warn("[BpmflowChart]: Render Failed.", error);
        return this.renderEmpty();
      }
    },
    //#endregion
  },
  render(h) {
    return (
      <div
        class="bpm-work-flow"
        onClick={(evt) => {
          evt.stopPropagation();
          // this.handleSelected();
        }}
      >
        {this.renderRoot()}
      </div>
    );
  },
};
</script>

<style lang="scss">
.lyc-fc {
  &__empty {
    border: solid 1px red;
  }
}
</style>
