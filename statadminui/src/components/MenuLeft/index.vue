<script type="text/jsx">
const defaultFields = {
  id: 'id',
  label: 'label'
};
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Object,
      default: () => defaultFields
    }
  },

  computed: {
    keyFields () {
      return { ...defaultFields, ...this.fields };
    }
  },

  render (h, context) {
    const {
      id: idField,
      label: labelField
    } = this.keyFields;

    return <div class="vcom-menu-left">
      {this.data.map(item => <div
        class={[
          'vcom-menu-left-item',
          {
            'vcom-menu-left-item--active': item[idField] === this.value
          }
        ]}
        key={item[idField]}
        onClick={() => this.$emit('input', item[idField])}
      >
        {item[labelField]}
        <i class="el-icon el-icon-arrow-right arrow-right" />
      </div>)}
    </div>;
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/theme";

.vcom-menu-left{
  width: 100%;
  height: 100%;
  box-shadow: 1px 0 3px 0 #999;

  &-item{
    position: relative;
    font-size: 17px;
    line-height: 32px;
    padding: 8px;
    text-indent: 32px;
    cursor: pointer;
    color: #666;
    border-bottom: 1px solid #f3f3f3;
    .arrow-right{
      display: none;
      position: absolute;
      top: 16px;
      right: 24px;
      @include themeify{
        color: themed('color-primary');
      }
    }

    @at-root &--active{
      @include themeify{
        color: themed('color-primary');
      }

      &::before{
        content: '';
        height: 100%;
        width: 6px;
        position: absolute;
        left: 0;
        top: 0;
        @include themeify{
          background: themed('color-primary');
        }
      }

      .arrow-right{
        display: inline-block;
        @include themeify{
          color: themed('color-primary');
        }
      }
    }
  }
}
</style>
