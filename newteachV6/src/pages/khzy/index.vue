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
              <ZyNewteach ref="zyRef" :type="type" :index="slotProps.tabIndex"  :nowIndex="activeIndex"   :reload="reload"/>          
            </template>                  
        </TabsNewteach>
      </div>   
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import TabsNewteach from '@/components/TabsNewteachs'
import ZyNewteach from '@/components/ZyNewteach'
import { getTabsData} from '@/api/khzy'
import commonUtils from '@/utils/common'

export default {
    components:{
        TabsNewteach,
        BannerNewteach,
        ZyNewteach
    },
    data(){
        return{
            tabPosition: 'bottom',
            activeIndex: 0,
            type:'',
            reload:false,
            data: [],//标签数组
        }
    },
    computed: {
        ...mapGetters([
            'ksId'
        ]),       
    },    
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){
              this.activeIndex = 0
              this.getTabsDataList()
          }
        },        
    },
    mounted(){
        this.getTabsDataList();

        //智能组卷回调，重新刷新训练列表
        window.addEventListener('doZnzj', this.reloadData)      
    },    
    destroyed(){
      window.removeEventListener('doZnzj', this.reloadData)
    },    
    methods: {
        //重刷列表
        reloadData(){
            this.reload = !this.reload
        },
        //切换标签
        async tabClick(tab,event){
            console.log(tab,event)          
            this.activeIndex = tab.index
            this.type = this.data[this.activeIndex].type
            this.reload = !this.reload                                    
        },
        //获取标签
        async getTabsDataList(){
            //获取标签数据
            if(this.ksId == ''){
              return false
            }            
            try{
                let obj = await getTabsData()
                this.data = obj.arr
                this.$refs.tabRef.setActiveName(obj.activeName)
                this.type = this.data[this.activeIndex].type
                this.reload = !this.reload
            }catch(e){

            }
        }
    }
}
</script>

<style>

</style>
