<template>
<div>
  <el-table
    border
    :data="data"
    v-loading="loading"
  >
    <el-table-column
      prop="areaname"
      label="区域">
    </el-table-column>
    <el-table-column label="激活人数">
        <el-table-column
          prop="tc"
          label="教师">
        </el-table-column>
        <el-table-column
          prop="sc"
          label="学生">
        </el-table-column>
        <el-table-column
          prop="pc"
          label="家长">
        </el-table-column>
        <el-table-column
          prop="allcount"
          label="汇总">
        </el-table-column>
    </el-table-column>
  </el-table>
  <el-pagination
    style="text-align:right;"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pager.pageNo"
    :page-sizes="[10, 20, 50, 400]"
    :page-size="pager.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pager.total">
  </el-pagination>
</div>
  <!-- <vcom-table
    :columns="columns"
    :data="data"
    @update:checked="handleUpdate"
    :pager.sync="pager"
    :disableRow="(row) => {
      return !Number(row.userstate)
    }"
    :showPagination="showPagination"
    @load="getStuMuti(pager.pageNo)"
    v-loading="loading"
  >
    <template slot="header">
      <vcom-button-column-visible
        class="btn-column-visible"
        :columns.sync="columns"
      />
    </template>
  </vcom-table> -->
</template>

<script type="text/jsx">
import VcomButtonColumnVisible from '../../components/ButtonColumnVisible';
// import VcomVerification from '../../components/VerificationCode'
import { getUserActiveList } from '@/api/area';
export default {
  components: {
    VcomButtonColumnVisible
  },
  props: {
    form: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data () {
    return {
      pager: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      showPagination: false,
      data: [
      ],
      tableRowDetail: {},
      columns: [
        { prop: 'tabName', label: '表名称', minWidth: '150px' },
        { prop: 'tabDescription', label: '表描述', minWidth: '120px' },
        { prop: 'tabDatabase', label: '所属数据库', minWidth: '140px' },
        { prop: 'targetTabName', label: '目标表', minWidth: '140px' }
      ]
    };
  },
  created () {
    this.getStuMuti(this.pager.pageNo);
  },
  methods: {
    // 处理逗号
    // handleDot (item) {
    //   let regx = /^,*|,*$/g
    //   if (item) {
    //     return item.replace(regx, '')
    //   }
    // },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.pager.pageSize = val;
      this.getStuMuti(1);
    },
    handleCurrentChange (val) {
      this.getStuMuti(val);
    },
    handleUpdate (checkeds = []) {
      this.$emit('update:checkedRows', checkeds);
    },
    async getStuMuti (index) {
      console.log('xx');
      this.loading = true;
      this.showPagination = true;
      this.pager.pageNo = index;
      console.log({ ...this.pager, ...this.form });

      const res = await getUserActiveList({ ...this.pager, ...this.form });
      // const res = await getTableList({ ...this.pager, ...this.form });
      console.log(res);
      if (res.code === '200') {
        this.data = res.data.content;
        this.pager.total = res.data.total * 1;
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" >
  @import "../../assets/style/theme";
.btn-column-visible{
  position: absolute;
  right: 12px;
  top: 12px;
}
.student-detail-panel{
  color: #666;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
}
.student-detail-title{
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  padding-top: 10px;
  @include themeify{
    color: themed('color');
  }
}
.student-detail-panel-item{
    margin-left:80px;
  }
</style>
