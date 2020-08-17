<template>
  <div>
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio ref="audio" 
    @pause="onPause"
    @play="onPlay"
    @timeupdate="onTimeupdate" 
    @loadedmetadata="onLoadedmetadata"
    src="http://rss1zz.zzedu.net.cn:9000/material/20140124/20140124091649383875418572351/Unit1Storytime%E5%BD%95%E9%9F%B3_128k.mp3?rcode=ca0ead317ca3bfc3717251384856a8a1657e00932fd74f8bcc43635f96310324&validate_code=ab78a26f193c9e3452c9f33c415353ba&username=00226&flashtype=%E7%94%B3%E6%89%AC%E7%83%81&ad=0022620190512161238_0&st=vod&ct=0&CLIENTIP=218.28.20.138" controls="controls"></audio>

    <!-- 音频播放控件 -->
    <div>
      <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button>

      <el-tag type="info">{{ audio.currentTime | formatSecond}}</el-tag>

      <el-tag type="info">{{ audio.maxTime | formatSecond}}</el-tag>
    </div>
  </div>
</template>

<script>

// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}

export default {
  data () {
    return {
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0
      }
    }
  },
  methods: {
    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play () {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause () {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay () {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause () {
      this.audio.playing = false
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      console.log('timeupdate')
      console.log(res)
      this.audio.currentTime = res.target.currentTime
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      console.log('loadedmetadata')
      console.log(res)
      this.audio.maxTime = parseInt(res.target.duration)
    }
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause(value) {
      return value ? '暂停' : '播放'
    },
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second)
    }
  }
}
</script>

<style>

</style>