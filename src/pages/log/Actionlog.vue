<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <!-- <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="代理名称"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button>搜索</el-button>
      <el-button @click="showDialog('add')">新增角色</el-button>
      </el-col> -->
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="管理员ID" prop="admin_uid"/>
      <el-table-column label="IP" prop="ip" width="120"/>
      <el-table-column label="操作方法" prop="action"/>
      <el-table-column label="操作系统" prop="system"  width="500"/>
      <el-table-column label="地区" prop="city"/>
      <el-table-column label="操作内容" prop="mark"/>
      <el-table-column label="操作时间" prop="create_time"/>
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
   import {getActionListApi, getNotifyDelApi} from '@/api/ActionlogApi'
  // import {getActionListApi} from '@/src/api/ActionlogApi'
  export default {
    data () {
      return {
        allpage:1,//总页数
        showItem:5,//分页显示得中间按钮个数
        current:1,//当前页
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
  handleCurrentChange:function(index){
                this.current = index;
                getActionListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getActionListApi:function(index){
                this.current = index;
                getArticleTypeListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getUserList(){
        getActionListApi().then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
          console.log(res.data)
        })

      },
      showDialog(type) {
        this.dvEdit = true
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
        this.dvEdit = false
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
          getAgentDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                  this.getUserList()
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
