import { mapState } from 'vuex';
import { getProvinceList, getCityListByProvinceCode, getAreaListByCity, getCityById, getAreaById } from '@/api/area';

export default {
  computed: {
    ...mapState('user', [
      'provinceCode',
      'cityCode',
      'areaCode'
    ])
  },
  data () {
    return {
      form: {
        province: '',
        city: '',
        area: ''
      },
      formItems: [
        { label: '省',
          field: 'province',
          placeholder: '全部省',
          required: false,
          type: 'select',
          options: []
        },
        { label: '市',
          field: 'city',
          placeholder: '全部市',
          required: false,
          type: 'select',
          options: [],
          onFocus: (query) => {
            if (!this.form.province) {
              return this.$message.error('请先选择省');
            }
          }
        },
        { label: '区',
          field: 'area',
          placeholder: '全部区',
          required: false,
          type: 'select',
          options: [],
          onFocus: (query) => {
            if (!this.form.city) {
              return this.$message.error('请先选择市');
            }
          }
        }
      ]
    };
  },
  methods: {

  },
  async created () {
    let res = await getProvinceList({fid: this.provinceCode});
    var parr = [];
    for (let item of res.data) {
      parr.push({'label': item.province, 'value': item.provinceCode});
    }
    this.formItems[0].options = parr;
    if (this.provinceCode !== '') {
      this.form.province = this.provinceCode;
    }
  },
  watch: {
    'form.province': {
      async handler (val) {
        this.formItems[1].options = [];
        this.formItems[2].options = [];
        this.form.city = '';
        this.form.area = '';
        if (this.form.province !== '') {
          let res;
          if (this.cityCode !== '') {
            res = await getCityById({fid: this.cityCode});
          } else {
            res = await getCityListByProvinceCode({fid: this.form.province});
          }
          let parr = [];
          for (let item of res.data) {
            parr.push({'label': item.city, 'value': item.cityCode});
          }
          this.formItems[1].options = parr;
          if (this.cityCode !== '') {
            this.form.city = this.cityCode;
          }
        }
      },
      deep: true,
      immediate: true
    },
    'form.city': {
      async handler (val) {
        this.formItems[2].options = [];
        if (this.form.city !== '') {
          let res;
          if (this.areaCode !== '') {
            res = await getAreaById({fid: this.areaCode});
          } else {
            res = await getAreaListByCity({fid: this.form.city});
          }
          let parr = [];
          for (let item of res.data) {
            parr.push({'label': item.area, 'value': item.areaCode});
          }
          this.formItems[2].options = parr;
          if (this.areaCode !== '') {
            this.form.area = this.areaCode;
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
};
