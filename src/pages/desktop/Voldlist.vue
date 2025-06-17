<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="3" :sm="12" :lg="4">
        <el-select v-model="searchTtypeId.table_id" ref="tableSearch" placeholder="请选择台桌" @keyup.enter.native="search">
          <el-option v-for="item in options" :key="item.id" :label="item.table_title" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
        <!-- <el-button @click="showDialog('add','')">新增</el-button> -->
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">

      <el-table-column label="ID" prop="id"/>
      <el-table-column label="台桌名称" prop="table_title"/>
      <el-table-column label="类型" prop="type_name"/>
      <el-table-column label="结果" prop="result"/>
      <!-- <el-table-column label="开牌的数字" prop="result_pai"/> -->
      <el-table-column label="管理员" prop="remark"/>
      <el-table-column label="开牌信息" prop="z" width="150">
        <template slot-scope="scope">
          <span style="color: red;">{{ scope.row.z }}</span>
          <br>
          <span style="color: blue;">{{ scope.row.x }}</span>
        </template>
      </el-table-column>
      <el-table-column label="靴号" prop="xue_number"/>
      <el-table-column label="铺号" prop="pu_number"/>
      <el-table-column label="状态" width="200" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 3" style="color: #aa3ce6"> 作废露珠</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="退回记录" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog(scope.row)">
            退还记录列表
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="退还记录" width="1000px" :visible.sync="dvEdit">
        <tao-table  :data="game_count_all" :showPage="false">
          <el-table-column label="ID" prop="id"/>
          <el-table-column label="用户ID" prop="uid"/>
          <el-table-column label="用户" prop="user_name"/>
          <el-table-column label="变化前金额" prop="money_before" />
          <el-table-column label="变化后金额" prop="money_end"/>
          <el-table-column label="变化金额" prop="money"/>
          <el-table-column label="状态" prop="status"/>
          <el-table-column label="类型" prop="type"/>
          <el-table-column label="备注" prop="mark"/>
        </tao-table>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dvEdit = false">关 闭</el-button>
      </span>
    </el-dialog>
    <template v-if="allpage>10">
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="1"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="allpage">
      </el-pagination>
    </template>
  </div>
</template>

<script>
import {
  getDeskListApi,
  getVoidListApi,
  getVoidRetreatApi,
} from '@/api/DeskApi'

export default {
  data() {
    return {
      allpage: 1,//总页数
      showItem: 5,//分页显示得中间按钮个数
      current: 1,//当前页
      dvEdit: false,
      dialogTitle: '',
      positionKey: [],
      game_count_all:[],
      form: {
        username: '',
        desc: '',
      },
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      roleList: [],
      searchTtypeId: {
        table_id: undefined,
      },
      options: []
    };
  },
  mounted() {
    this.getUserList()
    this.gameTypeList()

  },
  methods: {
    gameTypeList() {
      getDeskListApi({}).then(res => {
        this.options = res.data.data
      })
    },
    handleCurrentChange: function (index) {
      this.current = index;
      this.searchTtypeId.page = index
      this.getUserList()
    },

    getUserList() {
      getVoidListApi(this.searchTtypeId).then(res => {
        this.roleList = res.data.data
        this.allpage = res.data.total;
      })
    },
    /**
     * 表单回车事件
     * **/
    handleFormEnter() {
      this.$refs.formTable.blur();
      this.onSubmit()
    },
    showDialog(row) {
      this.dvEdit = true;
      getVoidRetreatApi(row).then(res => {
        this.game_count_all = res.data
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      // console.log(data);
    },
    search() {
      this.$refs.tableSearch.blur();
      this.getUserList()
    },
    changes(status, row, type) {
      getluZzhuStatusApi({
        id: row.id,
        status: status
      }).then(res => {
        if (res.code == 1) {
          this.$message({message: res.msg, type: 'success'});
        } else {
          this.$message('no');
        }
      })
    },

    // loadNode(node, resolve) {
    //   if (node.level === 0) {
    //     return resolve([
    //       { name: '监控中心' },
    //       { name: '文章管理' },
    //       { name: '用户管理' },
    //       { name: '菜单管理' },
    //       { name: '个性设置' },
    //       { name: '异常管理' },
    //       { name: '系统设置' },
    //     ]);
    //   }
    //   if (node.level > 3) return resolve([]);

    //   var hasChild;
    //   if (node.data.name === 'region1') {
    //     hasChild = true;
    //   } else if (node.data.name === 'region2') {
    //     hasChild = false;
    //   } else {
    //     hasChild = Math.random() > 0.5;
    //   }

    //   setTimeout(() => {
    //     var data;
    //     if (hasChild) {
    //       data = [{
    //         name: 'zone' + this.count++
    //       }, {
    //         name: 'zone' + this.count++
    //       }];
    //     } else {
    //       data = [];
    //     }

    //     resolve(data);
    //   }, 500);
    // },
    deleteUser(scope) {
      this.$confirm('您确定要删除当前用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log(1)
        getluZzhuDelApi({'id': scope.id}).then(res => {
          if (res.code == 1) {
            this.$message({message: res.msg, type: 'success'});
            this.getUserList();
          } else {
            this.$message('no');
          }
        })
      }).catch(() => {
      })
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
