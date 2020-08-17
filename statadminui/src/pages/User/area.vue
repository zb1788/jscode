<script>
export default {
  name: 'area',
  components: {},
  props: {
    areaCode: {
      type: String,
      default: () => ''
    },
    label: {
      type: String,
      default: () => '省'
    }
  },
  data () {
    return {
      optionList: []
    };
  },
  computed: {

  },
  watch: {},
  methods: {
    handleChange (val, changedValueIndex) {

    }
  },
  created () {

  },
  render (createElement, context) {
    return <vcom-form-item
      label={`${this.label}`}
      in-line={true}
    >
      <yj-select
        value={'a'}
        onInput={(val) => this.handleChange(val)}
        placeholder={`全部${this.label}`}
        clearable={true}
        list={[]}
      >
      </yj-select>
    </vcom-form-item>;
  }
};

</script>
<style lang="scss">
.vcom-area-select{
  display: inline-block;
  width: 100%;
  .vcom-form-item{
    margin: 0;
    padding: 0 10px 0 0;
  }
  .vcom-form-item:nth-last-child(2){
    padding: 0;
  }
}
</style>
