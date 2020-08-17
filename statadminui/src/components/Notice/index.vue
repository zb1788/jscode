<script type="text/jsx">
let zIndex = 2000;

export default {
  data () {
    return {
      type: undefined,
      title: undefined,
      top: 0
    };
  },

  methods: {
    distroy () {
      this.$destroy(true);
      // this.$el.parentElement.removeChild(this.$el)
      this.$el.remove();
    }
  },

  render (h) {
    return <div
      class="vcom-notice"
      style={`z-index:${++zIndex}; margin-top: 20px;`}
    >
      {this.type !== undefined &&
      <i
        class={[
          'el-icon',
          this.type === true ? 'el-icon-success' : 'el-icon-error'
        ]}
      />
      }
      <div class="vcom-notice-group">
        <h2 v-show="title" class="vcom-notice-title">{this.title}</h2>
        {this.render &&
          <div class="vcom-notice-content">
            {this.render(h, this)}
          </div>
        }
      </div>
      {this.subRender &&
      <div class="vcom-notice-group-sub">
        {this.subRender(h, this)}
      </div>
      }
    </div>;
  }
};
</script>

<style lang="scss" scoped>
.vcom-notice{
  display: flex;
  padding: 8px 12px;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px solid #EBEEF5;
  right: 0;
  background-color: #FFFFFF;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
  overflow: hidden;

  .el-icon{
    height: 24px;
    width: 24px;
    font-size: 32px;

    @at-root &-success {
      color: #67C23A;
    }

    @at-root &-error {
      color: #F56C6C;
    }
  }

  @at-root &-title{
    font-weight: bold;
    font-size: 16px;
    color: #666;
    margin: 0;
  }

  @at-root &-content{
    font-size: 14px;
    &>*{
      color: #999;
    }
  }

  @at-root &-group{
    margin-left: 20px;
    margin-right: 20px;

    &>*{
      padding: 2px 0;
    }
  }

  @at-root &-group-sub{
    padding: 12px;
    margin-right: 0;
  }
}
</style>
