<template>
<div>
    <div>
        <el-popover v-popoverWidth="{width:20}" v-model="visible" placement="top" width="250" trigger="click" class="pad0">
            <div class="pad10">
                <ul class="main-list">
                    <template v-for="(item,index) in baseMenu">
                        <li 
                        v-if="item.pvname !=''"
                        :key="index" 
                        @click="handleClick(item)"
                        :class="index==mainMenuIndex?'success-row':''" 
                        :__VCOM_ANALYTICS="item.pvname" __VCOM_ANALYTICS_CLICK
                        style="cursor:pointer"
                        >
                            <img :src="pageNameRealUrls[item.icon]" style="height: 5vh;" />
                            {{ item.name }}
                        </li>
                        <li 
                        v-else
                        :key="index" 
                        @click="handleClick(item)"
                        :class="index==mainMenuIndex?'success-row':''" 
                        style="cursor:pointer"
                        >
                            <img :src="pageNameRealUrls[item.icon]" style="height: 5vh;" />
                            {{ item.name }}
                        </li>                        
                    </template>
                </ul>
            <!-- <yj-newteach-table :data="baseMenu" :row-class-name="baseMenuClassName" :show-header="false" style="width: 100%">
            <yj-newteach-table-column style="width: 20%">
                    <template slot-scope="scope">
                        <img :src="pageNameRealUrls[scope.row.icon]" style="height: 5vh;" />
                    </template>               
            </yj-newteach-table-column>
                <yj-newteach-table-column style="width: 80%">
                    <template slot-scope="scope">
                        <p @click="handleClick(scope.row)">{{ scope.row.name }}</p>
                    </template>
                </yj-newteach-table-column>
            </yj-newteach-table>    -->
            </div>
            <el-popover v-popoverWidth="{width:20}" v-model="visibleOther" placement="right-end" width="250" trigger="click" class="pad0">
				<div class="borderL">
					<ul class="more-list">
                        <template v-for="(item,index) in otherMenu" >
                            <li 
                            v-if="item.pvname != ''"
                            :class="index==otherMenuIndex?'success-row':''" 
                            :key="index" 
                            :__VCOM_ANALYTICS="item.pvname" __VCOM_ANALYTICS_CLICK
                            @click="handleClick(item)"
                            style="cursor:pointer"
                            >
                            {{item.name}}
                            </li>
                            <li 
                            v-else
                            :class="index==otherMenuIndex?'success-row':''" 
                            :key="index"                             
                            @click="handleClick(item)"
                            style="cursor:pointer"
                            >
                            {{item.name}}
                            </li>                        
                        </template>
					</ul>
				</div>
				
                <div class="morebtn" slot="reference" style="cursor:pointer">更多应用</div>
            </el-popover>
            <el-button type="text" slot="reference" :class="isCur?'cur':''"><i class="iconY yy"></i>应用</el-button>
        </el-popover>
    </div>       
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { yjNewteachTable,yjNewteachTableColumn} from 'newteach-ui'
import { getGrantAndMenus } from '@/api/init'
import { getSsoEncryptInfoApi } from '@/api/interface'
import commonUtils from '@/utils/common'
export default {
    name: 'modulelist',
    components:{
        yjNewteachTable,yjNewteachTableColumn
    },
    computed: {
        ...mapGetters([
            'teacherNumber',
            'curModule',
            'mainMenu',
            'domainConfig',
            'transferProtocol',
            'userSelectClassId',
            'baseData',
            'loginStyle',
            'ut',
            'dialogFilter'
        ]),
        baseMenu(){
            return this.menu.filter((item,index) => index < 6)
        },
        otherMenu(){
            //新版客户端不展示答题绑定栏目，老版客户端显示（兼容老版客户端）
            let flag = true;
            //判断新老客户端
            try{
                let versionInfo =VcomTeach.getVcomTeachVersion();
                let versionArr=versionInfo.split(";");
                if(versionArr!=null && versionArr.length>2){
                    versionInfo=versionArr[0];
                    let tmpArr = versionInfo.split('.');
                    let first = tmpArr[0]*1;
                    let second = tmpArr[1]*1;
                    let third = tmpArr[2]*1;
                    if(second <= 2){
                        //老版客户端
                        flag = false;
                    }
                }
            }catch(e){

            }
            if(flag){
                //新版授课，不展示答题器绑定
                return this.menu.filter((item,index) => index >= 6 && item.menuid != '03.59')
            }else{
                //兼容老版，展示答题器绑定
                return this.menu.filter((item,index) => index >= 6)
            }            
        },
        isCur(){
            console.log("this.visible=="+this.visible+"||"+"this.visibleOther=="+this.visibleOther)
            
            if(this.visible||this.visibleOther){
                let zIndex = commonUtils.getMInPopoverZindex()
                document.getElementById('dialogFilterDiv').style.zIndex = zIndex
                // setTimeout(()=>{this.$store.dispatch('setDialogFilter',true)},200)
                this.$store.dispatch('setDialogFilter',true)
                return true
            }else{
                this.$store.dispatch('setDialogFilter',false)
                return false
            }
        }
    },
    data(){
        return {
            visible:false,//主应用是否显示
            visibleOther:false, //更多应用是否显示
            mainMenuIndex:-1,//主应用
            otherMenuIndex:-1,//更多应用里选中的
            pageNameRealUrls:{},
            menu:[],
        }
    },
    watch:{
        mainMenu(val){
            if(val != ''){
                this.getMainMenu()
            }
        },
        curModule(newVal, oldVal){
            if(newVal != oldVal){
                
            }
        }
    },
    mounted(){        
        let pageNameArr = ['ktjx', 'jxfx', 'jxyp','khzy','kqyx','ktbg']
        let pageNameRealUrls = {}
        for(let item of pageNameArr){
            pageNameRealUrls[item] = require(`../../../assets/icons/${item}.svg`)
        }
        this.pageNameRealUrls = pageNameRealUrls
        this.getMainMenu()

        let mainIndex = this.baseMenu.findIndex(item => item.name == this.curModule)
        this.mainMenuIndex = mainIndex
    },
    methods: {
        getMainMenu(){
            if(this.mainMenu.length > 0){
                this.menu.splice(0,this.menu.length)
                for(let [index,item] of this.mainMenu.entries()){
                    item.index = index
                    if(item.name == '仿真实验'){
                        item.pvname = 'tls_fzsy_fzsy'
                    }else if(item.name=='班级设置'){
                        item.pvname = 'tls_bjsz_bjsz'
                    }else if(item.name=='直播课程'){
                        item.pvname = 'tls_zbkt_zbkt'
                    }else{
                        item.pvname = ''
                    }
                    this.menu.push(item)
                }                
            }
        },
        //模块点击
        async handleClick(row){            
            console.log(row)
            try{
                __VAE__.setChannelId(row.name);
            }catch(e){
                console.log(e);
            }            
            this.visible = false
            this.visibleOther = false

            let mainIndex = this.baseMenu.findIndex(item => item.name == row.name)
            this.mainMenuIndex = mainIndex
            let clickIndex = this.otherMenu.findIndex(item => item.name == row.name)
            this.otherMenuIndex = clickIndex

            if(row.name == '课堂教学'){
                this.$store.dispatch('setIsShowClassHour',true)
            }else{
                if(row.name == '仿真实验'){
                    let res
                    try{
                        res =  await getSsoEncryptInfoApi()
                        console.log(res)
                    }catch(e){
                        console.log('aa')
                        this.$messageteach.warning('网络异常！')
                        return false
                    }
                    
                    let url = ''
                    if(res.code == 200){
                        let des_sso_domain = res.data.SSO
                        let des_sso_ip = res.data.SSO_IP
                        url = this.transferProtocol + this.domainConfig['NOTEBOOK'] + '/experiment/index/wuli?sso='+des_sso_domain+'&sso_ip='+des_sso_ip+'&ut='+this.ut;
                    }
                                                            
                    try{
                        VcomTeach.openByIE(url);
                    }catch(e){
                        window.open(url)
                    }
                    return false
                }else if(row.name == '班级设置'){
                    this.$store.dispatch('setClassSelect',true)
                    return false
                }else if(row.name == '课堂报告'){
                    let url = this.transferProtocol + this.domainConfig["CLASSREPORT"] + '/classReport/action/teaching/view/classReport/'
                    +this.userSelectClassId+'/'+this.baseData.subjectCode+'?username='+this.teacherNumber+'&channelid='+row.menuid
                    if(this.loginStyle == 0){
                        VcomTeach.openNewBrowser(url,'width=0&height=0&title=课堂报告&showclose=true')
                    }else{
                        //alert(url)
                        window.open(url)    
                    }
                    return false     
                }else if(row.name == '答题绑定'){
                    let url = '/teachui/#/paperbind/index'
                    // let url = 'http://plszb.yjt361.com:8777/page_proxy/#/paperbind/index'
                    if(this.loginStyle == 0){
                        VcomTeach.openNewBrowser(url,'width=0&height=0')
                    }else{
                        this.$messageteach.warning('预览模式下不支持配置答题器,请到个人中心进行设置!')
                    }           
                    return false     
                }
                this.$store.dispatch('setIsShowClassHour',false)
            }
           
            this.$router.push({'path':'/'+row.c3})
        },
        //应用是否选中
        baseMenuClassName({row, rowIndex}) {
            if (row.name == this.curModule) {
                return 'success-row';
            }
            return '';
        },
        //更多应用是否选中
        otherMenuClassName({row, rowIndex}) {
            if (row.name == this.curModule) {
                return 'success-row';
            }
            return '';
       }
    }
}
</script>

<style scoped>
p{padding:0;}
.more-list{border-radius: 4px; overflow: hidden; font-size: 0.8rem;}
.more-list li {    padding: 1rem;border-bottom: 1px solid #EBEEF5; width: 50%; float: left; border-right:solid 1px #ebeff5; box-sizing: border-box;}
.more-list li.success-row{    background: #eee;}
.more-list:after{content:""; display: block; clear:both;}

.main-list{border-radius: 4px; overflow: hidden; font-size: 0.8rem;}
.main-list li {    padding: 0.5rem;border-bottom: 1px solid #EBEEF5; box-sizing: border-box;}
.main-list li.success-row{    background: #eee;}
.main-list li img {   vertical-align: middle;}
.main-list:after{content:""; display: block; clear:both;}
</style>
<style>
.is-scrolling-left {overflow-x: hidden!important;}
</style>
