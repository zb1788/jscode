import Vue from 'vue'
Vue.directive('dialogHeadVisible',{
    bind(el, binding, vnode){
        if(!binding.value.showTitle){
            const dialogHeaderEl = el.querySelector('.el-dialog__header');
            if(dialogHeaderEl.parentNode){
                dialogHeaderEl.parentNode.removeChild(dialogHeaderEl)
            }
        }
    }
})


Vue.directive('popoverWidth',{
    bind(el, binding, vnode){
        if(binding.value.width != null && binding.value.width != ''){
            const target = el.querySelector('.el-popover');
            target.style.width = binding.value.width + 'vw'
        }
    }
})

Vue.directive('rowRemovePadding',{
    bind(el, binding, vnode){
        el.style.marginLeft = 0
        el.style.marginRight = 0
    }
})


Vue.directive('treeRemoveLeaf',{
    bind(el, binding, vnode){
        console.log("treeRemoveLeaf")
        setTimeout(()=>{
            console.log("ttttttttttt")
            let doms = document.getElementsByClassName('is-leaf')
            console.log(doms)
            console.log(doms.length)
            for(let i=0; i<doms.length; i++){
                doms[i].style.display = 'none'
                var newItem=document.createElement("span")
                newItem.className = 'teachPadding'
                newItem.setAttribute('style','padding:6px 11px;');
                
                doms[i].parentNode.insertBefore(newItem,doms[i])
            }
            },500)
    }
})