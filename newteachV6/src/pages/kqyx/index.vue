<template>
  <div class="flexdy">
    <div>
		<!-- <BannerNewteach/> -->
    <TabsNewteach
    ref="tabRef"
    :tabPosition="tabPosition"
    :data="data"
    @tabClick="tabClick"
    >
        <template v-slot:default="slotProps">
          <YxNewteach v-if="slotProps.tabIndex == activeIndex"   :type="type" :index="slotProps.tabIndex"  :nowIndex="activeIndex" :reload="reload"/>        
        </template>       
        
        
    </TabsNewteach>
    </div>
          
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import YxNewteach from '@/components/YxNewteach'
import { getTabList} from '@/api/kqyx'
import commonUtils from '@/utils/common'


export default {
    name:'kqyx',
    components:{
        TabsNewteach,
        BannerNewteach,
        YxNewteach
    },
    data(){
        return {
            tabPosition: 'bottom',
            activeIndex: 0,
            data: [],//标签数组
            type:'',
            reload:false,//是否重新加载

        }
    },
    computed: {
        ...mapGetters([
            'dialogFilter',
            'ksId',
        ]),
    },
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){
              this.activeIndex=0;
              this.getTabList()
          }
        },    
    },
    mounted(){
        this.getTabList()  
    },
    methods: {
        //切换标签
        async tabClick(tab,event){
            console.log(tab,event)
            this.activeIndex = tab.index
            this.type = this.data[this.activeIndex].type
            this.reload = !this.reload
        },
        //获取当前标签资源
        async getTabList(){
            if(this.ksId == ''){
              return false
            }
            let result = await getTabList()
            this.data = result.tabArr
            this.type = this.data[this.activeIndex].type
            this.$refs.tabRef.setActiveName(result.activeName)
            this.reload = !this.reload
        },
    }    
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabs{background:#fff;}
.flexdy{display: flex; flex-direction:column; flex:1;height: 100%;}
.flexdy>.nry{flex: 1;}
/* .yxlist {background:#fff; height: 100%; padding: 1vh;}
.yxlist ul {margin:0 1vh;    -webkit-padding-start:0}
.yxlist li {display: flex; width: 100%; border-bottom: solid 1px #efefef; }
.yxlist li>*{align-self: center; text-align: left;}
.yxlist li p {flex: 1; font-size:1rem; padding: 0 1vw; color: #666; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;} */
.el-tabs--border-card{height: 100%; display: flex; flex-direction: column;}
.textR {text-align: right;}
.kqyxnx {flex: 1; }
.lihtml{
  height:auto;
}
</style>
