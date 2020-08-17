<!--
 * @Author: your name
 * @Date: 2020-02-27 17:08:10
 * @LastEditTime: 2020-05-06 17:27:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\components\SuiteAreaSelect\index.vue
 -->
<script type="text/jsx">
import { getAreaList } from '../../api/base';

import { getAreaIdList } from '../../utils/area';

const config = [
  { label: '省' },
  { label: '市' },
  { label: '区/县' },
  { label: '乡镇' }
];

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    length: {
      type: Number,
      default: () => config.length
    },
    showLabel: {
      type: Boolean,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    defaultAreaId: {
      type: String,
      default: () => ''
    }
  },

  data () {
    return {
      optionList: []
      // labelWidth: '0px'
    };
  },

  computed: {
    items () {
      return config.slice(0, this.length);
    }
  },

  render (createElement, context) {
    return <div class="vcom-area-select">
      {this.items.map(({ label }, i) => (i === 0 || this.value.length <= this.length) &&
        <vcom-form-item
          label={this.showLabel ? `${label}：` : ''}
          in-line={true}
        >
          <yj-select
            value={this.value[i]}
            onChange={(val) => this.handleChange(val, i)}
            placeholder={`全部${label}`}
            clearable={true}
            disabled={this.disabled}
            list = { (i === 0 || this.value[i - 1]) && (this.optionList[i] || []).map(opt => { return { id: opt.areaId, name: opt.areaname }; }) }
          >
          </yj-select>
        </vcom-form-item>)}
      <br/>
    </div>;
  },

  methods: {
    async loadAreaList (val, index) {
      if (val) {
        const { data } = await getAreaList({ fid: val, pageNo: 1, pageSize: 1000, flag: 1 });
        if (index !== undefined) {
          this.optionList.splice(index, 4, data.records);
        } else {
          this.optionList.push(data.records || []);
        }
      }
    },

    handleChange (val, changedValueIndex) {
      this.$emit('input', [...this.value.slice(0, changedValueIndex), val]);
      this.$nextTick(() => {
        this.optionList.splice(changedValueIndex + 1, this.length - 1);
        val && this.loadAreaList(val);

        const areas = this.optionList
          .map((areas, i) => areas.find(area => area && area.areaId === this.value[i]))
          .filter(area => area);

        this.$emit(
          'change',
          val,
          changedValueIndex,
          areas[changedValueIndex],
          areas
        );
      });
    }
  },

  watch: {
    value: {
      deep: true,
      handler () {
        if ((this.value || []).some(str => str === '')) {
          this.$emit('input', this.value.filter(str => str));
        }
      }
    },
    defaultAreaId: {
      immediate: true,
      async handler () {
        const ids = getAreaIdList(this.defaultAreaId || '');

        this.optionList = [];
        const areaList = await Promise.all(['0', ...ids].map(fid => getAreaList({ fid, pageNo: 1, pageSize: 1000, flag: 1 })));

        this.optionList = areaList.map(res => {
          return (res.data || {}).records || [];
        });

        this.$emit('input', ids);
      }
    }
  }
};
</script>
