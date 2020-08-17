import { getConfigListByCode } from '../../api/config';
import { objectListFieldConvert } from '../../utils/array';

export default {
  methods: {

    // 根据formItem.configCode(字典类型编码) 加载 options
    async loadFormItemsOptions (formItems = []) {
      for (let item of formItems) {
        if (item && item.field && item.configCode) {
          // eslint-disable-next-line
          const { data = {} } = await getConfigListByCode(item.configCode);
          this.modifyFormItem(
            formItems,
            item.field,
            {
              options: objectListFieldConvert(
                data.records,
                {
                  paramCode: 'value',
                  paramName: 'label'
                })
            }
          );
        }
      }
    },

    // 修改formItem
    modifyFormItem (formItems = [], field, props) {
      const formItem = formItems
        .find(item => item && item.field === field) || {};

      this.$set(formItems, formItems.indexOf(formItem), {
        ...formItem,
        ...props
      });
    },

    getFormItemByField (formItems = [], field) {
      return this.formItems.find(item => item.field === field);
    }
  }
};
