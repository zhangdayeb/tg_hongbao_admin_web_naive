<template>
  <div class='page-content'>
    <el-row :gutter="20">
     <el-col :xs="24" :sm="12" :lg="4">
          <el-input placeholder="订单号" v-model="searchParameter.pay_no" @keyup.enter.native="search"></el-input>
       </el-col>
       <el-col :xs="24" :sm="12" :lg="4">
            <el-input placeholder="用户名" v-model="searchParameter.user_name" @keyup.enter.native="search"></el-input>
         </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
         <el-button @click="search">搜索</el-button>
      <!-- <el-button @click="showDialog('add')">新增</el-button> -->
      </el-col>
   </el-row>

  <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="用户名称" prop="user_name"/>
      <el-table-column label="业务员" prop="market_name"/>
      <el-table-column label="订单号" prop="pay_no"/>
      <el-table-column label="支付金额" prop="pay_price"/>
      <el-table-column label="订单状态" prop="status"/>
      <el-table-column label="支付状态" prop="pay_status"/>
      <el-table-column label="创建时间" prop="create_time"/>
      <el-table-column label="支付时间" prop="pay_time"/>
      <el-table-column label="订单描述" prop="describe_order"/>
      <el-table-column label="订单渠道" prop="pay_channel"/>
      <el-table-column label="IP" prop="ip"/>
      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            订单状态编辑
          </el-button>
        <!-- <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

<el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
     <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="订单状态">
            <el-radio-group v-model="form.status" size="medium">
              <el-radio  :key="3" :label="3">已发货</el-radio>
              <el-radio  :key="6" :label="6">已签收</el-radio>
            </el-radio-group>
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
    import {getOrderListApi,getOrderEditApi} from '@/api/OrderApi'
  export default {
    data () {
      return {
        searchParameter: {
          // agent_account: undefined,
        },
        allpage:1,//总页数
        showItem:5,//分页显示得中间按钮个数
        current:1,//当前页
        dvEdit: false,
        dialogTitle: '',
        form: {},
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
          getAgentStatusApi({
            id:row.id,
            status:status,
            }).then(res => {
              if(res.code == 1){
                  this.$message({message:res.msg,type: 'success'});
                  return;
             }
          })
      },
     handleCurrentChange:function(index){
               this.current = index;
               getOrderListApi({
                 page:index,
               }).then(res => {
                 this.roleList = res.data.data;
                 this.allpage = res.data.total;
               })
           },
     getUserList(){
      console.log()
        if(this.$route.query.id >0){
          this.searchParameter.id = this.$route.query.id
        }
       getOrderListApi(this.searchParameter).then(res => {
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

        this.dialogTitle = type === 'add' ? '新增' : '订单状态编辑'
      },
      onSubmit() {
        if(this.form.id){
          getOrderEditApi(this.form).then(res => {

            if(res.code == 1){
             this.dvEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.handleCurrentChange(this.current);
              return;
            }
            this.$message(res.message);
          })
          return;
        }
         getOrderAddApi(this.form).then(res => {
            if(res.code == 1){
             this.dvEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.getUserList();
              return;
            }
            this.$message(res.message);
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
          getMarketLevelDelApi({'id':scope.id}).then(res=>{
               if(res.code == 1){
                this.$message({message:'删除成功',type: 'success'});
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
