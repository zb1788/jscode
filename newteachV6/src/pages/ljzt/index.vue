<template>
<div class="ljzt">
	<div class="ljtop"><span>状态查看</span>
	</div>
	<el-alert type="success">dsfaasfa</el-alert>
	<div class="ljmiddle">
		<ul class="namelist">
			<li><em>FDDSA</em><span>李晓亚</span><i class="canSel"></i></li>
			<li><em>FD</em><span>李晓亚</span></li>
			<li><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li class="no"><em>F</em><span>李晓亚</span></li>
			<li><em>FDDSA</em><span>李晓亚</span></li>
			<li><em>FD</em><span>李晓亚</span></li>
			<li class="no"><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li><em>F</em><span>李晓亚</span></li>
			<li><em>FDDSA</em><span>李晓亚</span></li>
			<li class="no"><em>FD</em><span>李晓亚</span></li>
			<li><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li><em>F</em><span>李晓亚</span></li>
			<li><em>FDDSA</em><span>李晓亚</span></li>
			<li><em>FD</em><span>李晓亚</span></li>
			<li><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li><em>F</em><span>李晓亚</span></li>
			<li><em>FDDSA</em><span>李晓亚</span></li>
			<li><em>FD</em><span>李晓亚</span></li>
			<li class="no"><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li><em>F</em><span>李晓亚</span></li>
			<li><em>FDDSA</em><span>李晓亚</span></li>
			<li><em>FD</em><span>李晓亚</span></li>
			<li><em>FDA</em><span>李晓李晓李晓亚</span></li>
			<li><em>FDD</em><span>李亚李亚李</span></li>
			<li><em>F</em><span>李晓亚</span></li>
		</ul>
	</div>
	<div class="ljbottom">
		<div class="ztcard"><label>搜索到的设备：0</label><span><i class="colorbox b"></i>已绑定（0)</span><span><i class="colorbox g"></i>未绑定（0)</span><span><i class="colorbox r"></i>未连接（0)</span></div>
	  <el-button type="primary">开始绑定</el-button>
		<button class="closebtn"><i class="el-icon-close" ></i></button>
	</div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import BannerNewteach from '@/components/BannerNewteach'
import TabsNewteach from '@/components/TabsNewteachs'
import PageNewteach from '@/components/PageNewteach'
import DialogNewteach from '@/components/DialogNewteach'
import { getJxfxSubject, getJxfxWkData, getJxfxXunlianData, getJxfxRes, formatJxfxRes} from '@/api/jxfx'
export default {
    data(){
        return{
					
        }
    },

}
</script>

<style scoped>
.ljzt{height: 100%; display: flex; flex-direction: column;}
.ljtop {height:7vh; line-height: 7vh; background: #fafafa;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);}
.ljbottom{background: #efefef;}
.ljmiddle {flex:1;}
.ztcard {box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); padding: 2vh;text-align: left; background: #fff;}
.ztcard label {float: right;}
.ztcard span {margin: 0 1vh; vertical-align: middle;}
.ljbottom>button {margin-top: 2vh;}
.closebtn {background: linear-gradient(180deg,#f95353 0%,#e04a4a 100%); border-radius: 50%; border: 0;color: #fff; height: 5vh; width: 5vh; text-align: center; line-height: 5vh; font-size: 1.5rem; position: absolute;right:1.5vh; bottom:1.5vh;}
.namelist{text-align: left;}
.namelist li {display: inline-block; border: solid 1px #ddd; padding: 1vh 2vh; margin:0.5vh; background: #fafafa; color: #666; border-radius: 5px;}
.namelist li em {font-weight: bold; border-right: 2px solid #999; padding-right: 1vh; font-style: normal; display: inline-block;}
.namelist li span {padding-left: 1vh; display: inline-block; max-width: 12vh; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: middle;}
.namelist li.no{background:#409EFF; border-color:#2a92fd; color: #fff;}
.namelist li.no em {border-color: #fff; text-shadow: 1px 1px 5px #1c548d;}
.namelist li.cur {background: #F56C6C; border-color: #ed6161; color: #fff;}
.namelist li.cur em {border-color: #fff; text-shadow:1px 1px 5px #c74343}
.colorbox {display: inline-block; width: 2vh; height: 2vh; vertical-align: middle; margin-right: 1vh; margin-top: -3px;}
.colorbox.b {background: #409EFF;border:solid 1px #2a92fd;}
.colorbox.r {background: #f95353;border:solid 1px #e04a4a;}
.colorbox.g {background: #efefef; border:solid 1px #ddd;}
</style>
