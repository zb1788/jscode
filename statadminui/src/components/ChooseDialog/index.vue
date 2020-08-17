<script type="text/jsx">
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    buttonWidht: {
      type: String,
      default: ''
    },
    choosedList: {
      type: Array,
      default: () => { return []; }
    },
    checkboxlist: {
      type: Array,
      default: () => { return []; }
    },
    checkLength: {
      type: Number,
      default: 0
    },
    width: {
      type: String
    },
    chooseType: {
      type: String,
      default: 'checkbox'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    allSelectable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  name: 'chooseDialog',
  data () {
    return {
      dialogVisible: false,
      checkValue: [],
      oldCheckValue: [],
      searchStr: '',
      inputVal: '',
      checkAll: false,
      isIndeterminate: false
    };
  },
  render (createElement, context) {
    return <div style={{ width: this.width }} class='choose-dialog'>
      <yj-col span= {16}>
        <yj-input v-model = {this.inputVal} type="textarea" autosize disabled></yj-input>
      </yj-col>
      <yj-col span= {8} >
        <vcom-button class='choose-dialog-button' type="primary" plain style=" margin-left:20px;" onClick={ () => { this.dialogVisible = true; this.$emit('beforeOpen'); }}>{this.label}</vcom-button>
      </yj-col>
      <yj-dialog
        visible = {this.dialogVisible}
        {...{ on: { 'update:visible': (value) => { this.dialogVisible = value; }, 'close': this.cancelChoose } }}
        width="800px"
      >
        <template slot='default'>
          { this.searchable &&
            <div>
              <yj-row>
                <yj-col span={16}>
                  <yj-input
                    placeholder="输入内容后自动匹配"
                    prefix-icon="yj-icon-search"
                    v-model={this.searchStr}>
                  </yj-input>
                </yj-col>
              </yj-row>
            </div>
          }
          {
            this.chooseType === 'checkbox' && this.allSelectable &&
            <div>
              <yj-checkbox v-model={this.checkAll} indeterminate={this.isIndeterminate} onChange={this.handleCheckAllChange}>全选</yj-checkbox>
            </div>
          }
          <div style="display:inline-flex;justify-content:space-between;min-height:80px;max-height: 500px;overflow: auto; overflow-x:hidden" v-loading={this.loading} >
            {
              this.loading && <span>正在加载</span>
            }
            { !this.loading && this.chooseType === 'checkbox' &&
              <yj-checkbox-group v-model={this.checkValue}>
                {
                  !this.searchable && this.checkboxlist.map(item => {
                    return <yj-checkbox key={item.value} label={item.value}>{item.label}</yj-checkbox>;
                  })
                }
                {
                  this.searchable && this.filterCheckbox.map(item => {
                    return <yj-checkbox key={item.value} label={item.value}>{item.label}</yj-checkbox>;
                  })
                }
              </yj-checkbox-group>
            }
            {
              !this.loading && this.chooseType === 'radio' &&
              <yj-radio-group v-model={this.checkValue}>
                {
                  !this.searchable && this.checkboxlist.map(item => {
                    return <yj-radio key={item.value} label={item.value}>{item.label}</yj-radio>;
                  })
                }
                {
                  this.searchable && this.filterCheckbox.map(item => {
                    return <yj-radio key={item.value} label={item.value}>{item.label}</yj-radio>;
                  })
                }
              </yj-radio-group>
            }
          </div>
        </template>
        <template slot='title'>
          <h3 class="chooseDialog-title">
            {
              this.$scopedSlots.default && this.$scopedSlots.default()
            }
          </h3>
        </template>
        <template slot='footer'>
          <span>
            <yj-button onClick={this.cancelChoose}>取 消</yj-button>
            <yj-button type="primary" onClick={this.confirmChoose}>确 定</yj-button>
          </span>
        </template>
      </yj-dialog>
    </div>;
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkValue = val ? (this.searchable ? this.filterCheckbox.map(item => {
        return item.value;
      }) : this.checkboxlist.map(item => {
        return item.value;
      })) : [];
    },
    confirmChoose () {
      if (this.chooseType === 'checkbox' && this.checkLength && (this.checkValue.length > this.checkLength)) {
        return this.$message.error(`不能超过${this.checkLength}个`);
      }
      let chooseList = [];
      this.dialogVisible = false;
      if (this.chooseType === 'checkbox') {
        this.checkboxlist.forEach((chooseItem) => {
          if (this.checkValue.includes(chooseItem.value)) {
            chooseList.push(chooseItem);
          }
        });
      }
      if (this.chooseType === 'radio') {
        let chooseDetail = this.checkboxlist.find((chooseItem) => {
          return chooseItem.value === this.checkValue;
        });
        chooseDetail && chooseList.push(chooseDetail);
      }
      this.oldCheckValue = this.checkValue;
      this.$emit('input', chooseList);
    },
    cancelChoose () {
      this.checkValue = this.oldCheckValue;
      this.dialogVisible = false;
    }
  },
  watch: {
    choosedList: {
      handler (val) {
        this.chooseType === 'checkbox' && val.length > 0 && val.forEach((item) => {
          if (!this.checkValue.includes(item.value)) {
            this.checkValue.push(item.value);
          }
        });
        this.chooseType === 'radio' && val.length > 0 && (this.checkValue = val[0].value);
        this.chooseType === 'radio' && val.length === 0 && (this.checkValue = '');
        // typeOf(val) === "String" && this.checkValue.push(val);
        // val.length === 0 && (this.checkValue = [])
        this.oldCheckValue = this.checkValue;
      },
      immediate: true,
      deep: true
    },
    searchStr (val) {
      this.checkAll = val.length > 0 && this.filterCheckbox.every((item) => {
        return this.checkValue.includes(item.value);
      });
      this.isIndeterminate = !this.checkAll && (this.filterCheckbox.some((item) => {
        return this.checkValue.includes(item.value);
      }));
    },
    changeVal: {
      handler (val) {
        if (this.chooseType === 'checkbox') {
          let filterArr = this.searchable ? this.filterCheckbox : this.checkboxlist;
          this.checkAll = val.length === filterArr.length;
          this.isIndeterminate = val.length > 0 && val.length < filterArr.length;
          this.inputVal = val.join('，');
        }
        if (this.chooseType === 'radio') {
          this.inputVal = val;
        }
      }
    }
  },
  computed: {
    filterCheckbox () {
      return this.searchable ? this.checkboxlist.filter(item => {
        return item.label.indexOf(this.searchStr) > -1;
      }) : [];
    },
    changeVal () {
      if (this.chooseType === 'checkbox') {
        let value = [];
        this.checkValue.forEach((item) => {
          this.checkboxlist.forEach((listItem) => {
            if (listItem.value === item) {
              value.push(listItem.label);
            }
          });
        });
        return value;
      }
      if (this.chooseType === 'radio') {
        let radioItem = this.checkboxlist.find(item => {
          return item.value === this.checkValue;
        });
        if (radioItem) {
          return radioItem.label;
        }
        return '';
      }
      return '';
    }
  }
};
</script>
<style lang="scss">
.choose-dialog {
  .yj-radio {
    line-height: 38px;
  }
  .yj-dialog__body{
    padding-top: 0px;
  }
  .yj-scrollbar__wrap{overflow-x: hidden;}
}
</style>
