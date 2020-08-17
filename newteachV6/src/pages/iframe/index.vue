<template>
    <div id="flexDiv">
        <div id="iframeDiv">
        <iframe src="https://tqmstest.yjt361.com/online/interface/queryTblxPaper.action?paper_id=aae966dbfae8483caef4f6c3aa27cb7c"></iframe>
        </div>
        <div id="bottomDiv">啊短发散发</div>
        <el-button type="danger" icon="el-icon-close" circle  style="position: absolute; right: 1vh; bottom: 1vh;"></el-button>
    </div>
</template>

<script>
export default {

}
</script>

<style>
#flexDiv{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}
#iframeDiv{
    flex:1;
}

#iframeDiv iframe{
    height: 100%;
    width: 100%;
}

#bottomDiv{
    height: 10vh;
    line-height: 10vh;
    text-indent: 1em;
    border-top: 2px solid #ddd;
    /* background: url("../../assets/images/btn.png") bottom repeat-x; */
    background: #f5f7fa
}

</style>
