<template>
    <div style="height:100%">
    <!-- <BannerNewteach/> -->
    <TabsNewteach
    ref="tabRef"
    :tabPosition="tabPosition"
    :data="data"
    @tabClick="tabClick"
    >
        <template v-slot>
        <div v-if="resList.length == 0"><img src="@/assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></div>
        <div class="flexzb" v-if="resList.length > 0">
				<div class="flexzb1">
                <yj-newteach-table
                    :data="resListByPage"
                    @row-click="rowClick"
                    style="width: 100%">
                    <yj-newteach-table-column label="学科">
                        <template slot-scope="scope">
                            <span>{{ scope.row.kmstr }}</span>
                        </template>
                    </yj-newteach-table-column>
                    <yj-newteach-table-column label="课程名称"  min-width="200px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </yj-newteach-table-column>  
                    <yj-newteach-table-column label="开始时间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.start.substring(0,16) }}</span>
                        </template>
                    </yj-newteach-table-column>                          
                    <yj-newteach-table-column label="时长">
                        <template slot-scope="scope">
                            <span>{{ scope.row.duration }}分钟</span>
                        </template>
                    </yj-newteach-table-column>       
                    <yj-newteach-table-column label="讲师">
                        <template slot-scope="scope">
                            <span>{{ scope.row.teacher }}</span>
                        </template>
                    </yj-newteach-table-column>
                    <yj-newteach-table-column label="操作">
                        <template slot-scope="scope">
                            <span :class="scope.row.playflag=='正在直播'?'ing cur-point':''"><i v-if="scope.row.playflag=='正在直播'" class="el-icon-video-play"></i>{{ scope.row.playflag }}</span>
                        </template>
                    </yj-newteach-table-column>                                                     
                </yj-newteach-table>  
				 </div>  
         </div>        
        <div class="flexh">         
              <div>
                <PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>
              </div>   
        </div>
            <!-- <div class="yxlist">
              <ul>
                <li v-for="(item,index) in resList" :key="index" @click="rowClick(item)">
                  <span><img :src="item.icon" /></span>
                  <p>{{ item.name }} 
                    <img v-if="item.useIcon !='' && typeof item.useIcon !='undefined'" :src="item.useIcon" /></p>
                </li>
              </ul>
            </div>      
            <div class="flexh">         
              <div>
                <PageNewteach :pageCurrent="pageCurrent" :pageTotal="pageTotal" @pageClick="pageClick"/>
              </div>   
            </div>                                        -->
        </template>
    </TabsNewteach>
    </div>    
</template>

<script>
import { mapGetters } from 'vuex'
import TabsNewteach from '@/components/TabsNewteachs'
import BannerNewteach from '@/components/BannerNewteach'
import PageNewteach from '@/components/PageNewteach'
import { yjNewteachTable,yjNewteachTableColumn} from 'newteach-ui'
import { getPtzbTab,getResData } from '@/api/zbkc'
import { click } from '@/api/click'
export default {
    components:{
        TabsNewteach,BannerNewteach,PageNewteach,yjNewteachTable,yjNewteachTableColumn
    },
    data(){
        return{
            tabPosition: 'bottom',
            activeIndex: 0,
            data: [       
            ],//标签数组
            resList: [],//任务列表数组    
            page:1,
            pageCurrent:1, //当前页码
            pageSize:12, //每页个数                  
        }
    },
    computed: {
        ...mapGetters([
            'ksId'
        ]),
        pageStart(){
          return (this.pageCurrent-1)*this.pageSize
        },
        pageTotal(){
          return Math.ceil(this.resList.length/this.pageSize)
        },
        resListByPage(){
            return this.resList.filter((val,i) => i>=this.pageStart&&i<this.pageStart+this.pageSize)
        }     
    },    
    watch: {
        ksId(newVal,oldVal){
          if(newVal != ''){          
              this.getTabsDataList()
          }
        }
    },
    mounted(){
        let dataTmp = getPtzbTab()        
        this.data = dataTmp.filter(item => item.name == '平台直播')//过滤掉电视转播和本校直播

        this.$refs.tabRef.setActiveName(this.data[this.activeIndex].name)
        this.getTabsDataList()
    },    
    methods: {
        //切换标签
        async tabClick(tab,event){
            // console.log(tab,event)
            this.pageCurrent = 1
            this.activeIndex = tab.index
            //LiveRange 平台直播1 校本直播0
            let resData = await getResData(this.data[this.activeIndex].LiveRange,1,999)            
            this.resList = resData
        },
        //获取当前标签下的资源
        async getTabsDataList(){
            let resData = await getResData(this.data[this.activeIndex].LiveRange,1,999)           
            this.resList = resData
        },     
        //点击整行事件(打开任务详情)
        rowClick(row, column){
          console.log(row)
          console.log('row')        
          if(row.playflag == '正在直播'){
            let playJs = {'playName':'playLive','remark':'直播播放',params:{'playName':'playLive',playLive:true,'rcode':row.rcode,'resType':'live'}}
            click(playJs)
          } 
        },   
        //上一页/下一页
        pageClick(val){
          if(val == 'pre'){
            this.pageCurrent--
          }else{
            this.pageCurrent++
          }
        },              
    }
}
</script>

<style>
.cur-point{
cursor: pointer;
}
.ing{color:#f60}
.flexzb {display: flex; flex: 1; flex-direction: column; background: #fff;}
.flexzb1 {flex: 1;padding: 1vh;}
.flexzb	.el-table{font-size: 0.9rem; table-layout: fixed}
.flexzb .el-table .cell {line-height: 5vh; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
</style>
