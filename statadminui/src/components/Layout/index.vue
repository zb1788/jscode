<template>
  <yj-container direction='vertical'>
    <yj-header height="60px">
      <vcom-header>
        <vcom-menu
          :data="menus"
          v-model="activeMenuIds"
          @menu-selected="handleMenuSelect"
        />
      </vcom-header>
    </yj-header>
    <yj-main>
     <div v-if="!menus || !menus.length">
        <div class="container" :class="{sysContainer: false}">
          <slot></slot>
        </div>
     </div>
      <div v-else>
        <vcom-tabs
          v-show="tabs && tabs.length"
          class="vcom-page-tabs"
          :data="tabs"
          :active-tab-id="activeTabId"
          @tab-click="(tab) => $router.push({ path: tab.path }).catch(e => { return e; })"
        />
        <div class="container" :class="{sysContainer: false}">
          <slot></slot>
        </div>
      </div>
    </yj-main>
  </yj-container>
</template>

<script>
import { mapState } from 'vuex';

import vcomMenu from '../../components/Menu';
import vcomTabs from '../../components/Tabs';
import vcomHeader from '../../components/Header';
import { find, forEach, arrayToTree } from '../../utils/tree';
import { last, sampling, objectListFieldConvert } from '../../utils/array';

export default {
  name: 'layout',

  components: {
    'vcom-menu': vcomMenu,
    'vcom-tabs': vcomTabs,
    'vcom-header': vcomHeader
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
      console.log(rootMenu);
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
      //           label: 'Canal采集管理',
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

    activeTabId () {
      let id = '';
      forEach(this.menus, (item, parents) => {
        const rootPath = `/${this.$route.path.split('/').filter(v => v)[0]}`;
        if (item.path === rootPath) {
          id = item.id;
        }
      });

      return id;
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler () {
        this.tabs = [];
        const rootPath = `/${(this.$route.path || '').split('/')[1]}`,
          item = find(this.menus, (item) => item.path && item.path === rootPath);

        if (!item) { return; }
        const { parents } = item,

          ids = [...sampling(parents.reverse(), 'id'), item.id];

        if (item.children && item.children.length) {
          const [ chilMenu = {} ] = item.children;
          ids.push(chilMenu.id);
        }

        if (ids.length === 3) {
          this.tabs = last(parents).children;
        }

        this.activeMenuIds = ids;
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

  .el-header{
    width: 100%;
    height: 60px;
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

  .sysContainer {
    width: 100%;
    height: calc(100% - 60px);
    position: absolute;
    left: 0;
    top: 60px;
    background-color: #fff;
  }

  .vcom-page-tabs {
    width: 100%;
    text-align: center;
    background-color:#fff;
    margin-bottom: 10px;
  }
</style>
