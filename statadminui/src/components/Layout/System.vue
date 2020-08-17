<template>
  <yj-container class="layout-system" direction='vertical'>
    <yj-header>
      <vcom-header>
        <vcom-menu
          :data="menus"
          v-model="activeMenuIds"
          @menu-selected="handleMenuSelect"
        />
      </vcom-header>
    </yj-header>
    <yj-main>
      <div class="layout-system-menu">
        <vcom-menu-left
          v-model="activeTabId"
          :data="tabs"
        />
      </div>
      <slot></slot>
    </yj-main>
  </yj-container>
</template>

<script>
import { mapState } from 'vuex';

import vcomMenu from '../../components/Menu';
import VcomMenuLeft from '../../components/MenuLeft';
import vcomHeader from '../../components/Header';

import { find, arrayToTree } from '../../utils/tree';
import { objectListFieldConvert } from '../../utils/array';

export default {
  name: 'layout-system',

  components: {
    'vcom-menu': vcomMenu,
    VcomMenuLeft,
    vcomHeader
  },

  data () {
    return {
      activeMenuIds: [],
      tabs: []
    };
  },

  computed: {
    ...mapState('user', [
      'ownMenus'
    ]),
    menus () {
      const [ rootMenu = {} ] = arrayToTree(
        objectListFieldConvert(
          this.ownMenus || [],
          { moduleId: 'id', moduleName: 'label', moduleUrl: 'path', parentId: 'parentId' }
        ),
        undefined,
        '00'
      );

      return rootMenu.children;
      // let menusObj = {
      //   id: '01',
      //   label: '统计管理',
      //   parentId: '00',
      //   children: [
      //     {
      //       id: '01.05',
      //       label: '用户统计',
      //       parentId: '01',
      //       children: [
      //         {
      //           id: '01.05.01',
      //           label: '用户激活',
      //           path: '/useractive',
      //           parentId: '01.05'
      //         }
      //       ]
      //     },
      //     {
      //       id: '01.03',
      //       label: '系统管理',
      //       parentId: '01',
      //       children: [
      //         {
      //           id: '01.03.02',
      //           label: '规则管理',
      //           parentId: '01.03',
      //           children: [
      //             {
      //               id: '01.03.02.01',
      //               label: '分组管理',
      //               path: '/rulegroup',
      //               parentId: '01.03.02'
      //             },
      //             {
      //               id: '01.03.02.02',
      //               label: '规则管理',
      //               path: '/rule',
      //               parentId: '01.03.02'
      //             }
      //           ]
      //         },
      //         {
      //           id: '01.03.03',
      //           label: 'Canel采集管理',
      //           parentId: '01.03',
      //           children: [
      //             {
      //               id: '01.03.03.01',
      //               label: 'Topic管理',
      //               path: '/topic',
      //               parentId: '01.03.03'
      //             },
      //             {
      //               id: '01.03.03.02',
      //               label: 'Table管理',
      //               path: '/table',
      //               parentId: '01.03.03'
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // };
      // return menusObj.children;
    },

    activeTabId: {
      get () {
        const activeTab = find(this.tabs, item => item.path === this.$route.path) || {};
        return activeTab.id;
      },
      set (id) {
        const route = this.tabs.find(item => item.id === id);
        if (route && route.path) {
          this.$router.push({ path: route.path }).catch(e => { return e; });
        }
      }
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler () {
        this.tabs = [];
        const item = find(this.menus, (item) => item.path && item.path === this.$route.path);

        if (!item) { return; }

        const [rootMenu] = item.parents || [];

        if (!rootMenu) { return; }

        this.tabs = rootMenu.children;

        this.activeMenuIds = item.id;
      }
    }
  },
  methods: {
    handleMenuSelect (menu) {
      if (menu.path) {
        this.$router.push({ path: menu.path }).catch(e => { return e; });
      } else if (menu.children && menu.children.length) {
        this.$router.push({ path: menu.children[0].path }).catch(e => { return e; });
      }

      if (menu.children && menu.children.length) {
        const [ chilMenu = {} ] = menu.children;
        this.$router.push({ path: chilMenu.path }).catch(e => { return e; });
      }
    }
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
  .el-main{
    padding: 0;
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

  $header-height: 60px;
  $page-height: calc(100vh - 60px);
  $menu-width: 280px;
  $main-width: calc(100vw - #{$menu-width} - 20px);

  .layout-system {
    &-menu{
      width: $menu-width;
      height: calc(#{$page-height} - 20px);
      background: #fff;
      position: absolute;
      left: 0;
    }

    &-main{
      box-sizing: border-box;
      width: $main-width;
      height: $page-height;
      position: absolute;
      left: $menu-width + 10px;
      top: $header-height;
      margin-top: 20px;
    }
  }
</style>
