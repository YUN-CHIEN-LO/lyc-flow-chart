<template>
  <div>
    DEMO
    <br />

    <LycFlowChart :data="flowData" :key-map="keyMap">
      <!-- <template #empty>
        <h1>hello world</h1>
      </template> -->
    </LycFlowChart>
  </div>
</template>

<script>
import { reactive } from "vue";
import LycFlowChart from "@/components/LycFlowChart.vue";

export default {
  name: "App",
  components: { LycFlowChart },
  setup() {
    const flowData = reactive([]);
    const keyMap = reactive({ id: "sn" });
    return {
      flowData,
      keyMap,
    };
  },
};
</script>
