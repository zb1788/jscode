<script type="text/jsx">
import VcomForm from '../Form';
import { typeOf } from '../../utils/object';

export default {
  name: 'vcom-search-panel',
  components: {
    VcomForm
  },
  props: {
    isBlank: {
      type: Boolean,
      default: () => true
    },
    value: {
      type: Object,
      default: () => { return {}; }
    },
    showDetail: {
      type: Boolean,
      default: () => false
    },
    items: {
      type: Array,
      default: () => []
    },
    detailItems: {
      type: Array,
      default: () => []
    },
    resetFunc: {
      type: Function,
      default: obj => (obj || {})
    },
    resetDetailFunc: {
      type: Function,
      default: obj => (obj || {})
    },
    showReset: {
      type: Boolean,
      default: true
    },
    expandText: {
      type: String,
      default: '高级搜索'
    },
    collapseText: {
      type: String,
      default: '高级搜索收起'
    }
  },

  computed: {
    itemsValue () {
      return Object.keys(this.value).reduce((result, field) => {
        if (this.items.some((item) => item.field === field)) {
          let val = this.value[field];
          if (typeOf(val) === 'String') {
            val = val.trimLeft().trimRight();
          }
          result[field] = val;
        }

        return result;
      }, {});
    },

    detailItemsValue () {
      return Object.keys(this.value).reduce((result, field) => {
        if (this.detailItems.some(item => item && item.field === field)) {
          result[field] = this.value[field];
        }

        return result;
      }, {});
    }
  },

  render (h, context) {
    return <vcom-panel
      show-detail={this.showDetail}
      class="search-panel"
    >
      {this.detailItems && !!this.detailItems.length &&
        <template slot="buttons" >
          <vcom-button
            type="primary"
            ghost={true}
            onClick={() => this.$emit('update:showDetail', !this.showDetail)}
          >{this.showDetail ? this.collapseText : this.expandText}</vcom-button>
        </template>
      }
      <vcom-form
        value={this.value}
        items={this.items}
        in-line={true}
        onInput={(val) => {
          this.$emit('input', val);
        }}
      >
        <vcom-form-item in-line={true}>
          <vcom-button
            type="primary"
            onClick={() => this.$emit('search', this.itemsValue)}
          ><i class="iconfont iconsearch" />查询</vcom-button>
          {this.showReset &&
            <vcom-button
              type="primary"
              plain={true}
              onClick={this.resetValue}
            ><i className="el-icon el-icon-refresh-right"/>重置</vcom-button>
          }
          {this.$scopedSlots.append &&
          this.$scopedSlots.append()}
        </vcom-form-item>
      </vcom-form>
      <template slot="detail">
        <vcom-form
          value={this.value}
          items={this.detailItems}
          in-line={true}
          onInput={(val) => {
            this.$emit('input', val);
          }}
        >
        </vcom-form>
      </template>
      {this.showDetail &&
      <template slot="footer">
        <vcom-button
          type="primary"
          onClick={() => this.$emit('searchDetail', this.detailItemsValue)}
        >查询</vcom-button>
        <vcom-button
          type="primary"
          plain={true}
          onClick={this.resetDetailValue}
        >重置</vcom-button>
        {this.$scopedSlots.detailAppend &&
          this.$scopedSlots.detailAppend()}
      </template>
      }
    </vcom-panel>;
  },

  methods: {
    // 查询 重置操作
    resetValue () {
      const resetedValue = this.resetObject(
        { ...this.value },
        this.items
          .filter(item => item)
          .map(item => item.field)
      );
      this.$emit('input', this.resetFunc(resetedValue));
      this.$nextTick(() => {
        this.$emit('search', this.itemsValue);
      });
    },

    // 高级搜索 重置操作
    resetDetailValue () {
      const resetedValue = this.resetObject(
        { ...this.value },
        this.detailItems
          .filter(item => item)
          .map(item => item.field)
      );
      this.$emit('input', this.resetDetailFunc(resetedValue));
      this.$nextTick(() => {
        this.$emit('searchDetail', this.detailItemsValue);
      });
    },

    resetObject (obj = {}, fields = []) {
      return (fields || []).reduce((result, field) => {
        if (field) {
          result[field] = {
            'Object': {},
            'Array': [],
            'String': ''
          }[typeOf(field)];
        }

        return result;
      }, obj);
    }
  }
};
</script>

<style lang="scss" >
@import "../../assets/style/theme";

.search-panel.vcom-panel{
  @include themeify{
    background: scale_color(themed('color-primary'), $lightness: 80%);
  }
  .vcom-panel-detail{
    border-top: 1px solid #e4e4e4;
    padding: 4px 12px;
    background:#f4f4f4;
  }
  .vcom-panel-container{
    padding: 8px 10px;
  }
}
</style>
