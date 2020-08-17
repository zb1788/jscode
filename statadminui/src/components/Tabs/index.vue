<template>
  <div :class="`vcom-tabs--${theme}`">
    <div :class="{
          'vcom-tabs-item': true,
          [`vcom-tabs-item--${theme}`]: true,
          [`vcom-tabs-item--${theme}--active`]: item.id === activeTabId
        }"
        v-for="item in data"
         :key="item.id"
         @click.self="handleMenuClick(item)"
    >
      {{ item.label }}
      <i
        v-show="closeAble && item.__closeAble !== false"
        :class="[
          'el-icon',
          'el-icon-close',
          `vcom-tabs-item-close--${theme}`
        ]"
        @click="$emit('close', item)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'vcom-tabs',

  props: {
    theme: {
      type: String,
      default: () => 'default'
    },
    data: {
      type: Array,
      default: () => []
    },
    activeTabId: {
      type: String,
      default: () => ''
    },
    closeAble: {
      type: Boolean,
      default: () => false
    }
  },

  methods: {
    handleMenuClick (item) {
      this.$emit('update:activeTabId', item.id);
      this.$emit('tab-click', item);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/style/theme";

.vcom-tabs {
  width: 100%;
  display: inline-flex;

  @at-root &--card{
    position: relative;
    line-height: 1;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 3px;
  }

  @at-root &--default{
    position: relative;
    line-height: 1;
    display: inline-block;

    &::before{
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      left: 0;
      bottom: 0;
      position: absolute;
      @include themeify{
        background: scale_color(themed('color-primary'), $lightness: 80%);
      }
    }
  }

   &-item{
    @at-root &--card{
      display: inline-block;
      padding: 10px 20px;
      cursor: pointer;
      border-radius:3px 3px 0 0;
      border:1px solid #e4e4e4; border-bottom:none;
      margin-bottom:-5px;
      @include themeify{
          color: scale_color(themed('color-text-default'), $lightness: 30%);
        }
      &:hover{
        @include themeify{
          color: themed('color-primary');
        }
      }

       &--active{
         padding: 12px 20px;
         border-radius:0;
         top: -1px;
         border-left:1px solid #e4e4e4;border-right:1px solid #e4e4e4;
         position: relative;
         @include themeify{
           background: #fff;
           color: themed('color-primary');
         }

        &::before{
          content: '';
          display: block;
          background: #489BEF;
          width: 100%;
          border-left:2px solid #489bef;
          height: 4px;
          border-radius:4px 4px 0 0;
          top: -4px;
          left: -1px;
          position: absolute;
        }
      }
    }

    @at-root &--default{
      cursor: pointer;
      display: inline-block;
      color: #fff;
      padding: 16px 4px;
      border-radius: 3px;
      & + & {
        margin-left: 12px;
      }
      @include themeify{
        color: themed('color-text-default');
      }

      &--active,&:hover{
        @include themeify{
          color: themed('color-primary');
        }
      }

      &--active{
        position: relative;
        &::after{
          content: '';
          height: 3px;
          width: calc(100% - 6px);
          position: absolute;
          bottom: 0px;
          left: 6px;
          @include themeify{
            background: scale_color(themed('color-primary'), $lightness: 20%);
          }
        }
      }
    }

    &-close{
      font-size: 24px;
      padding: 2px;
      position: absolute;
      top: 4px;
      right: 4px;
      @include themeify{
        color: themed('color-primary');
      }

      &--card{
        color: #999;
      }
    }

    & {
      margin-right: 12px;
    }

    &:hover{
      .vcom-tabs-item-close--card{
        border-radius: 50%;
        color: #fff;
        @include themeify{
          background: themed('color-primary');
        }
      }
    }
  }
}
</style>
