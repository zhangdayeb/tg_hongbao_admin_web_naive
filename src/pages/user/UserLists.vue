<template>
  <div class='page-content'>
    <div slot="top">
      <el-form label-width="90px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="TG ID" v-model="searchParameter.tg_id"></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="TG用户名" v-model="searchParameter.tg_username"></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6" style="float: right; margin-right: 10px;">
            <el-button @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="ID" width="80" prop="id" />
      <el-table-column label="TG ID" width="120" prop="tg_id" />
      <el-table-column label="TG用户名" width="150" prop="tg_username" />
      <el-table-column label="TG名字" width="120" prop="tg_first_name" />
      <el-table-column label="TG姓氏" width="120" prop="tg_last_name" />
      <el-table-column label="创建时间" width="160" prop="create_time" />
      <el-table-column label="邀请码" width="120" prop="invitation_code" />
      <el-table-column label="USDT地址" width="200" prop="usdt_address" />
      <el-table-column label="可用余额" width="120" prop="money_balance" />

      <el-table-column fixed="right" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <template v-if="allpage > 10">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="allpage">
      </el-pagination>
    </template>
  </div>
</template>

<script>
import { getUserListApi, getUserDelApi } from '@/api/userApi'

export default {
  data() {
    return {
      allpage: 1, // 总页数
      current: 1, // 当前页
      roleList: [],
      searchParameter: {
        tg_id: undefined,
        tg_username: undefined,
      },
    };
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    handleCurrentChange: function(index) {
      this.current = index;
      getUserListApi({
        page: index,
        ...this.searchParameter
      }).then(res => {
        this.roleList = res.data.data;
        this.allpage = res.data.total;
      })
    },
    getUserList() {
      getUserListApi(this.searchParameter).then(res => {
        this.roleList = res.data.data
        this.allpage = res.data.total;
      })
    },
    search() {
      this.current = 1;
      this.getUserList()
    },
    deleteUser(scope) {
      this.$confirm('您确定要删除当前用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        getUserDelApi({
          'id': scope.id
        }).then(res => {
          if(res.code == 1){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUserList();
            return;
          }
        })
      }).catch(() => {})
    }
  },
}
</script>

<style lang='scss' scoped>
.page-content {
  width: 100%;
  height: 100%;
}
</style>
