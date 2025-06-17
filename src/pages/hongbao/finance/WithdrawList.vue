<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户名称" v-model="searchParameter.user_name"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4">
      <el-select v-model="searchParameter.status" style="width:100%" placeholder="状态选择">
        <el-option key="3" label="已拒绝" value="2"></el-option>
        <el-option key="1" label="已提现" value="1"></el-option>
        <el-option key="2" label="审核中" value="0"></el-option>
      </el-select>
        </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
      </el-col>
    </el-row>

    <el-table style="margin-top: 15px" border  :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="用户ID" prop="user_name"/>
      <el-table-column label="提现金额" prop="money"/>
      <el-table-column label="手续费" prop="money_fee"/>
      <el-table-column label="实际到账金额" prop="momey_actual"/>
      <el-table-column label="用户余额" prop="money_balance"/>
      <el-table-column label="状态" prop="text" style="color: red;"/>
      <el-table-column label="提现时间" prop="create_time"/>
      <el-table-column label="到账时间" prop="success_time"/>
      <el-table-column label="管理员ID" prop="admin_name"/>
      <el-table-column label="备注" prop="msg"/>
      <el-table-column label="用户地区" prop="u_city"/>
      <el-table-column label="支付方式" prop="pay_type"/>
      <el-table-column label="收款银行" prop="u_bank_name"/>
      <el-table-column label="收款账号" prop="u_back_card"/>
      <el-table-column label="收款名" prop="u_back_user_name"/>
      <el-table-column label="业务员" prop="market_name"/>
      <el-table-column label="用户IP" prop="u_ip"/>
      <el-table-column fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
              提现确认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="80px">
         <el-form-item label="订单状态">
             <el-radio-group v-model="form.status" size="medium">
               <el-radio  :key="1" label="1">提现成功</el-radio>
               <el-radio  :key="2" label="2">拒绝提现</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item label="拒绝理由">
             <el-input v-model="form.msg" placeholder="请拒绝理由(拒绝时候填写)"></el-input>
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
   import {getPayListApi,gettPayStatusApi} from '@/api/MoneylogApi'
  export default {
    data () {
      return {
        allpage:1,//总页数
        showItem:5,//分页显示得中间按钮个数
        current:1,//当前页
        dvEdit: false,
        dialogTitle: '',
        money_change_type:'',
        form: {

        },

        searchParameter: {
          user_name: undefined,
          status: undefined,
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
          gettPayStatusApi({
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
                getPayListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      // getMoneyListApi:function(index){
      //           this.current = index;
      //           getArticleTypeListApi({
      //             page:index,
      //             status:201
      //           }).then(res => {
      //             this.roleList = res.data.data;
      //             this.allpage = res.data.total;
      //           })
      // },
      getUserList(){
        getPayListApi({status:this.searchParameter.status,'user_name': this.searchParameter.user_name}).then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
          console.log(res.data)
        })

      },
      search() {
        this.getUserList()
      },
      showDialog(type,row) {
        this.dvEdit = true
      if(type == 'edit'){
            this.form = row;
            this.form.status=row.status.toString();
        }

        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
        this.dvEdit = false
      gettPayStatusApi(this.form).then(res => {
            if(res.code == 1){
               this.$message({message: '修改成功',type: 'success'});
               this.dvEdit = false
               this.handleCurrentChange(this.current);
                return;
              }
            return;
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
          getAgentDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                  this.$message({message:'删除成功',type: 'success'});
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
