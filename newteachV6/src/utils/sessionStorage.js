/**
 * window sessionStorage操作
 */
const storage = {
    //初始化函数
    checkLocalStorage(){
        if (!window.sessionStorage) {
            alert("您的设备不支持sessionStorage功能")
            return false
        }
    },
    /**
     * 存储内容到sessionStorage
     * 【主要】如果是json格式需要encodeURI(JSON.stringify(value)),取(JSON.parse())的时候decodeURI(value)
     * @param {[String]} name  [名称]
     * @param {[String]} value [值]
     */
    set(name,value){
        this.checkLocalStorage()
        window.sessionStorage.setItem(name, value)
    },
    //获取指定key的内容
    get(name){
        this.checkLocalStorage()
        return decodeURI(window.sessionStorage.getItem(name))
    },

    //清空单个值
    remove(name){
        this.checkLocalStorage()
        window.sessionStorage.removeItem(name)
    },

    //清空所有值（尽量不要用，以免把别人的缓存清掉）
    removeAll(){
        this.checkLocalStorage()
        window.sessionStorage.clear()
    }    
}


export default storage