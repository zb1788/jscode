<script type="text/jsx">
export default {
  data () {
    return {
      width: '300'
    };
  },

  render (h) {
    return <div class="dialog-wrap">
      <div class="dialog" style={`width: ${this.width}px`}>
        {this.renderHeader &&
        <div class="dialog-header">
          {this.renderHeader(h, this)}
          <vcom-button
            class="dialog-close"
            v-show={this.closeAble !== false}
            ghost={true}
            onClick={this.distroy}
          >
            <i class="el-icon el-icon-close"/>
          </vcom-button>
        </div>
        }
        <div class="dialog-body">
          {this.render &&
          this.render(h, this)}
        </div>
        {this.renderFooter &&
        <div class="dialog-footer">
          {this.renderFooter(h, this)}
        </div>
        }
      </div>
    </div>;
  },

  methods: {
    distroy () {
      this.$destroy(true);
      this.$el.parentElement.removeChild(this.$el);
    }
  },
  beforeDestroy () {
    this.finally && this.finally(this);
  }
};
</script>

<style lang="scss" scoped>
.dialog{
  position: relative;
  margin: 0 auto 50px;
  background: #fff;
  box-shadow:0 0 10px rgba(0,0,0,0.3);
  box-sizing: border-box;
  margin-top: 15vh;
  width: 30%;
  border-radius: 3px;

  @at-root &-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    background: rgba(0, 0, 0, .2);
    font-size: 14px;
    z-index: 2000;
  }

  /*&-close{*/
  /*  position: absolute;*/
  /*  right: 0;*/
  /*  font-size: 32px;*/
  /*  top: 12px;*/
  /*}*/
  &-header{
    padding: 0px 0 0px 21px;
    background: #fff;
    border-bottom: 1px solid #DBDBDB;
    position: relative;
    height: 52px;
    line-height: 52px;
    span{
      font-size:18px;
      font-weight:400;
      color:rgba(0,0,0,0.8);
    }
    .dialog-close{
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }

  &-body{
    padding: 14px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }

  &-footer{
    text-align: center;
    padding: 12px;
  }
}
</style>
