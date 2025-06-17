<template>
  <div class='page-content'>
    <el-row :gutter="20">

      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
     <el-button @click="showDialog('add')">新增角色</el-button>
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id" width="100px"/>
      <el-table-column label="角色名" prop="name"/>
      <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
                {{scope.row.status == 1 ? '正常' : '冻结'}}
              </el-tag>
              <el-switch   v-model="scope.row.status" @change="changes(scope.row.status,scope.row)" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="权限分配" width="200px">
            <template slot-scope="scope">
              <el-button type="text"  style="color:green" icon="el-icon-edit" @click="branchMeun(scope.row)">
                菜单分配
              </el-button>
              <el-button type="text" style="color:green" icon="el-icon-edit" @click="branchAction(scope.row)">
                控制器分配
              </el-button>
            </template>
          </el-table-column>

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
        <el-form-item label="角色名">
          <el-input v-model="form.name"  @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="菜单权限分配" width="50%" :visible.sync="branchEdit">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名">
          <el-input v-model="form.name" disabled=""  @keyup.enter.native="ASubmit"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.action" style="width: 100%;" multiple placeholder="请选择">
              <el-option
                v-for="item in actionlist"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="ASubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="控制器权限分配" width="50%" :visible.sync="MeuwEdit">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名">
          <el-input v-model="form.name" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.menus" style="width: 100%;" multiple placeholder="请选择">
              <el-option
                v-for="item in menulist"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="MSubmit">确 定</el-button>
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
  import {getRoleListApi,getRoleAddApi,getRoleDelApi,getRoleEditApi,getRoleStatusApi} from '@/api/RoleApi';
  import {getAuthActionListApi,getAuthMenuListApi,getAuthActionEditApi,getAuthMenuEditApi} from '@/api/AuthApi';
  export default {
    data () {
      return {
        allpage:1,//总页数
        showItem:5,//分页显示得中间按钮个数
        current:1,//当前页
        dvEdit: false,
        branchEdit: false,
        MeuwEdit: false,
        dialogTitle: '',
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
        title:[],
        actionlist: [],
        menulist: []
      };
    },
    mounted() {
      this.getUserList()

    },
    methods: {
      handleCurrentChange:function(index){
                this.current = index;
                getRoleListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getUserList(){
        getRoleListApi().then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        }),
        //调菜单列表
        getAuthActionListApi().then(res => {
             this.actionlist = res.data;
         }),
         //调控制器列表
         getAuthMenuListApi().then(res => {
              this.menulist = res.data;
          })
      },

    branchAction(row){
        this.branchEdit = true
        this.form  = row;
    },
    branchMeun(row){
        this.MeuwEdit = true
        this.form  = row;
    },

    changes(status,row){
           getRoleStatusApi({
            id:row.id,
            status:status,
            }).then(res => {
            if(res.code == 1){
               this.$message({message:res.msg,type: 'success'});
                return;
              }
          })
      },
      showDialog(type,row) {
        this.dvEdit = true
        if(type === 'edit') this.form  = row;
         if(type === 'add') this.form  = {};
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
        //this.dvEdit = false
        if(this.form.id){
          getRoleEditApi(this.form).then(res => {

          if(res.code == 1){
            this.dvEdit = false
           this.$message({message:res.msg,type: 'success'});
             this.handleCurrentChange(this.current);
            return;
          }
          })
          return;
        }
           getRoleAddApi(this.form).then(res => {
           if(res.code == 1){
             this.dvEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.getUserList();
             return;
           }
         })
      },

      ASubmit() {
        this.branchEdit = false
           getAuthActionEditApi(this.form).then(res => {
            if(res.code == 1){
              this.branchEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.handleCurrentChange(this.current);
              return;
            }
         })
      },
      MSubmit() {
        this.MeuwEdit = false
           getAuthMenuEditApi(this.form).then(res => {
            if(res.code == 1){
              this.branchEdit = false
              this.$message({message:res.msg,type: 'success'});
              this.handleCurrentChange(this.current);
              return;
            }
         })
      },

      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        // console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([
            { name: '监控中心' },
            { name: '文章管理' },
            { name: '用户管理' },
            { name: '菜单管理' },
            { name: '个性设置' },
            { name: '异常管理' },
            { name: '系统设置' },
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

          getRoleDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                 this.$message({message:res.msg,type: 'success'});
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
