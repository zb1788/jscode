/**
 * 教学分析
 */
import request from '@/utils/request'
import store from '@/store'
import commonUtils from '@/utils/common'


//新的获取教学分析学科等信息
export function getJxfxSubjectNew(){
     let url = process.env.JXFX_BASE_PREFIX + '/analysis/pages/jxfx2/interface/isShowAnalysisJson.jsp'
    
     let params = {}
     
     return new Promise((resolve, reject) => {
         resolve(request({url: url, method: 'get', data:params}) ) 
     })    
}

//老的方法
export function getJxfxSubject(self){
     //let url = 'http://jxfxtest.yjt361.com/analysis/pages/jxfx2/interface/isShowAnalysisInterface.jsp'
    //  let url = process.env.JXFX_BASE_PREFIX + '/analysis/pages/jxfx2/interface/isShowAnalysisInterface.jsp'
    
    //  let params = {}
     
    //  return new Promise((resolve, reject) => {
    //      resolve(request({url: url, method: 'get', data:params}) ) 
    //  })


    let scriptEle = document.createElement('script')
    scriptEle.src = store.getters.transferProtocol + store.getters.domainConfig['ANLS'] + '/analysis/pages/jxfx2/interface/isShowAnalysisInterface.jsp'
    document.body.appendChild(scriptEle)
    scriptEle.onload = function() {
        checkConfig(self)
    }    
   
 }


export async function setViewData(self,jxfx_classSubject){
    self.eMessage = "数据加载中..";
    self.resList = []
    self.tabArr = []
     //年级科目限制
     let ifShow = false
    if(jxfx_classSubject&&jxfx_classSubject!=undefined&&jxfx_classSubject!=null)
    {
        // eval("let jxfx_classSubject="+jxfxclassSubject);
        // let jxfx_classSubject = JSON.parse(jxfxclassSubject)
        let jxfx0001 = jxfx_classSubject.jxfx0001;
        let jxfx0002 = jxfx_classSubject.jxfx0002;
        let jxfx0003 = jxfx_classSubject.jxfx0003;
        let jxfxExcludeVersion = jxfx_classSubject.jxfxExcludeVersion;


        if(store.getters.baseData.studyStageCode=="0001")
        {
            let gradesubject = ";"+store.getters.baseData.gradeCode + store.getters.baseData.subjectCode+";";
            if((";"+jxfx0001+";").indexOf(gradesubject)!=-1)
            ifShow = true;
        }
        else if(store.getters.baseData.studyStageCode=="0002")
        {
            let gradesubject = ";"+store.getters.baseData.gradeCode+store.getters.baseData.subjectCode+";";
            if((";"+jxfx0002+";").indexOf(gradesubject)!=-1)
            ifShow = true;
        }
        else if(store.getters.baseData.studyStageCode=="0003")
        {
            let gradesubject = ";"+store.getters.baseData.subjectCode+";";
            if((";"+jxfx0003+";").indexOf(gradesubject)!=-1)
                ifShow = true;
        }

        if(true){
            let gradesubject = ";"+store.getters.ksId+";";
            if((";"+jxfxExcludeVersion+";").indexOf(gradesubject)!=-1)
                ifShow = false;
        }
    }

    let arr = []
    if(!ifShow){
        //学科暂未上线，敬请期待······
        return arr
    }else{
        //重置页码
        self.pageCurrent=1;
        //0,普通课程;1,单元复习;2,期中;3,期末
        
        if(store.getters.currentmfFlag == 0 || store.getters.currentmfFlag == 1 ){
            //温馨提示：典型错题为班级学生错误率超过60%的试题，加权均分率为学生在难中易不同难度层次得分率的加权均分率
            try{
                let result =  await getJxfxRes(3)
                let resultObj = formatJxfxRes(result)
                self.resList = resultObj.resList
                self.tabArr = []
            }catch(e){
                console.log(e)
            }
        }else{
            //重要知识点/薄弱知识点/未测评知识点/全部知识点(显示第一个栏目)
            let tabArr = showJxfxTabs()
            try{
                let result =  await getJxfxRes(0)
                let resultObj = formatJxfxRes(result)
                self.resList = resultObj.resList
                self.tabArr = tabArr
                self.$refs.tabRef.setActiveName(tabArr[0].name)
            }catch(e){
                console.log(e)
            }            
        }
        self.eMessage = "暂无数据";
    }

}

/**
 * 显示教学分析tab标签
 */
function showJxfxTabs(){
    let arr = [{'name':'重要知识点',type:0},{'name':'薄弱知识点',type:1},{'name':'未测评知识点',type:2},{'name':'全部知识点',type:3}]
    return arr
}


/**
 * 
 * @param {*} requestType //具体含义问接口相关人员
 */
export function getJxfxRes(requestType){
    //后期增加统计接口
    let type=0
    if(store.getters.currentmfFlag==2||store.getters.currentmfFlag==3)
    {
        type=1
    }
    let url =  process.env.TIS_BASE_PREFIX + '/analysis/cls/analysisInterface.action'
    let params = {}
    params.lessionId = store.getters.ksId
    params.classId = store.getters.userSelectClassId
    params.type = type
    params.requestType = requestType

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })  
 }

/**
 * 格式化教学分析接口获取的数据
 * @param {*} rdata 
 */
export function formatJxfxRes(rdata){
    let arr = []
    if(rdata && rdata.vos && rdata.vos.length>0) {
        for (let temp of rdata.vos) {       
            let obj = {}     
            let buttonArr = []
            obj.title = temp.knowledgeContent; //知识点名
            obj.gradeFrequency = temp.gradeFrequency;//中考重要性
            obj.accuracy = temp.accuracy;//综合得分率 加权均分率
            obj.uncorrectAmount = temp.uncorrectAmount;//典型错题数
            obj.knowledgeId = temp.knowledgeId;//
            obj.uncorrectAmountUrl = ''

            //知识点名长度处理
            if(obj.title&&obj.title.length>31){
                obj.title=obj.title.substring(0,30)+"…";
            }
            //中考重要性
            if(null==obj.gradeFrequency)
            {
                obj.gradeFrequency="--";
            }

            //加权均分率
            if(obj.accuracy=="--")
            {
                obj.accuracy="--";
            }
            else
            {
                obj.accuracy=Math.round(Number(obj.accuracy)*100)/100+"%";
            }
            //典型错题数
            if(0==obj.uncorrectAmount||obj.uncorrectAmount==null||obj.uncorrectAmount=="--"){
                obj.uncorrectAmount="--";
            }else{
                obj.uncorrectAmountUrl = store.getters.transferProtocol+store.getters.domainConfig['QBMS']+"/tqms/jxfx/typicalWrongQues.action?lessionId="+store.getters.ksId+"&username="+store.getters.teacherNumber+"&class_id="+store.getters.userSelectClassId+"&knowledgeId="+obj.knowledgeId+"&accuracy=60&loginStyle=0";   	
            }
            
            let fourthKnowledgeId = obj.knowledgeId;
            if(temp.child)
            {
                fourthKnowledgeId = temp.child;
            }
            obj.fourthKnowledgeId = fourthKnowledgeId
            buttonArr .push({'name':'训练','enabled':true,'type':'xunlian',pvkey:"tls_jxfx_tfxl"})
            buttonArr .push({'name':'微课','enabled':true,'type':'weike',pvkey:"tls_jxfx_wk"})
            
            obj.button = buttonArr
            arr.push(obj)
        }
    }

    let result = {}
    result.resList = arr


    return result
}

/**
 * 获取微课资源
 * @param {*} kPoint 
 */
export async function getJxfxWkData(kPoint){
    let res = await getJxfxWkApi(kPoint)
    return res
}



/**
 * 获取微课资源
 * @param {*} kPoint 
 */
export function getJxfxWkApi(kPoint){
    let url = process.env.PLS_BASE_PREFIX + '/youjiao/getResInfoByKPoint.do'

    let params = {}
    params.kPoint = kPoint

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })
}

/**
 * 点击训练按钮接口
 * @param {*} kid 
 * @result  {"knowledgeNum":1,"question_num":5,"difficulty":"较易","question_ids":"93df32edb824420299778f2293d64436;115a99f36d24434493389f35a4435537","success":true}
 *            知识点数量          试题数量       难以度        试题id串
 */
export async function getJxfxXunlianData(kid){
    let res = await getJxfxXunlianApi(kid)
    return res
}


/**
 * 点击训练按钮接口
 * @param {*} kid 
 */
function getJxfxXunlianApi(kid){
    let url = process.env.TQMS_BASE_PREFIX + '/tqms/jxfx/getJxfxQuestions_Ids.action'
    let params = {}
    params.lessionId = store.getters.ksId
    params.knowledge_ids = kid
    params.classIds = store.getters.userSelectClassId
    params.username = store.getters.teacherNumber

    return new Promise((resolve, reject) => {
        resolve(request({url: url, method: 'get', data:params}) ) 
    })  
}