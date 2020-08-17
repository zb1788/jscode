/**
 * window LocalStorage操作
 */
const storage = {
    //初始化函数
    checkLocalStorage(){
        if (!window.localStorage) {
            alert("您的设备不支持localStorage功能")
            return false
        }
    },
    /**
     * 存储内容到localStorage
     * 【主要】如果是json格式需要encodeURI(JSON.stringify(value)),取(JSON.parse())的时候decodeURI(value)
     * @param {[String]} name  [名称]
     * @param {[String]} value [值]
     */
    set(name,value){
        this.checkLocalStorage()
        window.localStorage.setItem(name, value)
    },
    //获取指定key的内容
    get(name){
        this.checkLocalStorage()
        return decodeURIComponent(window.localStorage.getItem(name))
    },

    //清空单个值
    remove(name){
        this.checkLocalStorage()
        window.localStorage.removeItem(name)
    },

    //清空所有值（尽量不要用，以免把别人的缓存清掉）
    removeAll(){
        this.checkLocalStorage()
        window.localStorage.clear()
    }    
}


export default storage