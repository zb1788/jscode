<!--  -->
<template>
<div id="welcome" class='bg'>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { USER_ACTION_TYPES } from '@/store';
export default {
  components: {},
  data () {
    return {

    };
  },
  computed: {
  },
  watch: {},
  methods: {
    ...mapActions([
      USER_ACTION_TYPES.MEUN
    ])
  },
  async mounted () {
    let height = window.getComputedStyle(document.getElementsByClassName('el-main')[0]).height;
    document.getElementById('welcome').style.height = height;
    const data = await this[USER_ACTION_TYPES.MEUN]({ systemId: 'NSDC' });
    // let res = await getMenuList();
    console.log(data);
  }
};
</script>
<style scoped>
    .bg{
        background: #F3F6FC url(../../assets/images/welcome.gif) fixed center no-repeat;
    }
</style>
