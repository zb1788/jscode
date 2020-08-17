import { first } from '../../utils/array';
export default {
  methods: {
    $handleOperationClick (item) {
      if (!item.path) { return; }

      this.activeOperationTabId = item.id;

      for (let operationItem of this.operationViewList) {
        if (operationItem.id === item.id) {
          this.operationViewList.splice(
            this.operationViewList.indexOf(operationItem),
            1,
            item
          );

          return;
        }
      }

      this.operationViewList.push(item);
    },
    $remoteOperation (opearationId) {
      this.operationViewList = this.operationViewList.filter(({ id }) => id !== opearationId);
      const defaultItem = first(this.operationViewList);
      if (defaultItem && defaultItem) {
        this.activeOperationTabId = defaultItem.id;
      }
    }
  },
  watch: {
    // 根据当前路由 选中tab页
    '$route' () {
      const currentTab = this.operationViewList
        .find(({ path }) => path === this.$route.path);

      if (currentTab) {
        this.$set(this, 'activeOperationTabId', currentTab.id);
        return;
      }

      const activeTab = this.operationViewList
        .find(({ path }) => path === this.activeOperationTabId);

      if (!activeTab && this.$route.path.split('/').filter(str => str).length > 2) {
        return;
      } else {
        const { path, query } = first(this.operationViewList) || {};
        path && this.$router.push({ path, query }).catch(e => { return e; });
      }

      if (activeTab && activeTab.path) {
        this.$router.push({ path: activeTab.path, query: activeTab.query }).catch(e => { return e; });
      }
    }
  }
};
