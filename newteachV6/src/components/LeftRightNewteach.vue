<template>
<div class="nrbox" >
    <div class="flexb">
        <div class="left">
			<div class="lefttop">
				<slot name="top"></slot>
			</div>
            <div class="left1">
                <slot name="left">暂无对应内容</slot>
            </div>
            <div class="leftbottom">
                <slot name="page"></slot>
            </div>
        </div>
        <div class="right" style="padding: 2vh 0vh 0vh 0vh;">
            <slot name="right"><img src="../assets/images/none.png" style="width: 50vh; height: 50vh; margin: 0 auto;"><p>暂无内容</p></slot>
        </div>
    </div>   
</div>    
</template>

<script>
export default {

}
</script>

<style scoped>
	.nrbox {display: flex; height: 100%; flex-direction: column;}
	.flexb {flex: 1; display: flex; background: #fff;}
	 ul{ margin: 0; padding: 0;}
	.tree{padding: 1vh; text-align: left;}
	.tree>li {height: 4vh; line-height: 4vh; font-size: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
	.tree>li:before{content: ""; background:url(../assets/images/svg/root.svg); width:4vh; height: 4vh; display:inline-block; background-size: 100%; vertical-align: middle; margin-right: 1vh;}
	.tree>ul>li {font-size: 0.9rem; height: 4vh; line-height: 4vh; color: #777; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding:0 1vh; box-sizing: border-box;}
	.tree>ul>li.cur {background:#5a5a5a;    color: #fff;}
	.tree>ul>li:before{content: ""; background:url(../assets/images/svg/node.svg); width:4vh; height: 4vh; display:inline-block; background-size: 100%; vertical-align: middle; margin-right: 1vh;}
	.tree>ul>li:last-child:before { background:url(../assets/images/svg/node2.svg); background-size: 100%; vertical-align: middle; margin-right: 1vh;}
	.lifen2>li {width: 14vw; float:left;}
	.lifen2:after{content: ""; clear:both; display: block;}
	.yxlist {background:#fff; height: 100%; padding:0 1vh ; box-sizing: border-box; display: flex; flex-direction: column;}
	.yxlist ul {margin:0 1vh; -webkit-padding-start:0;}
	.yxlist li {display: flex; width: 100%; border-bottom: solid 1px #efefef; height:6.8vh; }
	.yxlist li>*{align-self: center; text-align: left;}
	.yxlist li p {flex: 1; font-size:0.9rem; padding: 0 1vw; color: #666; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
	.lefttop {background:#409eff; color: #fff; height: 6vh; line-height: 6vh;}
	.lefttop i{margin: 0 1vh;}
	.left {width: 30vw; background: #efefef;display: flex; flex-direction: column;}
	.left1 {flex:1; overflow-y: auto;}
	.leftbottom {height: 7vh; text-align: right; padding: 1vh;}
	.right{flex: 1; width: 0;}
	.right1 {flex:1; overflow-y:hidden;}
	.right .rightbottom {height: 7vh; text-align: right; padding: 1vh;}
</style>
