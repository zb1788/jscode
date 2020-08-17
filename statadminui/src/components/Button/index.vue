<template>
    <div
      v-loading="loading"
      :class="[
        'vcom-button',
        `vcom-button--${type}`,
        `vcom-button--${size}`,
        {
          'is-plain': plain,
          'is-ghost': ghost,
          'vcom-button--disabled': disabled
        }
      ]"
      @click="handleClick"
    >
    <span style='text-align: center'>
      <slot></slot>
    </span>
  </div>
</template>

<script type="text/jsx">
export default {
  name: 'vcom-button',

  props: {
    type: {
      type: String,
      default: () => 'default'
    },
    plain: {
      type: Boolean,
      default: () => false
    },
    ghost: {
      type: Boolean,
      default: () => false
    },
    /**
     * 按钮大小
     * small normal
     */
    size: {
      type: String,
      default: () => 'normal'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false
    };
  },

  methods: {
    async handleClick () {
      if (this.disabled) { return; }

      this.$emit('click');
    }
  }

};
</script>

<style scoped lang="scss">
@import "../../assets/style/theme";

@mixin button-color($background, $lightness-color){
  background: $background;
  border: 1px solid $lightness-color;

  &:hover{
    background: $lightness-color;
    border-color: $lightness-color;
  }

  &:active{
    background: $background;
    border-color: $background;
  }

  &.is-ghost{
    background: none;
    color: $background;
    border-color: transparent;
    padding: 2px;
    line-height: 14px;
    margin-right: 0;
    margin:5px 0;
  }

  &.is-plain{
    color: $background;
    background: transparent;

    &:hover{
      color: #fff;
      background: themed('color');
      border: 1px solid themed('color');
    }

    &:active{
      color: $background;
      background: #fff;
      border: 1px solid $lightness-color;
    }
  }
}

.vcom-button {
  display: inline-block;
  box-sizing: border-box;
  text-anchor: middle;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
  text-transform: none;
  user-select: none;
  position: relative;
  top: 1px;
  margin: 1px;
  text-align: center;
  & {
    margin-right: 10px;
  }

  &--normal{
    padding: 0 20px;
    line-height: 32px;
  }
  &--bigger{
    padding: 0 110px;
    line-height: 38px;
  }
  &--small{
    line-height: 27px;
    padding: 0 15px;
  }

  &--default{
    @include themeify{
      @include button-color(#666, #bbb);
      background: transparent;
      color: #333;
    }
  }

  &--primary{
    @include themeify{
      @include button-color(
          themed('color-primary'),
          scale_color(themed('color-primary'), $lightness: +0%)
      );
    }
  }

  &--success{
    @include themeify{
      @include button-color(
          themed('color-success'),
          scale_color(themed('color-success'), $lightness: +40%)
      );
    }
  }

  &--danger{
    @include themeify{
      @include button-color(
          red,
          scale_color(red, $lightness: +40%)
      );
    }
  }

  .iconfont{
    line-height: inherit;
    position: relative;
    top: 2px;
  }

  @at-root &--disabled{
    background: #fbfbfb !important;
    color: #CCCCCC !important;
    border: 1px solid #E4E4E4 !important;
    cursor: not-allowed;
  }
}

</style>
