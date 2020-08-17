<template>
    <div>
        <div :class="info.isMy? 'bagblue':'bagfff'">
            <div class="pad010">
                <flexbox class="info">
                <flexbox-item :span="2" class="" style="flex:0 0 12.66%">
                    <template v-if="info.isMy">
                        &nbsp;
                        <img :src="info.headPhoto" style="border-radius:45px;margin-left:5px;" width="40" height="40" :onerror="imgUrl" class="headphoto" />
                    </template>
					<template v-else>
						<img style="border-radius:45px;margin-left:5px;" width="40" height="40" :src="info.headPhoto"  :onerror="imgUrl" class="headphoto" />
					</template>                    
                </flexbox-item>
                <flexbox-item :span="6" class="bfont" style="flex:0 0 60%">            
                    <span class="blockdiv line30 bluefont">
                        <template v-if="info.isMy">
                            我
                        </template>
                        <template v-if="!info.isMy">
                            {{info.userName}}
                        </template>
                        <template v-if="info.isFollow == 1">
                            <span class="nofollow" @click="onAttention(info.userAccount)"><i class="icon-jia"></i>关注</span>
                        </template>
                        <template v-if="info.isFollow == 2">
                            <span class="follow" @click="offAttention(info.userAccount)">已关注</span>
                        </template>                
                    </span>
                    <span class="blockdiv texth6">{{info.schoolName}}</span>
                </flexbox-item>
                <flexbox-item style="margin-left:0;">
                    <x-button v-if="info.isMy" type="primary" mini @click.native="goMyClassHour"  style="background-color: rgb(0, 187, 255); float: right;padding: 0 0.32em;">我的授课包</x-button>
                    <x-button v-else type="primary" mini @click.native="goMyClassHour" style="background-color:rgb(248, 142, 37); float:right;padding: 0 0.32em;">他的授课包</x-button>
                </flexbox-item>
                </flexbox>     

                <flexbox>
                    <flexbox-item :span="2" class="" style="flex:0 0 12.66%"></flexbox-item> 
                    <flexbox-item :span="10" style="flex:0 0 87.33%">
                        <p class="commentInfo textp">
                            {{info.Comment}}
                        </p>
                        <checker type="checkbox" default-item-class="checkbox-item" selected-item-class="checkbox-item-selected">
                            <checker-item 
                            disabled
                            :value="item" 
                            v-for="(item, index) in showVoteArr" 
                            :key="index" 
                            @on-item-click="onCheckBoxItemClick(item,index)"
                            >{{item.showMsg}}
                            </checker-item>
                        </checker>
                        <flexbox class="fenx">
                            <flexbox-item :span="7" class="grafont">
                                {{info.shareTime}} 共享至{{info.shareArea}}
                            </flexbox-item>
                            <flexbox-item style="margin: 0;">
                                <i class="ico-edyy" style="margin: 0;"></i>{{info.shareNum}}
                            </flexbox-item>
                            <flexbox-item style="margin: 0;">
                                <i class="ico-edpl" style="margin: 0;"></i>{{info.commentNum}}
                            </flexbox-item>      
                        </flexbox>
                        <div :class="info.isMy? 'bagblue01':'bagfa'" style="margin-right: 10px;">
                            <card class="pad10" style="margin-bottom: 10px; background: none; margin-right: 0;">
                                <div v-if="info.isMy && info.shareList != ''" slot="content" class="backColor yiny bluefont">
                                    {{info.shareList}}<span>引用了我的授课包</span>
                                </div>
                                <div slot="content" class="backColor">
                                    <ul>
                                        <li 
                                        class="wordinfo mb5" 
                                        style="align-items:baseline" 
                                        v-for="(item,index) in showCommentListArr" 
                                        v-show='item.isShowMoreComment'
                                        :key="index"
                                        @click="pinglun(item.username)"

                                        @touchstart="touchin(index)" 
                                        @touchend="cleartime"
                                        @touchmove="moveEve"
                                    
                                        >
                                            <span class="username bluefont" v-if='item.toname==""' >{{item.username}}：</span>
                                            <span class="username bluefont" v-else >{{item.username}}回复{{item.toname}}：</span>
                                            <span class="fontGray" :class = "currentCommentIndex==index?'cur':''" v-html="item.msg"></span>
                                        </li>
                                        <flexbox>
                                            <flexbox-item :span="9" class=""></flexbox-item> 
                                        <flexbox-item v-if='info.commentNum>(this.showCommentNum+1) && !info.isShowMore' :span="1">
                                        <i class="ico-edmore" @click="showMoreComment"></i>
                                        </flexbox-item>
                                        </flexbox>
                                        <!-- <flexbox>
                                            <flexbox-item> -->
                                            <!-- <input class="inputss" /> -->
                                            <div style="display:flex;align-items: flex-end; ">
                                            <group style="flex:1">
                                                <x-textarea 
                                                id="textareaid"
                                                ref="textarearef" 
                                                :height="10" 
                                                :max="100" 
                                                :rows=1 
                                                :cols=10 
                                                :show-counter="false" 
                                                :autosize="true" 
                                                name="description" 
                                                :placeholder="placeholder"  
                                                v-model="commentMsg"
                                                @on-change="onChangeTextarea"
                                                style="padding: 4px 2px;font-size:0.8em;"
                                                ></x-textarea>
                                                <!-- <x-input title="" @on-enter="clickEnter" :show-clear="false" class="weui-vcode">
                                                    <x-button v-if="info.isMy" style="background-color: rgb(0, 187, 255);" slot="right" type="primary" mini>发送</x-button>
                                                    <x-button v-else style="background-color: rgb(248, 142, 37);" slot="right" type="primary" mini>发送</x-button>
                                                </x-input> -->        
                                           </group>
                                            <i @click="toogleEmotion" class="ico-face" style="margin: 0;"></i>
                                            <!-- <x-button v-if="info.isMy" style="background-color: rgb(0, 187, 255);margin-top:5px;" slot="right" type="primary" mini>发送</x-button> -->
                                            
                                            <x-button v-if="commentMsg==''" @click.native="saveComment" disabled style="margin-left:5px;padding: 0 0.72em;" slot="right" type="default" mini>发送</x-button>
                                            <x-button v-else @click.native="saveComment" style="margin-left:5px;padding: 0 0.72em;" slot="right" type="primary" mini>发送</x-button>
                                            </div>
                                            <Emoji 
                                            :isShow = "emotionListStatus"
                                            @choseEmoji = "choseEmoji"
                                            ></Emoji>
                                            <!-- <ul v-show="emotionListStatus" style="padding:5px 0;">
                                                <li v-for="(item) in list" :key="item" style="float: left;">
                                                    <emotion @click.native="getEmotion(item)">{{item}}</emotion>
                                                </li>
                                            </ul> -->
                                            <!-- <ul v-show="emotionListStatus">
                                                <li style="float: left;font-size:20px;"  @click="test(item)" v-for="(item,index) in getbq" :key="index">{{item}}</li>
                                            </ul> -->
                                            <!-- </flexbox-item>  -->
                                            <!-- <flexbox-item :span="3" style="margin: 0;"><button class="dfb">发表</button></flexbox-item>  -->
                                        <!-- </flexbox> -->
                                    </ul>
                                </div>
                            </card>
                        </div>

                    </flexbox-item>    
                </flexbox>   
                <div class="dhr"></div>
            </div>
        </div>
    <!--广告位开始-->
    <flexbox v-if="info.hasAd">
        <div>
            <div class="pad010">
                <flexbox class="info">
                    <flexbox-item :span="2" class="">
                        <img class="headphoto" width="50" height="50" :src="info.adHeadPhoto"  :onerror="errorAdHeadUrl"  />
                    </flexbox-item>
                    <flexbox-item :span="7" class="bfont" >            
                        <span class="blockdiv line30">{{info.adTitle}}</span>
                        <span class="blockdiv texth6">{{info.adContent}}</span>
                    </flexbox-item>
                    <flexbox-item>
                        <span class="guanggao">{{info.adDesc}}</span>
                    </flexbox-item>
                </flexbox>
                <flexbox>
                    <flexbox-item :span="2" class=""></flexbox-item> 
                    <flexbox-item :span="10" class="padtb10">
                        <img @click="goAd" class="headphoto" width="80%" :src="info.adPic" :onerror="errorAdimgUrl"/>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
    </flexbox>
    <div class="dhr"></div>
    <!--广告位结束 -->   
    <div v-transfer-dom>
      <confirm v-model="confirmShow"

      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      @on-show="onShow"
      @on-hide="onHide">
        <p style="text-align:center;">确定删除？</p>
      </confirm>
    </div>
    </div>
        
</template>

<script>
import {Flexbox, FlexboxItem, Divider, XButton, Card, Checker, CheckerItem,Badge,Masker,XInput,Group,XTextarea,Confirm,TransferDomDirective as TransferDom    } from 'vux'
import {Loadmore,Spinner } from 'mint-ui';
import Emoji from './Emoji'
import Vue from 'vue'
// import UXinJSInterface from '@/utils/UXinJSInterface'
Vue.component(Loadmore.name, Loadmore);
Vue.component(Spinner.name, Spinner);


export default {
    directives: {
        TransferDom
    },
    props: ["info","indexKey","isEmptyComment"],
    components: {
        Flexbox, FlexboxItem, Divider, XButton, Card, Checker, CheckerItem,Badge,Masker,XInput,Group,XTextarea,Loadmore,Emoji,Confirm
    },
    data(){
        return {
            imgUrl: 'this.src="' + require("@/assets/default1.png")+'"',
            errorAdimgUrl: 'this.src="' + require("@/assets/defaultad.jpg")+'"',
            errorAdHeadUrl: 'this.src="' + require("@/assets/defaultad2.png")+'"',      
            commentMsg:'',//评论内容
            placeholder:'评论',//输入框默认值
            currentCommentToName:'',//要回复的人员
            currentCommentIndex:-1,//当前要删除的索引
            showCommentNum:19,//默认从0开始
            // emotion:'',
            emotionListStatus:false,//表情列表显示隐藏
            confirmShow:false,//确认显示隐藏
            aa:'111',
            Loop:'',
            isMove:false,
            list: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
        }
    },
    watch:{
        isEmptyComment(curVal,oldVal){
            console.log(curVal)
            console.log(oldVal)
            if(curVal){
                this.commentMsg = ""
                this.placeholder = '评论'
                this.currentCommentToName = ''
            }
        }
    },
    computed:{
        showVoteArr(){
            let newVoteItems = []
            for(let index=0; index < this.info.items.length; index++){
                if(this.info.items[index].value != ""){
                    let obj = {}
                    obj.id = this.info.items[index].id
                    obj.voteId = this.info.items[index].voteId
                    obj.count = this.info.items[index].count
                    obj.value = this.info.items[index].value
                    if(this.info.items[index].count > 0){
                        obj.showMsg = this.info.items[index].value + '('+this.info.items[index].count+ ')'
                    }else{
                        obj.showMsg = this.info.items[index].value
                    }
                    newVoteItems.push(obj)
                }
            }
            return newVoteItems
        },
        showCommentListArr(){
            console.log('-----')
            let CommentListArr = []
            for(let index=0; index < this.info.CommentList.length; index++){
                let obj = {}
                obj.msg = this.info.CommentList[index].msg
                obj.toname = this.info.CommentList[index].toname
                obj.username = this.info.CommentList[index].username
                if(index>this.showCommentNum){
                    obj.isShowMoreComment = false
                }else{
                    obj.isShowMoreComment = true
                }
                CommentListArr.push(obj)
            }
            return CommentListArr
        }
    },
    methods:{
        //选择表情
        choseEmoji(item){
            let tmp = item 
            this.commentMsg += tmp
        },
        //监控textarea内容变化
        onChangeTextarea(){
            this.$nextTick(function(){
                let h = document.getElementById('textareaid').getElementsByTagName('textarea')[0].scrollHeight
                document.getElementById('textareaid').getElementsByTagName('textarea')[0].style.height = h+'px'
                this.$refs.textarearef.updateAutosize()
                this.$refs.textarearef.focus()
            })
        },
        //显示隐藏表情列表
        toogleEmotion(){
            this.emotionListStatus = !this.emotionListStatus
        },
        getEmotion(item){
            // U+1f600
            let arr = this.findSurrogatePair('0x1f600')
            let bq = String.fromCharCode('0x'+arr[0],'0x'+arr[1])

            this.commentMsg = bq

            let emotion = `#${item};`
            this.commentMsg += emotion
            var textarea = document.getElementById('textarea').getElementsByTagName('textarea')[0]

            textarea.focus()
            // let word = this.emotion.replace(/\#|\;/gi,'')
            // console.log(word)
            
            // this.aa = this.getImg(word)

            // this.emotionListStatus = false
        },
        getImg(str){
            let word = str.replace(/\#|\;/gi,'')
            let index = this.list.indexOf(word)
            return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`  
        },
        //打开广告链接
        goAd(){
            let url = this.info.adUrl;
            //alert(url)
            if(url != null && typeof url != 'undefined'){
                let vfs_url = JSON.parse(UXinJSInterface.getDomainInfo()).vfs_url
                let areaCode = JSON.parse(UXinJSInterface.getDomainInfo()).areaCode
                let userAccount = JSON.parse(UXinJSInterface.getUserInfo()).username
                UXinJSInterface.openNewWebPage('',vfs_url+url+'?areacode='+areaCode+'&username='+userAccount+'&usertype=2')
                // let adUrl = vfs_url+url+'?areacode='+areaCode+'&username='+userAccount+'&usertype=2'
                // let data={ "newsId": ""};
                // var obj = {
                //         "type": "4121",
                //         "url":adUrl,
                //         "title": "",
                //         "showTitleBar":true,
                //         "data": data
                //     }
                // var json = JSON.stringify(obj);
                // try
                // {
                //     UXinJSInterface.onAppItemClick(json);
                // }catch(e)
                // {
                //     window.open(url);
                // }
            }
        },
        goMyClassHour(index){
            console.log('去我的课时包')
            this.$emit("goMyClassHour", this.info.isMy,this.indexKey);
        },
        //评论投票选择
        onCheckBoxItemClick(item,index){
        // console.log(item, index)
        this.info.items[index].count = item.count*1+1
        this.$emit('saveVote',this.info.infoid,item.id)
        },
        //展示更多评论
        showMoreComment(){
            this.info.isShowMore = true
            this.showCommentNum = 100
        },
        //点击人名回复评论
        pinglun(toname){
            let realName = JSON.parse(UXinJSInterface.getUserInfo()).realName
            if(realName != toname){
                this.placeholder = '回复' + toname
                this.currentCommentToName = toname
            }else{
                this.placeholder = '评论'
                this.currentCommentToName = ''
            }
        },
        //保存评论
        saveComment(){
            this.emotionListStatus = false
            this.$emit("addPinglun", this.info.isMy,this.info.infoid,this.currentCommentToName,this.indexKey,this.commentMsg);
        },    
        //关注
        onAttention(concernAccount){
            this.info.isFollow = 2
            this.$emit("onPageAttention", concernAccount);
        },
        //取消关注
        offAttention(concernAccount){
            this.info.isFollow = 1
            this.$emit("offPageAttention", concernAccount);
        },
        clickEnter(){
            //alert('x')
        },
        // v-longtap="(e)=>vueTouch('长按',e,index)" 
        vueTouch(txt,e,index){
            // console.log(txt+"|"+index)
            let realName = JSON.parse(UXinJSInterface.getUserInfo()).realName
            if(realName != this.info.CommentList[index].username){
                return false
            }
            this.confirmShow = true
            this.currentCommentIndex = index
        },
        // @touchstart.prevent="touchin(index)" 
        // @touchend.prevent="cleartime"
        //开始按
        touchin(index) {
            // console.log('touch')
            clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
            let realName = JSON.parse(UXinJSInterface.getUserInfo()).realName
            if(realName != this.info.CommentList[index].username){
                return false
            }
            let self = this
            this.Loop = setTimeout(function() {
                // console.log('xxx')
                // console.log(self.isMove)
                if(!self.isMove){
                    self.confirmShow = true
                    self.currentCommentIndex = index
                }
            }.bind(self), 1000);
        },
        moveEve(e){
            // console.log('move')
            this.isMove = true
        },
        cleartime(e) {
            // console.log(e)
            this.isMove = false
            clearInterval(this.Loop);
            // 这个方法主要是用来将每次手指移出之后将计时器清零
            // clearInterval(this.Loop);
            // var disX=e.changedTouches[0].pageX-this.vueTouches.x;
            // var disY=e.changedTouches[0].pageY-this.vueTouches.y;
            // clearTimeout(this.Loop);
            // if(Math.abs(disX)>10||Math.abs(disY)>100){
            //     this.vueCallBack(e);
            // }else{
            //     if(this.longTouch&&this.vueMoves){
            //         this.touchType=="tap"&&this.vueCallBack(e);
            //         this.vueLeave=false
            //     };
            // };
        },
        //取消
        onCancel () {
            console.log('on cancel')
        },
        //确定
        onConfirm () {
            console.log('on confirm')
            this.$emit("delComment",this.info.isMy, this.indexKey,this.currentCommentIndex)
        },
        //隐藏
        onHide () {
            console.log('on hide')
            this.currentCommentIndex = -1
        },
        //显示
        onShow () {
            console.log('on show')
        }
    }
}
</script>

<style>
.sendBtnGray{background-color: rgb(191,191,191);}
.sendBtnYellow{background-color: rgb(248, 142, 37);}
.cur{
    background-color: #efefef;
}
.weui-cells {border-left:1px solid #e8e8e8; border-right:1px solid #e8e8e8}

textarea::-webkit-input-placeholder { /* WebKit browsers */
  color: #999;
  font-size: 0.9em;
  line-height: 24px;
}

textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #999;
   font-size: 0.9em;
   line-height: 24px;
}

textarea:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #999;
   font-size: 0.9em;
   line-height: 24px;
}   
</style>
