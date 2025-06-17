<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="5">
        <el-select @change="sorts(1)"
                   v-model="searchParameter.is_fictitious"
                   placeholder="请选择角色"
                   style="width: 200px; margin-left: 10px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户名" v-model="searchParameter.user_name" @keyup.enter.native="search"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="sorts(1)">搜索</el-button>
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false" @sort-change="sorts">

      <el-table-column label="用户ID" width="80" prop="id"/>
      <el-table-column label="用户账号" prop="user_name"/>
      <el-table-column label="账号类型" width="80" prop="type">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.type ? '' : 'info'">
            {{ scope.row.type == 1 ? '代理' : '会员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可用余额" prop="money_balance" sortable="custom"/>
      <el-table-column label="累积充值" prop="recharge"/>
      <el-table-column label="累计提现" prop="withdrawal"/>
      <el-table-column label="累计下注" prop="t_bet_amt"/>
      <el-table-column label="累计盈亏" prop="t_win_amt"/>
      <!--      <el-table-column label="代理商余额" prop="money_total_agent"  sortable="custom"/>-->
      <el-table-column label="状态" width="100" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{ scope.row.status == 1 ? '正常' : '禁用' }}
          </el-tag>
          <el-switch v-model="scope.row.status" @change="changes(scope.row.status,scope.row,'status')" :active-value="1"
                     :inactive-value="0"></el-switch>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.desc"
          />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <template v-if="allpage>50">
      <el-pagination @current-change="handleCurrentChange"
                     :current-page="1"
                     :page-size="50"
                     layout="total, prev, pager, next, jumper"
                     :total="allpage">
      </el-pagination>
    </template>
  </div>
</template>

<script>
import {getUserSortListApi, getUserStatusApi} from '@/api/userApi'

export default {
  data() {
    return {
      allpage: 1,//总页数
      showItem: 5,//分页显示得中间按钮个数
      current: 1,//当前页
      dvEdit: false,
      dialogTitle: '',
      form: {
        username: '',
        desc: '',
      },
      searchParameter: {
        user_name: undefined,
        sorts: undefined,
      },
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      roleList: [],
      options: [
        {
          value: "0",
          label: "用户"
        },
        {
          value: "1",
          label: "虚拟账号"
        },
        {
          value: "2",
          label: "试玩帐号"
        },
      ],
      value: "",
    };
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    handleCurrentChange: function (index) {
      this.current = index;
      getUserSortListApi({
        page: index,
      }).then(res => {
        this.roleList = res.data.data;
        this.allpage = res.data.total;
      })
    },
    getUserList() {
      getUserSortListApi(this.searchParameter).then(res => {
        this.roleList = res.data.data
        this.allpage = res.data.total;
      })

    },
    sorts(column, prop, order) {
      if (column == 1) {
        this.getUserList();
        return;
      }

      if (column.order == null) {
        this.getUserList();
        return;
      }
      this.searchParameter.name = column.prop;
      this.searchParameter.sort = 'desc';

      if (column.order == "ascending") {
        this.searchParameter.sort = 'asc';
        this.getUserList();
        return;
      } else {
        this.searchParameter.sort = 'desc';
        this.getUserList();
        return;
      }
    },
    showDialog(type) {
      this.dvEdit = true
      this.dialogTitle = type === 'add' ? '新增' : '编辑'
    },
    changes(status, row, type) {
      getUserStatusApi({
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
    onSubmit() {
      this.dvEdit = false
    },
    handleCheckChange(data, checked, indeterminate) {
    },
    handleNodeClick(data) {
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([
          {name: '监控中心'},
          {name: '文章管理'},
          {name: '用户管理'},
          {name: '菜单管理'},
          {name: '个性设置'},
          {name: '异常管理'},
          {name: '系统设置'},
        ]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === 'region1') {
        hasChild = true;
      } else if (node.data.name === 'region2') {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },
    deleteUser(scope) {
      this.$confirm('您确定要删除当前用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        getMarketLevelDelApi({'id': scope.id}).then(res => {
          if (res.code == 1) {
            this.getUserList()
            this.$message({message: res.msg, type: 'success'});
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
