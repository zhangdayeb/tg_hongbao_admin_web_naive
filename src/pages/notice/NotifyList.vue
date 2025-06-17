<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="通知内容" v-model="searchParameter.mark"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
     <el-select v-model="searchParameter.type" style="width:100%" placeholder="通知类型">
       <el-option key="2" label="私人" value="2"></el-option>
       <el-option key="1" label="全体" value="1"></el-option>
      </el-select>
        </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
       <el-button @click="search">搜索</el-button>
        <el-button @click="showDialog('add')">新增</el-button>
      </el-col>
    </el-row>

    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="通知类型" prop="type" width="80px">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.type ? '' : 'info'">
            {{scope.row.type == 1 ? '全体' : '私人'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="相关人员ID" prop="nickname"/>
      <el-table-column label="通知内容" prop="mark" width="500px"/>
      <el-table-column label="创建时间" prop="create_time"/>
  <el-table-column label="状态" prop="status">
     <template slot-scope="scope">
       <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
         {{scope.row.status == 1 ? '正常' : '下架'}}
       </el-tag>
       <el-switch   v-model="scope.row.status" @change="changes(scope.row.status,scope.row)" :active-value="1" :inactive-value="0"></el-switch>
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
      <el-form ref="form" :model="form" label-width="100px">

      <el-form-item label="通知类型">
            <el-radio-group v-model="form.type" size="medium">
              <el-radio  :key="1" :label="1">全体</el-radio>
              <el-radio  :key="2" :label="2">私人</el-radio>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="通知人员ID">
        <el-input v-model="form.unique" placeholder="多人用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="通知内容">
        <el-input v-model="form.mark"></el-input>
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
  console.log(window.atob("YWFh"))
  import {getNotifyListApi,getNotifyStatusApi, getNotifyDelApi,getNotifyAddApi,getNotifyEditApi} from '@/api/NotifyApi'
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
        searchParameter: {
          mork: undefined,
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
      changes(status,row){
          getNotifyStatusApi({
            id:row.id,
            status:status,
            }).then(res => {
          })
      },
      getUserList(){
        getNotifyListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data;
           this.allpage = res.data.total;
        })

      },
     handleCurrentChange:function(index){
               this.current = index;
               getNotifyListApi({
                 page:index,
               }).then(res => {
                 this.roleList = res.data.data;
                 this.allpage = res.data.total;
               })
     },
      search() {
        this.getUserList()
      },
      showDialog(type,row) {
        this.dvEdit = true
        if(type === 'edit') this.form  = row;
         if(type === 'add') this.form  = {};
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
        if(this.form.id){
          getNotifyEditApi(this.form).then(res => {

          if(res.code == 1){
           this.dvEdit = false
           this.$message(res.msg);
           this.handleCurrentChange(this.current);
            return;
          }
          })
          return;
        }
         getNotifyAddApi(this.form).then(res => {
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
          getNotifyDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                 this.$message('删除成功');
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
