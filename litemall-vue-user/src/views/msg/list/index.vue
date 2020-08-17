<template>
  <div>
    <van-collapse :accordion="true" v-model="activeNames">
      <van-collapse-item :title="issue.title" :name="index" v-for="(issue, index) in issueList" :key="index">
        {{issue.content}}  
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant';
import { issueList } from '@/api/api';

export default {
  data() {
    return {
      activeNames: [-1],
      issueList: []
    };
  },
  created() {
    this.getIssueList();
  },
  methods: {
    getIssueList() {
      // issueList().then(res => {
      //   this.issueList = res.data.data.list
      // })
      for(let i=0;i<20;i++){
        let obj = {};
        obj.title = i+"标题";
        obj.content = i+"内容内容内容内容内内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容容内容内容内容内容内容";
        this.issueList.push(obj);
      }
    }
  },

  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem
  }
};
</script>