// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'normalize.css/normalize.css' //格式化css
import '@/style/index.css'
import store from './store'
import commonUtils from './utils/common'
import '@/permission' //权限控制
import 'babel-polyfill'
import './directives'


// import 'element-ui/lib/theme-chalk/index.css'
// import {
//   Dialog,
//   Input,
//   Checkbox,
//   CheckboxButton,
//   CheckboxGroup,
//   Button,
//   ButtonGroup,
//   Table,
//   TableColumn,
//   Popover,
//   Form,
//   FormItem,
//   Tabs,
//   TabPane,
//   Tag,
//   Tree,
//   Alert,
//   Slider,
//   Icon,
//   Row,
//   Col,
//   Progress,
//   Card,
//   Transfer,
//   Container,
//   Header,
//   Aside,
//   Main,
//   Footer,
//   Image,
//   Loading,
//   MessageBox,
//   Message,
//   Notification
// } from 'element-ui';

// Vue.use(Dialog);
// Vue.use(Input);
// Vue.use(Checkbox);
// Vue.use(CheckboxButton);
// Vue.use(CheckboxGroup);
// Vue.use(Button);
// Vue.use(ButtonGroup);
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(Popover);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(Tag);
// Vue.use(Tree);
// Vue.use(Alert);
// Vue.use(Slider);
// Vue.use(Icon);
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Progress);
// Vue.use(Card);
// Vue.use(Transfer);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
// Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Image);
// Vue.use(Loading.directive);

// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$notify = Notification;
// Vue.prototype.$message = Message;



import { 
  YjNewteachVisibilityDialog,
  yjNewteachStudentGroup,
  YjNewteachCheckboxGroup,
  YjNewteachCheckbox,
  YjNewteachButton,
  YjNewteachCloseButton,
  yjNewteachTabs,
  yjNewteachTabPane,
  yjNewteachGroup,
  yjNewteachGroupItem, 
  yjNewteachGroupOption,
  yjNewteachCard,
  yjNewteachMenu,
  yjNewteachMenuItem,

} 
  from 'newteach-ui'

Vue.prototype.commonUtils = commonUtils
Vue.config.productionTip = false
Vue.use(YjNewteachVisibilityDialog)
Vue.use(yjNewteachStudentGroup)
Vue.use(YjNewteachCheckboxGroup)
Vue.use(YjNewteachCheckbox)
Vue.use(YjNewteachButton)
Vue.use(YjNewteachCloseButton)
Vue.use(yjNewteachTabs)
Vue.use(yjNewteachTabPane)
Vue.use(yjNewteachGroup)
Vue.use(yjNewteachGroupItem)
Vue.use(yjNewteachGroupOption)
Vue.use(yjNewteachCard)
Vue.use(yjNewteachMenu)
Vue.use(yjNewteachMenuItem)

//重写Message弹窗方法
const Message = function(obj){
  let params = {}
  if(typeof obj.message != 'undefined'){
    params.message = obj.message
  }

  if(typeof obj.type != 'undefined'){
    params.type = obj.type
  }
  
  if(typeof obj.duration != 'undefined'){
    params.duration = obj.duration
  }
   
  if(typeof obj.center != 'undefined'){
    params.center = obj.center
  }

  params.showClose = true //默认显示X

  //获取所有弹窗
  let doms = document.getElementsByClassName("el-message")
  //循环判断当前弹窗是否存在，如果存在不再弹窗
  for(let i=0; i<doms.length; i++){
    if(document.getElementsByClassName("el-message")[i].textContent == params.message){
      return
    }
  }

  ELEMENT.Message(params)



  
  let offset = 51
  let ext = '%'
  if(typeof obj.offset != 'undefined'){
    offset = obj.offset
  }

  //如果传递了点击dom的事件，就以此为准
  if(typeof obj.event != 'undefined'){
    let event = obj.event //当前点击的时间
    let clickHeight = event.clientY //当前点击dom位置的高度

    if(typeof obj.offsetHeight != 'undefined'){
      //取当前位置的百分比，再多加百分之几
      console.log(clickHeight/document.documentElement.clientHeight*100+obj.offsetHeight)
      offset = (clickHeight/document.documentElement.clientHeight*100+obj.offsetHeight)/100*document.documentElement.clientHeight      
    }else{
      offset = clickHeight
    }
    
    ext = 'px'
  }

  let maxZindex = commonUtils.getMaxZindex()
  console.log(maxZindex)
  //如果有多个弹窗，则竖排分开
  for(let i=0; i<doms.length; i++){
    if(i == 0){
      document.getElementsByClassName("el-message")[i].style.top = offset + ext
      document.getElementsByClassName("el-message")[i].style.zIndex = maxZindex +1
    }else{
      offset += 8
      document.getElementsByClassName("el-message")[i].style.top = offset + ext
      document.getElementsByClassName("el-message")[i].style.zIndex = maxZindex +1
    }

  }


 
};


['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return Message(options);
  };
});

Vue.prototype.$messageteach = Message
/** 
用法1：
this.$messageteach.error('至少选择一个任务才能发送')
用法2：
this.$messageteach({'type':'error','message':'afadsf','event':event,'offsetHeight':-6})
*/

// Vue.use(ElementUI, {
//   size:  'small', // set element-ui default size
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
