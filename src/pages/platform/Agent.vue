<template>
  <div class='page-content'>
   <div slot="top">
   </div>

    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <!-- <el-table-column label="ID" width="80" prop="id" /> -->
      <el-table-column label="用户名称" width="120" prop="user_name" />
      <el-table-column label="用户昵称" width="120" prop="nickname" />
<!--      <el-table-column label="推广地址" width="300" prop="tg_url_txt" />-->
<!--       <el-table-column label="业务员ID" width="80" prop="admin" />-->
      <el-table-column label="用户电话" width="120" prop="phone" />
<!--      <el-table-column label="会员等级" width="100" >-->
<!--       <template slot-scope="scope"> {{scope.row.vip_grade}} 级 </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="可用余额" width="100" prop="money_balance">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" >{{scope.row.money_balance}}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="可用授权额度" width="100" prop="points">
        <template slot-scope="scope">
          <el-button type="primary" >{{scope.row.points}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="授权额度" width="100" prop="quota">
        <template slot-scope="scope">
          <el-button type="primary" plain>{{scope.row.quota}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="洗码金额" width="100" prop="money_freeze">
        <template slot-scope="scope">
          <el-button type="warning" plain>{{scope.row.money_freeze}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="占成比例%" width="100" prop="agent_rate" />
      <el-table-column label="洗码率%" width="100" prop="xima_lv" />
      <el-table-column label="账号类型" width="80" prop="type">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.type ? '' : 'info'">
            {{scope.row.type == 1 ? '代理' : '会员'}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.user_name" placeholder="请输入账号(必填)"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pwd" placeholder="请输入密码(不填默认aa123456)"></el-input>
        </el-form-item>
        <el-form-item label="提现密码">
          <el-input v-model="form.withdraw_pwd" placeholder="请输入密码(不填默认aa123456)"></el-input>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-radio-group v-model="form.type" size="medium">
            <el-radio  key="1" label="1">代理</el-radio>
            <el-radio  key="2" label="2">会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称(必填)"></el-input>
        </el-form-item>
        <el-form-item label="业务员ID">
          <el-input v-model="form.market_uid" placeholder="请输入业务员ID(可不填)"></el-input>
        </el-form-item>
        <el-form-item label="可用余额￥">
          <el-input v-model="form.money_balance" readonly="" placeholder="请输入可用余额"></el-input>
        </el-form-item>
        <el-form-item label="冻结金额￥">
          <el-input v-model="form.money_freeze" readonly="" placeholder="请输入冻结余额"></el-input>
        </el-form-item>
        <el-form-item label="占成比例%">
          <el-input v-model="form.agent_rate" readonly="" placeholder="请输入占成比例"></el-input>
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="form.invitation_code" placeholder="请输入邀请码(可不填)"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号(可不填)"></el-input>
        </el-form-item>

       <!-- <el-form-item label="是否虚拟账号">
          <el-input v-model="form.is_fictitious" placeholder="1是 0不是"></el-input>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="infotitle" width="50%" :visible.sync="showRechargeVisible">
      <tao-table style="margin-top: 15px" :data="rechargeList" :showPage="false">
        <el-table-column label="ID" prop="id"  width="50%"/>
        <el-table-column label="用户名称" prop="user_name" />
        <el-table-column label="业务员" prop="admin_name" />
        <el-table-column label="详细类型" prop="status" />
         <el-table-column label="变化前金额" prop="money_before" />
         <el-table-column label="变化后金额" prop="money_end" />
         <el-table-column label="变化金额" prop="money" />
         <el-table-column label="创建时间" prop="create_time" />
      </tao-table>
      <template v-if="allpageRecharge>10">
            <el-pagination @current-change="handleCurrentChangeRecharge" :currentRecharge-page="1" :page-size="10" layout="total, prev, pager, next, jumper"
              :total="allpageRecharge">
            </el-pagination>
          </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="dvEdit = false">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog :title="dialogMoneyTitle" width="500px" :visible.sync="moneyDialogVisible">
      <el-form ref="form" :model="moneyForm" label-width="70px">
        <el-form-item label="变更类型">
          <el-select v-model="money_change_type" style="width:100%" placeholder="请选择">
            <el-option key="1" label="增加" value="1"></el-option>
            <el-option key="2" label="减少" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更金额">
          <el-input v-model="change_money" placeholder="请输入变更金额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onMoneySubmit">确 定</el-button>
      </span>
    </el-dialog>

    <template v-if="allpage>10">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="10" layout="total, prev, pager, next, jumper"
        :total="allpage">
      </el-pagination>
    </template>
  </div>
</template>

<script>
  import {getIsAgentApi,getUserStatusApi,getIsStatusApi,getUserListApi,getUserDelApi,getUserEditApi,getUserAddApi,getMoneyEditApi} from '@/api/userApi'
  import {getMoneyListApi} from '@/api/MoneylogApi'
  export default {
    data() {
      return {
        pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  },
                  shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                      picker.$emit('pick', new Date());
                    }
                  }, {
                    text: '昨天',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24);
                      picker.$emit('pick', date);
                    }
                  }, {
                    text: '一周前',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', date);
                    }
                  }]
                },
                value1: '',
                value2: '',
        allpage: 1, //总页数
        showItem: 5, //分页显示得中间按钮个数
        current: 1, //当前页
        dvEdit: false,
        dialogTitle: '',
        infotitle:'',
        form: {
          username: '',
          desc: '',
        },
        searchParameter: {
          user_name: undefined,
          market_uid: undefined,
          phone: undefined,
          data_time: undefined,
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        roleList: [],
        showRechargeVisible:false,
        rechargeList:[],
        currentRecharge:1,
        allpageRecharge: 1, //总页数
        uid:'',
        status:101,
        money_ststus:90,
        moneyDialogVisible:false,
        dialogMoneyTitle:'编辑可用余额',
        moneyForm:{},
        money_change_type:'',
        change_money:''
      };
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      changes(status,row,type){
        if(type == 'status'){
          getUserStatusApi({
            id:row.id,
             status:status,
            }).then(res => {
          })
          return;
        }
        getIsStatusApi({
            id:row.id,
            }).then(res => {
          })

      },
      showMoneyDialog:function(row,type){
        this.moneyForm = row;
        this.money_change_type = '';
        this.change_money = '';
        this.money_ststus = type;
        if(type == 90){
          this.dialogMoneyTitle = '编辑可用余额';
        }else{
          this.dialogMoneyTitle = '编辑冻结余额';
        }
        this.moneyDialogVisible = true;
      },
      onMoneySubmit:function(){
        //这里要修改方法
        getMoneyEditApi({
          money_change_type: this.money_change_type,
          uid:this.moneyForm.id,
          change_money:this.change_money,
          money_ststus:this.money_ststus//90可用余额   91冻结余额 93 积分
        }).then(res => {
          if(res.code === 1){
            this.moneyDialogVisible = false;
            this.$message({
              message:'操作成功',
              type: 'success'
             });
            this.handleCurrentChange(this.current);
          }
        })
      },
      showRechargeList:function(row,status){
        this.currentRecharge = 1;
        this.uid = row.id;
        this.status = status;
       getMoneyListApi({
         page: this.currentRecharge,
         uid:row.id,
         status:this.status
       }).then(res => {
         this.rechargeList = res.data.data;
         this.allpageRecharge = res.data.total;
         this.infotitle = status === 101 ? '充值详情' : '提现详情';
         this.showRechargeVisible = true;
       })
      },
      handleCurrentChangeRecharge:function(index){
        this.currentRecharge = index;
        getMoneyListApi({
          page: index,
          uid:this.uid,
          status:this.status
        }).then(res => {
          this.rechargeList = res.data.data;
          this.allpageRecharge = res.data.total;
          this.showRechargeVisible = true;
        })
      },
      handleCurrentChange: function(index) {
        this.current = index;
        getIsAgentApi({
          page: index,
        }).then(res => {
          this.roleList = res.data.data;
          this.allpage = res.data.total;
        })
      },
      getUserList() {
        getIsAgentApi().then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },
      search() {
        this.getUserList()
      },
      showDialog(type, row) {
        this.dvEdit = true;
        if(type == 'edit'){
            this.form = row;
            this.form.type=row.type.toString();
        }else{
            let nickname = '新用户'+ Math.round(Math.random()*100000);
            this.form = {
                'type':'1',
                'nickname':nickname,
                'money_balance':0,
                'money_freeze':0,
                'agent_rate':0
            };
        }
        this.dialogTitle = type === 'add' ? '新增用户' : '编辑用户'
      },
      onSubmit() {
        if (this.form.id) {
          getUserEditApi(this.form).then(res => {
            if(res.code == 1){
               this.dvEdit = false
               this.$message({message: res.message,type: 'success'});
               //this.getUserList();
               this.handleCurrentChange(this.current);
                return;
              }
            return;
          })
          return;
        }
        getUserAddApi(this.form).then(res => {
          if(res.code == 1){
           this.dvEdit = false
           this.$message(res.message);
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
          getUserDelApi({
            'id': scope.id
          }).then(res => {
            if(res.code == 1){
             this.$message({message: '删除成功',type: 'success'});
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
