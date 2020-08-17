export default {
  methods: {
    /**
     * 删除弹窗
     * @returns {Promise<unknown>}
     */
    confirmDelete ({
      title = '删除',
      text = '是否删除此条数据？'
    }) {
      return new Promise((resolve, reject) => {
        this.$dialog({
          data: {
            loading: false
          },
          width: 400,
          renderHeader: () => <span>{title}</span>,
          render: (h, $dialog) => <div v-loading={$dialog.loading}>{text}</div>,
          renderFooter: (h, $dialog) => {
            return <div>
              <vcom-button
                size="small"
                type="primary"
                disabled={$dialog.loading}
                onClick={() => resolve($dialog)}
              >确定</vcom-button>
              <vcom-button
                size="small"
                onClick={() => {
                  $dialog.distroy();
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject();
                }}
              >取消</vcom-button>
            </div>;
          }
        });
      });
    },

    deleteFunctionDecoration (
      { title, text },
      success = () => { return false; },
      cancel = () => { return false; }
    ) {
      return (...args) => {
        this.confirmDelete({ title, text })
          .then(async ($dialog) => {
            $dialog.loading = true;
            const result = await success(...args);
            $dialog.loading = false;
            result !== false && $dialog.distroy();
          })
          .catch(() => cancel(...args));
      };
    },

    async responseMessage (
      func,
      success = () => '',
      error = () => ''
    ) {
      let res = await func();
      const { subCode, subMsg } = res || {};

      if (subCode === '200') {
        const successResult = success(res);
        if (successResult !== false) {
          let message = successResult || subMsg;
          this.$message.success(message);
        }
      } else {
        const errorResult = error(res);
        if (errorResult !== false) {
          let message = errorResult || subMsg;
          this.$message.error(message);
        }
      }

      return subCode === '200';
    },
    async responseMessage_other (
      func,
      success = () => '',
      error = () => ''
    ) {
      let res = await func();
      const { code } = res || {};
      if (code === 0) {
        let message = success(res) || '操作成功';
        this.$message.success(message);
      } else {
        let message = error(res) || '操作失败';
        this.$message.error(message);
      }
      return code === 0;
    }
  }
};
