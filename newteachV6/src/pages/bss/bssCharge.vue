<template>
    <div v-if="bssChargeFlag">
        <div>{{bssChargeMsg}}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLoginStyle} from '@/utils/auth'
import request from '@/utils/request'
import commonUtils from '@/utils/common'

export default {
    name: 'bssCharge',
    computed: {
        ...mapGetters([
            'teacherNumber',
            'transferProtocol',
            'domainConfig',
            'loginStyle'
        ])
    },
    data(){
        return {
            bssChargeFlag: false,
            bssChargeMsg: ''
        }
    },
    watch: {
        teacherNumber(val){
            if(val != ''){
                //只有授课登录才判断
                if(this.loginStyle == 0){
                        //收费判断
                        let url = this.transferProtocol + this.domainConfig['SSO'] +'/sso/interface/queryBssStateSchool.jsp'
                        let params = {}
                        
                        params.username = this.teacherNumber
                        params.reqEncoding = 'gbk'

                        request({url: url, method: 'get', data:params}) .then((response) => {
                            if(typeof(response.userAble) && !response.userAble) {
                                //给提示，回登录页
                                this.bssChargeFlag = true
                                this.bssChargeMsg = '尊敬的用户：' + response.bssStateFlgTip;
                            }else if(typeof(response.userAble) && response.userAble && response.bssStateFlg=="2"){
                                //给提示直接用
                                this.bssChargeFlag = true
                                this.bssChargeMsg = '尊敬的用户：' + response.bssStateFlgTip;
                            }
                        }).catch((error) => {
                            commonUtils.console(error, '获取收费接口失败')
                        })
                }
            }
        }
    }
}
</script>

<style>

</style>
