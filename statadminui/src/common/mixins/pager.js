import { typeOf } from '../../utils/object';

export default {
  data () {
    return {
      pager: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },

  methods: {
    /**
     * 设置当前分页信息 当当前页码大于总页数时 调用重载表格数据方法
     * @param pager
     * @param loadFunc
     */
    setPager (pager, loadFunc) {
      if (!pager) { return; }

      const { current, pages, size, total } = pager;

      this.$set(this.pager, 'pageNo', Math.min(current, pages) || 1);
      this.$set(this.pager, 'pageSize', size || 10);
      this.$set(this.pager, 'total', total || 0);
      if (current > pages && pages !== 0) {
        typeOf(loadFunc).toLowerCase() === 'function' && loadFunc();
      }
    }
  }
};
