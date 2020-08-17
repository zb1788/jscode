import { getConfigListByCode } from '../../api/config';
import { objectListFieldConvert } from '../../utils/array';

export default {
  data () {
    return {
      dictionaryObj: {}
    };
  },
  methods: {
    async getConfigListByCode (configCode) {
      const { data = {} } = await getConfigListByCode(configCode);
      return objectListFieldConvert(
        data.records,
        {
          paramCode: 'value',
          paramName: 'label'
        }
      );
    }
  },
  async created () {
    this.dictionaryList.forEach(async (key) => {
      let options = await this.getConfigListByCode(key);
      this.$set(this.dictionaryObj, key, options);
    });
  }
};
