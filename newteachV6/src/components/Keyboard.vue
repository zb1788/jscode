<template>
<div>
  <div class="keyboard">
      <div class="keyboard-header" @mousedown="handleMouseDown($event)"></div>
      <span v-for="(key,index) in keyList" :key="index"
            :class="{close: key === 'close',delete: key === 'Del', tab: key === 'Tab', capslock: key === 'Caps', enter: key === 'Enter', shift: key === 'Shift', space: key === 'Space', shifted: (key === 'Shift') && hasShifted, capsed: (key === 'Caps') && hasCapsed }"
             @click="clickKey(key)" v-html="showKey(index)"></span>
    </div>
</div>
</template>
<script>
export default {
  props: {
    // 输入框element对象
    elInput: null,
    // v-model
    value: {
      default: () => ''
    }
  },
  data () {
    return {
      keyList: [],
      normalKeyList: [],
      shiftedKeyList: [],
      capsedKeyList: [],
      hasShifted: false,
      hasCapsed: false,
      keyvalue: this.keyboardtext
    }
  },
  created () {
    this.ready()
    this.$nextTick(() => {
      const $keyboard = this.$el.querySelector('.keyboard')
      const documentMouseUp = document.onmouseup
      document.onmouseup = function () {
        documentMouseUp && documentMouseUp.call(this, ...arguments)
        $keyboard.onmousemove = null
      }
    })
  },
  methods: {
    clickKey (key) {
      this.elInput.focus()
      const arrValue = this.value.split('')
      const events = [
        ['Del', () => {
          arrValue.pop()
        }],
        ['Tab', () => {
          //删除所有元素
          arrValue.splice(0,arrValue.length);
          }],
        ['Enter', () => {}],
        ['close', () => {this.$emit('bkClick')}],
        ['Caps', () => {
          this.hasCapsed = !this.hasCapsed
          this.keyList = this.hasCapsed ? this.capsedKeyList : this.normalKeyList
        }],
        ['Shift', () => {
          this.hasShifted = !this.hasShifted
          this.keyList = this.hasShifted ? this.shiftedKeyList : this.normalKeyList
        }]
      ]
      for (const [keyName, func] of events) {
        if (keyName === key) {
          console.log(`on${keyName}`)
          this.$emit(`on${keyName}`)
          func()
        }
      }
      if (!events.filter(([name]) => name === key).length) {
        arrValue.push(key)
      }
      this.$emit('input', arrValue.join(''))
    },
    handleBkClick () {
      this.$emit('bkClick')
    },
    // 拖拽移动键盘
    handleMouseDown () {
      const $keyboard = this.$el.querySelector('.keyboard')
      $keyboard.onmousemove = ($event) => {
        const {
          clientX,
          clientY
        } = $event

        const keyboardWidth = $keyboard.offsetWidth

        $keyboard.style.top = (clientY - 20) + 'px'
        $keyboard.style.left = (clientX - keyboardWidth / 2) + 'px'
      }
    },
    showKey(keyIndex){
      let nowKey=null;
      let otherKey=null;
      if(this.hasShifted){
        nowKey=this.shiftedKeyList[keyIndex];
        otherKey=this.normalKeyList[keyIndex];
      }else if(this.hasCapsed){
        nowKey=this.capsedKeyList[keyIndex];
        otherKey=this.shiftedKeyList[keyIndex];
      }else{
        nowKey=this.normalKeyList[keyIndex];
        otherKey=this.shiftedKeyList[keyIndex];
      }
      
      if("close"==nowKey){
        return "x";
      }
      if("Del"==nowKey){
        return "⇦";
      }
      if("Space"==nowKey){
        return "<font color=red>关闭</font>";
      }
      if("Shift"==nowKey){
        if(this.hasShifted){
          return "<span style='color:#DB6073;font-weight:bolder'>切换</span>";
        }
        return "切换";
      }
      if("Caps"==nowKey){
        if(this.hasCapsed){
        return "换小写";
        }
        return "换大写";
      }
      if("Tab"==nowKey){
        return "<font color=red>清空</font>";
      }
      if("Space"==nowKey || "Enter"==nowKey){
        return "";
      }
      return nowKey;
    },
    ready () {
     const normalKeyList = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Del','close',
        'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
        'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift',
        //'Space'
      ]

      const shiftedKeyList = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Del','close',
        'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
        'Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter',
        'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Shift',
        //'Space'
      ]

      const capsedKeyList = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Del','close',
        'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
        'Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter',
        'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift',
        //'Space'
      ]

      this.keyList = this.normalKeyList = normalKeyList
      this.shiftedKeyList = shiftedKeyList
      this.capsedKeyList = capsedKeyList
    }
  }
}
</script>

<style lang="scss" scoped>
  .keyboard--wrap {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(220, 220, 220, 0.5);
    position: fixed;
    z-index: -10
  }

  .keyboard {
    width: 689px;
    padding: 0 6px 6px 12px;
    font-size: 14px;
    margin: 0;
    border-radius: 12px;
    list-style: none;
    user-select: none;
    position: fixed;
    top: 100px;
    left: 200px;
    z-index: 999999;
    background: rgba(54, 54, 54, 0.67);

    .keyboard-header {
      cursor: move;
      display: block;
      width: 100%;
      height: 12px;
    }

    span {
      float: left;
      margin: 0 5px 5px 0;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      font-size: 22px;
      color:black;

      &:hover {
        position: relative;
        border-color: #dedede;
        cursor: pointer;
      }

      &:active {
        top: 1px;
        left: 1px;
        background: #f5f5f5;
      }
    }

    .tab {
      width: 70px;
      font-size: 14px;
      font-weight: bold;
    }

    .delete{
      font-size: 26px;
    }

    .capslock {
      width: 80px;
      font-size: 14px;
      font-weight: bold;
    }

    .enter {
      width: 77px;
    }

    .shift {
      width: 102px;
      font-size: 14px;
      font-weight: bold;
    }

    .space {
      clear: left;
      width: 681px;
    }

    .shifted {
      position: relative;
      top: 1px;
      left: 1px;
      border-color: #e5e5e5;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .capsed {
      position: relative;
      top: 1px;
      left: 1px;
      border-color: #e5e5e5;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .close{
      color: white;
      width: 23px;
      background-color:#DF153D;
      font-size:22px;
    }
  }
</style>
