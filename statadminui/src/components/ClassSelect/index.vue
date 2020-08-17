<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-04-29 15:26:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\ClassSelect\index.vue
 -->
<script type="text/jsx">
// const pager = {
//   pageNo: 1,
//   pageSize: 200
// }
import { getSchoolList } from '../../api/school';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    keyFields: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    fields () {
      return {
        ...{
          school: 'schoolId',
          grade: 'gradeCode',
          class: 'classCode'
        },
        ...this.keyFields
      };
    }
  },

  data () {
    return {
      options: {
        school: [],
        grade: [],
        class: []
      }
    };
  },

  methods: {
    loadOptions () {
      for (let key in this.options) {
        if (!this.options[key].length) {
          this.loadSchool();
        }
      }
    },
    async loadSchool () {
      const { data } = await getSchoolList(this.pager);
      this.options.school = data.records || [];
    }
  },

  render (h, context) {
    return <vcom-form
      v-model={this.value}
      items={Object.keys(this.options).reduce((result, key) => {
        const itemOptions = this.options[key] || [];

        if (itemOptions.length) {
          result.push({
            type: 'select',
            field: this.fields[key],
            options: itemOptions
          });
        }

        return result;
      }, [])}
    />;
  }
};
</script>
