<template>
  <div class='page-content'>
   <el-form label-width="90px">
     <el-row :gutter="20">
       <el-col :xs="24" :sm="12" :lg="3">
         <el-input placeholder="用户名" v-model="searchParameter.user_name" @keyup.enter.native="search"></el-input>
       </el-col>
       <el-col :xs="24" :sm="12" :lg="5">
               <el-date-picker
                 v-model="searchParameter.start"
                 type="date"
				 format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd"
                 placeholder="开始日期" @change="search">
               </el-date-picker>
       </el-col>
       <el-col :xs="24" :sm="12" :lg="5">
               <el-date-picker
                 v-model="searchParameter.end"
                 type="date"
				 format="yyyy-MM-dd HH:mm:ss"
                 placeholder="结束日期" @change="handleEndDate()">
               </el-date-picker>
       </el-col>
       <el-col :xs="24" :sm="12" :lg="4">
         <el-select 
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
       <el-row :xs="24" :sm="12" :lg="6" style="float: right; margin-right: 10px;">
         <el-button @click="search">搜索</el-button>
         <el-button type="warning" @click="searchClose(1)" >未结算订单</el-button>
       </el-row>
     </el-row>
     <el-row :gutter="20" style="margin-top: 10px">
        <el-col :xs="24" :sm="12" :lg="20">
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.today)">今日</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.yesterday)">昨日</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.week)">本周</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastWeek)">上周</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.month)">本月</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastMonth)">上月</el-button>
          <el-button type="warning" plain>{{status_name}}</el-button>
        </el-col>
     </el-row>

   </el-form>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">

      <el-table-column label="ID" prop="id"/>
      <el-table-column label="用户ID" prop="user_id"/>
      <el-table-column label="用户账号" prop="user_name"/>
      <!-- <el-table-column label="游戏结果" prop="result" >
      <template slot-scope="scope"  >
         <span type="primary" style="color: blue;" > {{scope.row.result}}</span>
       </template>
      </el-table-column> -->
      <el-table-column label="投注明细" width="120" prop="detail">
      <template slot-scope="scope"  >
          <span type="primary" style="color: blue;" > {{scope.row.detail}}</span>
      </template>
  </el-table-column>
      <el-table-column label="下注金额" prop="bet_amt"/>
      <el-table-column label="下注前金额" prop="before_amt"/>
      <el-table-column label="下注后" prop="end_amt"/>

      <el-table-column label="会员总赢" prop="win_amt">
       <template slot-scope="scope"  >
         <span type="primary" style="color: lightgreen;" v-if="scope.row.win_amt < 0 "> {{scope.row.win_amt}}</span>
         <span type="primary" style="color: black;" v-if="scope.row.win_amt == 0 "> {{scope.row.win_amt}}</span>
         <span type="primary" style="color: red;" v-if="scope.row.win_amt > 0 "> +{{scope.row.win_amt}}</span>
       </template>
      </el-table-column>
			<el-table-column label="免佣" prop="is_exempt">
			 <template slot-scope="scope"  >
			   <span type="primary" v-if="scope.row.is_exempt == 0 "> 正常</span>
				 <span type="primary" v-if="scope.row.is_exempt == 1 "> 免佣</span>
			 </template>
			</el-table-column>
      <el-table-column label="洗码量" prop="shuffling_num"/>
      <el-table-column label="洗码率" prop="shuffling_rate"/>
      <el-table-column label="洗码费" prop="shuffling_amt"/>
      <el-table-column label="游戏记录ID(露珠)" width="120" prop="lu_zhu_id"/>
      <el-table-column label="变化金额" prop="delta_amt"/>
      <el-table-column label="牌桌NUM" prop="table_id"/>
      <el-table-column label="靴号" prop="xue_number"/>
      <el-table-column label="铺号" prop="pu_number"/>
      <el-table-column label="游戏类型" prop="type_name"/>
      <!-- <el-table-column label="结束状态" prop="close_status_text"/> -->
      <el-table-column label="结束状态" width="100" prop="close_status_text" >
        <template slot-scope="scope">
          <span type="primary" style="color: red;">{{scope.row.close_status_text}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下注时间" prop="created_at"/>
      <el-table-column label="代理计算状态" prop="agent_status"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">

          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
            <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
          <el-button type="warning" plain @click="unsettledRetreat_v2(scope.row)" v-if="scope.row.close_status == 1">
            未结算退还
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="600px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="下注金额">
          <el-input v-model="form.bet_amt" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="下注前金额">
          <el-input v-model="form.before_amt" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      <el-form-item label="下注后金额">
          <el-input v-model="form.end_amt" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>


      <el-form-item label="投注明细">
          <el-input v-model="form.detail" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      <el-form-item label="会员总赢">
          <el-input v-model="form.win_amt" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      <el-form-item label="洗码量">
          <el-input v-model="form.shuffling_num" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="洗码率">
          <el-input v-model="form.shuffling_rate" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      <el-form-item label="洗码费">
          <el-input v-model="form.shuffling_amt" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="游戏结果">
            <el-input v-model="form.result" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>

          <el-form-item label="变化金额">
            <el-input v-model="form.delta_amt" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>

      <el-form-item label="牌桌ID">
        <el-input v-model="form.table_id" type="number" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>

      <el-form-item label="靴号">
        <el-input v-model="form.xue_number" type="number" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>

      <el-form-item label="铺号">
        <el-input v-model="form.pu_number" type="number" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>

      <el-form-item label="结束状态">
            <el-radio-group v-model="form.close_status" size="medium">
              <el-radio  :key="1" :label="1">待开牌</el-radio>
              <el-radio  :key="2" :label="2">已结算</el-radio>
              <el-radio  :key="3" :label="3">台面作废</el-radio>
              <el-radio  :key="4" :label="4">修改结果</el-radio>
            </el-radio-group>
      </el-form-item>

      <el-form-item label="代理计算状态">
            <el-radio-group v-model="form.agent_status" size="medium">
              <el-radio  :key="1" :label="1">已结算</el-radio>
              <el-radio  :key="2" :label="2">未结算</el-radio>

            </el-radio-group>
      </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle_xiazhu" width="500px" :visible.sync="Edit_xiazhu">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="请输入密码">
          <el-input v-model="Edit_xiazhu_mima" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="Edit_xiazhu = false">取 消</el-button>
        <el-button type="primary" @click="unsettledRetreat_do">确 定</el-button>
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
  import {getRecordsListApi,getRecordsDelApi,getRecordsEditApi,getRecordsRetreatApi} from '@/api/DeskApi'
  import moment from "moment"
  export default {
    data () {
      return {
        Edit_xiazhu:false,
        Edit_xiazhu_mima:'',
        Edit_xiazhu_id:'',
        dialogTitle_xiazhu: '',

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
        searchParameter: {
          user_name: undefined,
          start: '',
          end: '',
          status: undefined,
        },
        count: 1,
        roleList: [],
        status_name:'',
      };
    },
    created(){
      let dateType = this.$route.query.dateType ? this.$route.query.dateType : ''
      if(dateType == 'today') {
        this.searchParameter.start = this.$minTool.handleDateType[dateType].start
        this.searchParameter.end = this.$minTool.handleDateType[dateType].end
      }
    },
    mounted() {

      this.getUserList()
    },
    methods: {

      searchClose(status){
        this.searchParameter.status = status;
          this.getUserList()
      },
      /**
       * 设置结束日期
      */
      handleEndDate() {
        this.searchParameter.end = moment(this.searchParameter.end).format('YYYY-MM-DD') + ' 23:59:59'
        this.search()
      },
      /**
       * 设置时间
       * @param dateType 日期类型
       * **/
      handSearchType(dateType) {
        this.searchParameter.start = this.$minTool.handleDateType[dateType].start
        this.searchParameter.end = this.$minTool.handleDateType[dateType].end
        this.getUserList()
      },
      unsettledRetreat_v2(row){
        this.Edit_xiazhu = true;
        this.Edit_xiazhu_id = row.id
        this.Edit_xiazhu_mima = ''
        this.dialogTitle_xiazhu = '返还下注'
      },
      unsettledRetreat_do(){
        this.Edit_xiazhu = false;
        getRecordsRetreatApi({id:this.Edit_xiazhu_id,pwd:this.Edit_xiazhu_mima}).then(res => {
          if(res.code == 1){
            this.getUserList()
            this.$message({message:res.msg,type: 'success'});
          }
        })
      },
      unsettledRetreat(row){
        this.$confirm('您确定要退还当前订单吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          getRecordsRetreatApi({id:row.id}).then(res => {
            if(res.code == 1){
              this.getUserList()
              this.$message({message:res.msg,type: 'success'});
            }
          })
        }).catch(() => {})

      },
      handleCurrentChange:function(index){
               this.current = index;
               this.searchParameter.page = index;
               this.getUserList()
      },
      getUserList(){
        if(this.$route.query.id >0){
          this.searchParameter.id = this.$route.query.id
        }
        getRecordsListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
           console.log(res)
          this.status_name = '下注：'+res.data.money.t_bet_amt+' 盈亏：'+res.data.money.t_win_amt
        })

      },
      showDialog(type,row) {
       this.det=true;
       this.imageList = [];
       if (type == 'edit') {
         this.form = row;
       } else {
         this.imageList = [];
         this.form = {};
       }
       this.dialogTitle = type === 'add' ? '新增' : '编辑'
       this.dvEdit = true;
      },
      onSubmit() {
        if (this.form.id) {
          getRecordsEditApi(this.form).then(res => {
            if(res.code == 1){
             this.dvEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.getUserList();
              return;
            }
          })
          return;
        }
        // getDeskAddApi(this.form).then(res => {
        //   if(res.code == 1){
        //    this.dvEdit = false
        //    this.$message({message:res.msg,type: 'success'});
        //    this.getUserList();
        //     return;
        //   }
        // })
      },
      search() {
        this.getUserList()
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
          getRecordsDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                  this.getUserList()
                  this.$message({message:res.msg,type: 'success'});
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
