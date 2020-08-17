<!--
 * @Author: your name
 * @Date: 2020-04-28 19:05:39
 * @LastEditTime: 2020-05-06 17:10:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\components\Dropdown\index.vue
 -->
<script type="text/jsx">
export default {
  name: 'vcom-dropdown',

  props: {
    text: {
      type: String,
      default: '更多'
    },
    list: {
      type: Array,
      default: () => []
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    placement: {
      type: String,
      default: 'placement'
    }
  },

  render (h) {
    return <yj-popover
      placement="bottom"
      popper-class='tab-index'
      trigger={this.trigger}
    >
      <vcom-button
        slot="reference"
        type="primary"
        ghost={true}
      >{this.text}
      </vcom-button>
      <div>
        {
          (this.list || []).map(({ label, onClick, disabled, render }) => render
            ? render(h)
            : <div class="vcom-dropdown-item">
              <vcom-button
                slot="reference"
                type='primary'
                ghost={true}
                disabled={disabled}
                onClick={onClick}
              >{label}</vcom-button>
            </div>
          )
        }
      </div>
    </yj-popover>;
  }
};
</script>

<style lang="scss">
.vcom-dropdown-item{
  cursor: pointer;
  padding: 4px 6px;
  text-align: left;

  .vcom-button{
    width: 100%;
    text-align: left;
  }
}
</style>
