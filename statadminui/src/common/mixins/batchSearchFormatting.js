export default {
  methods: {
    formatBatchSearch (params) {
      let arr = [...new Set(params.split(' ').filter(item => item))];
      if (arr.length > 200) {
        this.$message({
          type: 'warning',
          message: '搜索条数超过200条，仅展示前200条',
          duration: 2000
        });
        arr = arr.slice(0, 200);
      }
      return arr.join(':::');
    }
  }
};
