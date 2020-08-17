<template>
  <div class="entrance-box">
    <ul class="entrance-ul">
      <li v-for="(item,i) in systemList" :key="i" @click="toPath(item)">
        <img :src="getImageByfileType(item.systemIcon)"/>
        <p>{{item.systemName}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getSubSystemGrant } from '../api/base';
import { mapActions } from 'vuex';
import { USER_ACTION_TYPES } from '../store';
import { openWindow } from '../utils';
let images = [];
export default {
  name: 'SystemEntrance',
  data () {
    return {
      systemList: []
    };
  },
  methods: {
    ...mapActions([
      USER_ACTION_TYPES.MEUN
    ]),
    toPath (item) {
      this.getMenuGrant(item);
    },
    async getMenuGrant (item) {
      let { systemId } = item;
      if (systemId === 'TMS') {
        const data = await this[USER_ACTION_TYPES.MEUN]({ systemId });
        if (data.res.subCode === '200') {
          if (item.systemUrl === 'school' || item.systemUrl === 'border' || item.systemUrl === 'unFinishedTask') {
            const { href } = this.$router.resolve({
              name: item.systemUrl
            });
            openWindow(href);
          }
        }
      } else {
        openWindow(item.systemUrl);
      }
    },
    async getSubSystemGrant () {
      const { data } = await getSubSystemGrant();
      await this.loadFileIcons();
      data.length > 0 && data.map(item => {
        if (item !== null) {
          this.systemList.push(item);
        }
      });
    },
    // 根据文件类型获取图标
    getImageByfileType (fileType) {
      const [image = {}] = images.filter(item => item.type === fileType.split('.')[0]);
      return image.image;
    },
    async loadFileIcons () {
      images = await Promise.all(
        [
          'images/sysImg_CJGL',
          'images/sysImg_crm',
          'images/sysImg_CZDA',
          'images/sysImg_individualization',
          'images/sysImg_jifen',
          'images/sysImg_jspk',
          'images/sysImg_PKGL',
          'images/sysImg_pls',
          'images/sysImg_rds',
          'images/sysImg_rlms',
          'images/sysImg_rms',
          'images/sysImg_sms',
          'images/sysImg_TIS',
          'images/sysImg_tms',
          'images/sysImg_tss',
          'images/sysImg_ub',
          'images/sysImg_task',
          'images/sysImg_border',
          'images/sysImg_OA'
        ].map(async type => {
          return {
            type,
            image: (require(`@/assets/images/${type}.png`))
          };
        })
      );
    }

  },
  created () {
    this.getSubSystemGrant();
  }
};
</script>

<style lang="scss" scoped>
  @import "../assets/style/theme.scss";
  .entrance-box {
    width: 100%;
    height: 100%;
    @include themeify {
      background: themed('color-barkcgournd');
    }
    .entrance-ul {
      padding: 40px 85px;
      display: flex;
      flex-wrap: wrap;
      li{
        width:180px;
        background-color: #fff;
        box-shadow:0px 0px 14px 0px rgba(158,174,190,0.18);
        border-radius:6px;
        text-align: center;
        // padding: 10px;
        margin:0 11.5px 23px 11.5px;
        cursor: pointer;
        /*float: left;*/
        p{
          height: 40px;
          line-height: 40px;
          font-size:18px;
          color: #666;
        }
        img{
           border-radius: 6px 6px 0 0;
        }
      }
      li:hover{
        background:rgba(255,255,255,1);
        @include themeify {
          box-shadow:0px 0px 14px 0px themed('color');
        }
        border-radius:6px;
        p{
          @include themeify {
            color: themed('color');
          }
        }
      }
    }
  }
</style>
