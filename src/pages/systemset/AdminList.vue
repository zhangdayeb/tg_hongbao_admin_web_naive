<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户名或昵称"  @keyup.enter.native="search" v-model="searchParameter.user_name"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-select  @change="search" v-model="searchParameter.role" filterable placeholder="角色选择" clearable :style="{width: '100%'}">
          <el-option v-for="item in roleLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
        <el-select  @change="search" v-model="searchParameter.market_level" filterable placeholder="市场等级选择" clearable
          :style="{width: '100%'}">
          <el-option v-for="item in roleLevel" :key="item.id" :label="item.mvalue" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
        <el-button @click="showDialog('add')">新增管理员</el-button>
      </el-col>
    </el-row>


    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="管理员ID" prop="id" width="80"/>
      <el-table-column label="管理员账号" prop="user_name" width="100" />
      <el-table-column label="角色" prop="name" width="100"/>
      <el-table-column label="市场部级别" prop="mvalue" width="100"/>
      <el-table-column label="手机号码" prop="phone" />
      <!-- <el-table-column label="邀请码" prop="invitation_code" width="200"/> -->
      <el-table-column label="google验证码" prop="tg_url_google" width="400"/>


      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
          <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="账号">
          <el-input v-model="form.user_name"  @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-select v-model="form.role" filterable placeholder="请选择" clearable :style="{width: '100%'}">
            <el-option v-for="item in roleLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级ID">
          <el-input v-model="form.pid"  @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pwd"  @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="市场部级别">
          <el-select  @change="onSubmit" v-model="form.market_level" filterable placeholder="请选择" clearable :style="{width: '100%'}">
            <el-option v-for="item in roleLevel" :key="item.id" :label="item.mvalue" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input v-model="form.phone" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <template v-if="allpage>10">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="10"
        layout="total, prev, pager, next, jumper" :total="allpage">
      </el-pagination>
    </template>
  </div>

</template>

<script>
  import {
    getAdminUserListApi,
    getAdminUserDelApi,
    getAdminUserEditApi,
    getAdminUserAddApi
  } from '@/api/AdminUserApi';
  import {
    getRoleListApi
  } from '@/api/RoleApi';
  import {
    getMarketLevelListApi
  } from '@/api/MarketLevelApi';
  export default {
    data() {
      return {
        allpage: 1, //总页数
        showItem: 5, //分页显示得中间按钮个数
        current: 1, //当前页
        searchParameter: {
          user_name: undefined,
          role: undefined,
          market_level: undefined,
        },
        allpage: 1, //总页数
        showItem: 5, //分页显示得中间按钮个数
        current: 1, //当前页
        dvEdit: false,
        dialogTitle: '',
        form: {
          username: '',
          desc: '',
        },
        money_change_type: '',
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        roleList: [],
        roleLists: [],
        roleLevel: [],

      };
    },
    mounted() {
      this.getUserList()
      this.getRoleList()
      this.getRolelevel()

    },
    methods: {
      search() {
        this.getUserList()
      },

      handleCurrentChange: function(index) {
        this.current = index;
        getAdminUserListApi({
          page: index,
        }).then(res => {
          this.roleList = res.data.data;
          this.allpage = res.data.total;
        })
      },
      getUserList() {
        getAdminUserListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },
      getRoleList() {
        getRoleListApi().then(res => {
          this.roleLists = res.data.data

        })
      },

      getRolelevel() {
        getMarketLevelListApi({
          limit: 100
        }).then(res => {
          this.roleLevel = res.data.data
        })
      },

      showDialog(type, row) {
        this.dvEdit = true
        if (type === 'edit') this.form = row;
        if (type === 'add') this.form = [];
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
        if (this.form.id) {
          getAdminUserEditApi(this.form).then(res => {

            if (res.code == 1) {
              this.dvEdit = false
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.handleCurrentChange(this.current);
              return;
            }

          })
          return;
        }
        getAdminUserAddApi(this.form).then(res => {
          if (res.code == 1) {
            this.dvEdit = false
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getUserList();
            return;
          }
        })
      },
      handleCheckChange(data, checked, indeterminate) {},
      handleNodeClick(data) {},
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{
              name: '监控中心'
            },
            {
              name: '文章管理'
            },
            {
              name: '用户管理'
            },
            {
              name: '菜单管理'
            },
            {
              name: '个性设置'
            },
            {
              name: '异常管理'
            },
            {
              name: '系统设置'
            },
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

          getAdminUserDelApi({
            'id': scope.id
          }).then(res => {
            if (res.code == 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.handleCurrentChange(this.current);
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
