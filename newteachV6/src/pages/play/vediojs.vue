 <template>
    <div class="test_two_box">
        <video
        id="myVideo"
        class="video-js"
        >
        <source
            src="http://rss1zz.zzedu.net.cn:8080/20190213/20190213112504634959212976673/Unit1_Lesson1_%E4%BC%98%E8%AF%BE%E8%A7%86%E9%A2%91%E3%80%90%E5%90%89%E6%9E%97%E7%9C%81%E5%90%89%E6%9E%97%E5%B8%82%E3%80%91h264_1280x720_1400k.mp4?ud=000500226FxcVFRE%3D&ut=0&cd=20190213112504634959212976673&ad=0022620190512150217_0&st=vod&pd=20190213112504634959212976673&ct=0"
            type="video/mp4"
        >
        </video>
    </div>
    </template>

    <script>
    /* eslint-disable */
    export default {
    name: "vediojs",
    data() {
        return {};
    },
    mounted() { 
        this.initVideo();
    },
    methods: {
        initVideo() {
        //初始化视频方法
        let myPlayer = this.$video(myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "400px"
        });
        }
    }
    };
    </script>

    <style scoped>
    </style>
