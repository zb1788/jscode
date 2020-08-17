<script type="text/babel">
export default {
  name: 'vcom-form-item',

  props: {
    label: {
      type: String,
      default: () => ''
    },
    labelWidth: {
      type: String,
      default: () => ''
    },
    inLine: {
      type: Boolean,
      default: () => false
    },
    required: {
      type: Boolean,
      default: () => undefined
    },
    error: {
      type: Boolean,
      default: undefined
    },
    errorText: String
  },

  render (h) {
    return <div
      class={[
        'vcom-form-item',
        {
          'vcom-form-item--inline': this.inLine,
          'vcom-form-item--required': this.required,
          'vcom-form-item--error': this.error
        }
      ]}
    >
      <label
        class={[
          'vcom-form-item-label'
        ]}
        v-show={this.label || this.$scopedSlots.label}
        style={this.labelWidth ? `width: ${this.labelWidth}` : ''}
      >
        {!this.$scopedSlots.label && this.label ? this.label : '' }
        {this.$scopedSlots.label &&
          this.$scopedSlots.label()
        }
      </label>
      <div class="vcom-form-item-container">
        {this.$scopedSlots.default &&
          this.$scopedSlots.default()
        }
        <div v-show={this.error} class="vcom-form-item-error-text">
          { this.errorText }
        </div>
      </div>
    </div>;
  }

  // watch: {
  //   error (val) {

  //   },
  //   errorText (val) {

  //   }
  // }
};
</script>

<style scoped lang="scss">
$line-height: 38px;

.vcom-form-item{
  display: flex;
  padding: 5px;

  @at-root &--inline{
    display: inline-flex;
    vertical-align: bottom;
  }

  @at-root &--required{
    .vcom-form-item-label::before{
      content: '*';
      display: inline-block;
      color: #F57B7A;
      font-size: 16px;
      line-height: $line-height;
      box-sizing: border-box;
      padding-right: 2px;
    }
  }

  &-label{
    display: inline-block;
    padding-left: 12px;
    padding-right: 4px;
    text-align: right;
    color: #666;
    line-height: $line-height;
  }

  &-container{
    display: inline-block;
    line-height: $line-height;
  }

  &-error-text{
    color: red;
    text-indent: 6px;
  }
}
</style>
