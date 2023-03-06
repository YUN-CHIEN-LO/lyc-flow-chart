<template>
  <div :class="['lyc-fc__add-btn', { 'is-disabled': disabled }]">
    <div class="lyc-fc__add-btn__cross"></div>
  </div>
</template>

<script>
export default {
  name: "LycAddButton",
  props: {
    // 節點資訊
    node: {
      type: Object,
      default: () => {},
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.lyc-fc {
  &__add-btn {
    @include setFlex();
    background-color: $primary;
    width: 36px;
    height: 36px;
    border-radius: 100%;
    @include setTransition();
    cursor: pointer;

    &__cross {
      @include setTransition();
      position: relative;
      transform-origin: center center;
      &::before,
      &::after {
        content: "";
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        width: 2px;
        height: 18px;
        background-color: $white;
        border-radius: 2px;
      }
      &::after {
        transform: translate(-50%, -50%) rotate(90deg);
      }
    }
    &.is-disabled {
      cursor: not-allowed;
      filter: grayscale(60%);
      & .lyc-fc__add-btn__cross {
        transform: rotate(45deg);
      }
    }
    &:hover {
      @include shadow(4px -4px rgba($black, 0.2));
      transform: rotate(90deg);
    }
  }
}
</style>
>
