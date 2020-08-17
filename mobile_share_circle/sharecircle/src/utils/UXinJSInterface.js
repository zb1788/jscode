var getDomainInfoF=function ()
{
 var dataJson={
        "areaCode": "75.",
        "areaName": "测试环境",
        "api_url": "http://192.168.163.71",
        "lp_url": "ws://192.168.163.72",
        "sso_url": "http://sso.youjiaotong.com",
        // "pls_url": "http://plsah.czbanbantong.com",
        "pls_url": "http://plstest.yjt361.com",
        // "tms_url": "http://tmsah.czbanbantong.com",
        "tms_url": "http://tmstest.yjt361.com",
        "gl_url": "http://glpt.youjiaotong.com",
        "pat_url": "http://192.168.165.27",
        "cms_url": "http://cms.youjiaotong.com:8080",
        "areaId": "1",
        "tqms_url": "http://tqms.youjiaotong.com",
        "lcs_url": "http://lcs.youjiaotong.com",
        "eng_url": "http://en.youjiaotong.com",
        "bss_url": "http://bsszz.zzedu.net.cn:8080",
        "ub_url": "http://ub.youjiaotong.com",
        "wk_url": "http://micro.youjiaotong.com",
        "upload_url": "http://192.168.163.223",
        "download_url": "http://192.168.163.223",
        "anls_url": "http://anlysis.youjiaotong.com",
        "vfs_url": "http://vfstest.yjt361.com",
        // "vfs_url": "http://vfsah.yjt361.com",
        // "hdxx_url":"http://ilearnvcomyf.czbanbantong.com",
        "hdxx_url":"http://ilearntest.yjt361.com",
        "aux_url":"http://192.168.148.82"
    };
   var dataJsonStr=JSON.stringify(dataJson);
     return dataJsonStr;
};
var getUserInfoF=function ()
{
    var dataJson={
        "studentId": "30001",
        "parentId": "jz30001",
        // "username": "3401010000010001",
        // "username": "41010377770000",
        // "username": "340188010060069",
        "username": "41010377778888",
        "deviceInfo": "",
    "phone": "",
    "realName": "张博",
    "gradeCode": "",
    "classId": ""
    };
    var dataJsonStr=JSON.stringify(dataJson);
     return dataJsonStr;
}

var onAppItemClickF=function(datajsonStr)
{
    var dataJson=JSON.parse(datajsonStr);
    
    console.log("datajsonStr="+datajsonStr);
   if(dataJson.url&&dataJson.url!="")
   {

    window.open(dataJson.url);
   }

}

var UXinJSInterface= {
    getDomainInfo:getDomainInfoF,
    getUserInfo:getUserInfoF,
    onAppItemClick:onAppItemClickF
};
export default UXinJSInterface;
