<!--
 * @Author: your name
 * @Date: 2019-11-19 20:33:06
 * @LastEditTime: 2020-05-06 16:40:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \user-center\src\components\ChargeMode\index.vue
 -->
<template>
  <div class="chargeMode">
      <ul>
        <li class="chargeMode-item" v-for='item in formData' :key='item.id'>
          <yj-col :span='8'>
            <yj-checkbox v-model="item.checked" :label="item.label" @change="change(item)"></yj-checkbox>
          </yj-col>
          <yj-col :span='16'>
            <yj-input v-if='item.showPrice' v-model="item.price" placeholder="请输入价格" @change="change(item)"></yj-input>
          </yj-col>
        </li>
      </ul>
  </div>
</template>
<script>
export default {
  name: 'vcom-charge-mode',
  props: {
    data: {
      type: Array,
      default: () => { return []; }
    },
    ListData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      formData: [],
      priceObj: {}
    };
  },
  methods: {
    change (item) {
      if (item.checked && item.priceType !== 'free') {
        for (let i = this.data.length - 1; i >= 0; i--) {
          if (this.data[i].priceType === 'free') {
            this.data.splice(i, 1);
          }
        }
      }
      if (item.checked) {
        if (item.field === 'free') {
          this.data.splice(0, this.data.length);
          this.data.push({
            priceType: 'free',
            price: 0
          });
          return;
        }
        let haveFlag = false;
        for (let i = this.data.length - 1; i >= 0; i--) {
          if (this.data[i].priceType === item.field) {
            haveFlag = true;
            this.data[i].price = item.price;
            break;
          }
        }
        if (!haveFlag) {
          this.data.push({
            priceType: item.field,
            price: item.price || ''
          });
        }
      } else {
        for (let j = this.data.length - 1; j >= 0; j--) {
          if (this.data[j].priceType === item.field) {
            this.data.splice(j, 1);
            break;
          }
        }
      }
      this.$emit('change', this.data);
    }
  },
  watch: {
    data: {
      handler (val) {
        if (this.data.length > 0) {
          this.data.forEach((item, i) => {
            this.ListData.forEach((v) => {
              if (v.field === item.priceType) {
                v.checked = true;
                v.showPrice && (v.price = item.price);
              }
            });
          });
        }
        this.formData = this.ListData;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
  .chargeMode{
    @at-root #{&}-item{
      margin: 8px 0;
      overflow: hidden;
      &:first-child{
        margin-top: 0
      }
      &:last-child{
        margin-bottom: 0
      }
    }
  }
</style>
