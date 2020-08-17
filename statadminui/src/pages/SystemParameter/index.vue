<template>
  <vcom-panel class="page-system">
    <div class="page-system-main">
      <router-view></router-view>
    </div>
  </vcom-panel>
</template>

<style lang="scss">
$header-height: 60px;
$page-height: calc(100vh - 100px);
$menu-width: 280px;
$main-width: calc(100vw - #{$menu-width} - 50px);

.page-system {
  &>.vcom-panel-container{
    padding: 0!important;
  }
  &-main{
    box-sizing: border-box;
    width: $main-width;
    height: $page-height;
    position: absolute;
    left: $menu-width + 10px;
    top: 40px;
  }
}
</style>
