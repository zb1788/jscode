<template>
  <div class="vcom-menu">
    <div
      :class="
        [
          'vcom-menu-item',
          {
            'vcom-menu-item-active': activeRootMenuId === item.id,
            'vcom-menu-item-dropdown': item.children && item.children.length
          }
        ]"
       v-for="item in data"
       :key="item.label"
       @click.self="item.path && handleMenuClick(item, child)"
    >{{ item.label }}
      <i class="iconfont iconup" />
      <i class="iconfont icondown" />
      <div class="vcom-menu-group"
           v-if="item.children && item.children.length"
      >
        <div :class="`vcom-menu-item ${activeMenuId === child.id ? 'active' : ''}`"
             v-for="child in item.children"
             :key="child.label"
             @click="item !== activeMenuId && handleMenuClick(item, child)"
        >{{ child.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'vcom-menu',

  props: {
    data: {
      type: Array,
      default: () => []
    },

    value: {
      type: Array,
      default: () => ''
    }
  },

  computed: {
    activeRootMenuId () {
      return this.value[0];
    },
    activeMenuId () {
      return this.value[1];
    }
  },

  methods: {
    handleMenuClick (menu, childMenu) {
      const currentMenu = childMenu || menu;
      this.$emit('menu-selected', currentMenu);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/style/theme";

.vcom-menu{
  height: inherit;

  &-item{
    display: inline-block;
    cursor: pointer;
    height: inherit;
    line-height:20px;
    position: relative;
    font-size: 16px;
    box-sizing: border-box;
    padding: 15px 25px;
    @include themeify{
      color: scale_color(themed('color-primary'), $lightness: +75%);
    }

    .iconup,.icondown{font-size:12px;}
    .iconup{
      display: none;
    }

    .icondown{
      display: none;
    }

    &-dropdown{
      .icondown{
        display: inline-block;
      }
      &:hover{
        .iconup{
          display: inline-block;
        }
        .icondown{
          display: none;
        }
      }
    }

    &:hover{
      color: #fff;
      box-shadow:0 0 5px rgba(0,0,0,.3);
      top: 0px;
      @include themeify{
        background: themed('color-primary');
      }
    }
    &-active{ color:#fff !important; background:rgba(0,0,0,.1);}

    &:hover{
      .vcom-menu-group{
        display: block;
        border-top: 1px solid scale_color(themed('color-primary'), $lightness: 20%);
        box-shadow: 0 5px 5px rgba(0,0,0,.2);
        z-index: 4000;
      }
    }
  }

  &-group{
    display: none;
    position: absolute;
    width: 100%;
    top: 50px;
    left: 0;
    z-index: 99;
    @include themeify{
      background: themed('color-primary');
    }

    .vcom-menu-item{
      display: block;
      text-align: center;
      font-size: 14px;
      padding: 12px 5px;
      color:rgba(255,255,255,.7);

      &:hover{
        @include themeify{
          background: scale_color(themed('color-primary'), $lightness: 20%);
          color: scale_color(themed('color-primary'), $lightness: 100%);
          box-shadow: 0 0 0 transparent;
        }
      }

      &.active{
        @include themeify{
          background: rgba(0,0,0,.1);
          color:#fff;
          box-shadow: 0 0 0 transparent;
        }

        &::before{
          content: '';
          width: 5px;
          height:100%;
          position: absolute;
          left:-5px; bottom:0px; border-radius:5px 0 0 5px;
          @include themeify{
            background: scale_color(themed('color-primary'), $lightness: 100%);
          }
        }
      }
    }
  }
}
</style>
