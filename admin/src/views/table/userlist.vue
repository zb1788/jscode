<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser">添加用户</el-button>
      </el-header>
      <el-header>
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input  placeholder="用户名" @blur.prevent="filterByUsername(username)" v-model="username"></el-input>
          </el-form-item>
          <el-form-item label="角色类型">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
    </el-header>
    <el-main>
    <el-table :data="listnew" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{scope.row.username}}
        </template>
      </el-table-column>
      <el-table-column label="真实名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.truename}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.ifuse|useFilter}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="用户角色" width="110" align="center">
        <template slot-scope="scope">
          <el-tag >{{scope.row.ifadmin| statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="deleteUser(scope.$index,scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-main>
    <el-footer>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changePage"
      :page-size = page.pageSize
      :total="page.total">
    </el-pagination>
    </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getUserList,delUser } from '@/api/userlist'

export default {
  data() {
    return {
      list: null,
      listnew: null,
      listLoading: true,
      options: [{
        value: '1',
        label: '管理员'
      }, {
        value: '0',
        label: '普通用户'
      }],
      value: '',
      username: '',
      page:{
        total: 0,
        pageSize: 2
      },
      a:2,
      b:10
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '普通用户',
        1: '管理员'
      }
      return statusMap[status]
    },
    useFilter(status){
      const statusMap = {
        0: '不可用',
        1: '可用'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData(1, this.page.pageSize)
  },
  methods: {
    fetchData(pageCurrent,pageSize) {
      this.listLoading = true
      const obj = {}
      obj.pageSize = pageSize
      obj.pageCurrent = pageCurrent
      getUserList(obj).then(response => {
        this.list = response.data
        this.listnew = response.data
        this.listLoading = false
        this.page.total = response.total*1
      })
    },
    filterByUsername(username){
      username === ''?this.listnew = this.list:this.listnew = this.list.filter(user => user.username.indexOf(username) >= 0)
      // console.log(this.list.filter(user => user.username == username))
      // this.listnew = this.list.filter(user => user.username == username)
    },
    changePage(pageCurrent){
      this.fetchData(pageCurrent,this.page.pageSize)
    },
    addUser(){
      this.$router.push({ path: '/manageUser/index', query: {type: "add"}})
    },
    edit(id){
      this.$router.push({ path: '/manageUser/editUser', query: {type: "edit",id: id}})
    },
    deleteUser(index,id){
      this.listnew.splice(index,1)
      this.page.total--
      
      const obj = {}
      obj.id = id
      delUser(obj).then(response=>{

      }).catch((error)=>{

      })
    }
  }
}
</script>
