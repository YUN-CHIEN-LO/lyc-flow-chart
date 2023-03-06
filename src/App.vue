<template>
  <div>
    <LycFlowChart :data="flowData" :key-map="keyMap" showAdd>
      <!-- <template #node="{ node }">
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
    const flowData = reactive([
      {
        sn: "start-default",
        type: "start",
        status: "default",
      },
      {
        sn: "approval-5538706c-3e98-4b7a-9c05-6354072ccc4f",
        type: "approval",
        status: "danger",
      },
      {
        sn: "approval-5538706c-3e98-4b7a-c987-6354072ccc4f",
        type: "approval",
        status: "warning",
      },
      {
        sn: "fork-ed6b661b-3905-4ab4-92bd-67ac7cd0eb3e",
        type: "fork",
        status: "default",
        children: [
          [
            {
              sn: "branch-23423382-5a59-4da9-ad7f-67747ac70c8b",
              type: "branch",
              status: "default",
            },
            {
              sn: "approval-f5cc5164-f1ac-4d48-b37d-8d42a9d68014",
              type: "approval",
              status: "default",
            },
          ],
          [
            {
              sn: "branch-5afc7d3b-3e92-4b2f-9d5b-54109d0f641f",
              type: "branch",
              status: "default",
            },
            {
              sn: "fork-4c94c0c4-7900-40c4-b89d-60d22c1e7691",
              type: "fork",
              status: "default",
              children: [
                [
                  {
                    sn: "branch-1a619cb0-8203-4bde-9d4e-2c855e8f2d38",
                    type: "branch",
                    status: "default",
                  },
                  {
                    sn: "approval-43d0bc9e-5a60-44be-be44-364001586928",
                    type: "approval",
                    status: "default",
                  },
                ],
                [
                  {
                    sn: "branch-e13a7ab6-fd74-4ecc-9688-05684b463c34",
                    type: "branch",
                    status: "default",
                  },
                ],
              ],
            },
          ],
          [
            {
              sn: "branch-8b065807-eaf1-473d-adc4-3d150ff2eef1",
              type: "branch",
              status: "default",
            },
          ],
        ],
      },
      {
        sn: "approval-default",
        type: "approval",
        status: "default",
      },
      {
        sn: "end-default",
        type: "end",
        status: "default",
      },
    ]);
    const keyMap = reactive({ id: "sn", label: "type" });

    return {
      flowData,
      keyMap,
    };
  },
};
</script>

<style lang="scss">
body,
html {
  background-color: $background-color;
  margin: 0;
  padding: 0;
}
</style>
