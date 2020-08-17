<script type="text/jsx">
import { LocalArray } from '../../common/js/local';

export default {
  name: 'vcom-button-column-visible',
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    local () {
      return new LocalArray({
        getKey: () => {
          return this.$route.path;
        }
      });
    },
    operationColumns () {
      return this.columns
        .filter(col => !col.disabled);
    },
    allChecked: {
      get () {
        return this.operationColumns.every(col => col.__show !== false);
      },
      set (allChecked) {
        this.operationColumns
          .forEach(col => {
            col.__show = allChecked ? true : undefined;
            col.label && !col.disabled && this.handleColVisibleChange(col);
          });
      }
    },
    indeterminate () {
      return this.operationColumns
        .some(col => col.__show !== false);
    }
  },

  render (createElement, context) {
    return <yj-popover
      placement="bottom-end"
      trigger="hover"
    >
      <vcom-button slot="reference" plain={true} >
        显示设置<i class="el-icon-caret-bottom"></i>
      </vcom-button>
      <div>
        <p
          style="padding: 6px"
          onClick={(e) => {
            this.allChecked = !this.allChecked;
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <yj-checkbox
            value={this.allChecked}
            indeterminate={!this.allChecked && this.indeterminate}
            onChange={(val) => {
              this.allChecked = !val;
            }}
          >全选</yj-checkbox>
        </p>
        {this.columns.map(col => col.label &&
          <p
            style="padding: 6px"
            onClick={(e) => {
              this.handleColVisibleChange(col);
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <yj-checkbox
              value={col.__show !== false}
              disabled={col.disabled}
              onChange={() => {
                this.handleColVisibleChange(col);
              }}
            >{col.label}</yj-checkbox>
          </p>)}
      </div>
    </yj-popover>;
  },

  methods: {
    handleColVisibleChange (col) {
      if (col.disabled) {
        return;
      }

      if (col.__show === undefined) {
        col.__show = false;
      } else {
        delete col.__show;
      }

      this.$emit('update:columns', new Array(...this.columns));

      this.local.set(
        this.columns
          .filter(item => item.prop && item.hasOwnProperty('__show'))
          .map(({ prop, __show }) => ({
            prop,
            __show
          }))
      );
    }
  },

  watch: {
    '$route': {
      immediate: true,
      handler () {
        if (this.$route) {
          const localColumns = this.local.get();

          if (localColumns && localColumns.length) {
            this.$emit(
              'update:columns',
              (this.columns || []).map(col => {
                const targetCol = localColumns.find(({ prop }) => prop === col.prop) || {};
                return { ...col, ...targetCol };
              })
            );
          }
        }
      }
    }
  }
};
</script>
<style type="text/css">
  .vcom-button--default.is-plain.el-popover__reference{ border-radius:50px; padding:0 20px 0 30px; border:none !important; background-color: #46CE40 !important; color:#fff !important;}
  .vcom-button--default.is-plain.el-popover__reference:hover{ border:none; }
  .vcom-button--default.is-plain.el-popover__reference i{ font-size: 18px; width:25px; }
</style>
