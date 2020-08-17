<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-07 08:51:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base-tpl\src\components\Layout\Home.vue
 -->
<template>
  <yj-container direction='vertical'>
    <yj-header>
      <vcom-system />
    </yj-header>
    <yj-main>
      <div class="container" :class="{ sysContainer: true }">
        <slot></slot>
      </div>
    </yj-main>
  </yj-container>
</template>

<script>
import vcomSystem from '../../components/SystemHeader';

export default {
  name: 'layout-home',

  components: {
    'vcom-system': vcomSystem
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/style/theme.scss";

  .el-header {
    width: 100%;
    height: 70px;
    @include themeify {
      background: themed('color-primary-dark');
    }
  }

  .el-container {
    height: 100%;
    @include themeify {
      background: themed('color-barkcgournd');
    }
  }
  .sysContainer{
    width: 100%;
    height:calc(100% - 60px);
    position: absolute;
    left: 0;
    top: 60px;
    background-color: #fff;
  }
  .vcom-page-tabs{
    width: 100%;
    margin-top: 24px;
    text-align: center;
    /*margin-bottom: 12px;*/
  }
</style>
