<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <!-- <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户名或昵称"></el-input>
      </el-col> -->
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <!-- <el-button>搜索</el-button> -->
        <el-button @click="showDialog('add')">新增</el-button>
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <!-- <el-table-column label="ID" prop="id"/> -->
      <el-table-column label="name" prop="name"  width="150px"/>
      <el-table-column label="value" prop="value"/>
      <el-table-column label="remark" prop="remark" width="180px"/>

      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
      <el-button v-if="scope.row.name !='app_agent_sale'" type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="name">
          <el-input v-model="form.name" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="value">
          <el-input v-model="form.value" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getConfigListApi, getConfigDelApi,getConfigEditApi,getConfigAddApi} from '@/api/SysConfigApi'
  export default {
    data () {
      return {
        dvEdit: false,
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
        roleList: []
      };
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        getConfigListApi().then(res => {
          this.roleList = res.data
          //this.allpage = res.data.total;
        })
      },


     showDialog(type, row) {
       this.dvEdit = true
       if (type === 'edit') this.form = row;
       if (type === 'add') this.form = {};
       this.dialogTitle = type === 'add' ? '新增' : '编辑'
     },
     onSubmit() {
       if (this.form.id) {
         getConfigEditApi(this.form).then(res => {
           if(res.code == 1){
            this.dvEdit = false
            this.$message(res.msg);
            this.getUserList();
             return;
           }
         })
         return;
       }
       getConfigAddApi(this.form).then(res => {
         if(res.code == 1){
          this.dvEdit = false
          this.$message(res.msg);
          this.getUserList();
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
          getConfigDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                  this.$message(res.msg);
                  this.getUserList();
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
