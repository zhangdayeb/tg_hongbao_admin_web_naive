<template>
  <div class='page-content'>
    <div slot="top">
      <el-form label-width="90px">
        <el-row :gutter="20">
<!--          <el-col :xs="24" :sm="12" :lg="3" v-if="auth == 1">-->
<!--            <el-input placeholder="单独查询代理" v-model="searchParameter.agent_name" @keyup.enter.native="search"></el-input>-->
<!--          </el-col>-->
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="用户名" v-model="searchParameter.user_name" @keyup.enter.native="search"></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="业务员名" v-model="searchParameter.market_uid" @keyup.enter.native="search"></el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="手机号" v-model="searchParameter.phone" @keyup.enter.native="search"></el-input>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="5">
            <el-date-picker v-model="searchParameter.start" @change="search" @keydown.enter.capture.native="search" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
            </el-date-picker>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="1">
            <el-date-picker v-model="searchParameter.end" @change="handleEndDate()" @keydown.enter.capture.native="handleEndDate()" format="yyyy-MM-dd HH:mm:ss"   type="date" placeholder="结束日期">
            </el-date-picker>
          </el-col>

        </el-row>
        <el-row :xs="24" :sm="12" :lg="6" style="margin-top: 20px;">
          <el-button @click="search">搜索</el-button>
<!--          <el-button @click="searchAgent(1)">代理</el-button>-->
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="showDialog('add')">新增代理</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.today)">今日</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.yesterday)">昨日</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.week)">本周</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastWeek)">上周</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.month)">本月</el-button>
          <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastMonth)">上月</el-button>
        </el-row>
      </el-form>
    </div>
    <el-table style="margin-top: 15px;" border :data="roleList" :showPage="false">
      <el-table-column label="ID" width="80" prop="id" />
      <el-table-column label="用户名称" width="120" prop="user_name" />
      <el-table-column label="用户昵称" width="120" prop="nickname" />
      <el-table-column label="上级代理" width="80" prop="agent_nickname" />
      <el-table-column label="账号类型" width="80" prop="type">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.type ? '' : 'info'">
            {{scope.row.type == 1 ? '代理' : '会员'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" width="120" prop="phone" />
      <el-table-column label="用户备注" width="80" prop="remarks" />
      <el-table-column label="会员等级" width="100">
        <template slot-scope="scope"> {{scope.row.vip_grade}} 级 </template>
      </el-table-column>
<!--      <el-table-column label="可用余额" width="100" prop="money_balance">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" @click="showMoneyDialog(scope.row,90)">{{scope.row.money_balance}}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="可用授权额度" width="110" prop="points">
        <template slot-scope="scope">
          <el-button type="primary" @click="showMoneyDialog(scope.row,92)">{{scope.row.points}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="授权额度" width="100" prop="quota">
        <template slot-scope="scope">
          <el-button type="primary" plain>{{scope.row.quota}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="洗码金额" width="100" prop="money_freeze">
        <template slot-scope="scope">
<!--          @click="showMoneyDialog(scope.row,91)-->
          <el-button type="warning" plain>{{scope.row.money_freeze}}</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column label="累积充值" width="100" prop="money_total_recharge">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" @click="showRechargeList(scope.row,101)">{{scope.row.money_total_recharge}}-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="累计提现" width="100" prop="money_total_withdraw">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" @click="showRechargeList(scope.row,102)">{{scope.row.money_total_withdraw}}-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="占成比例%" width="100" prop="agent_rate" />
      <el-table-column label="洗码率%" width="100" prop="xima_lv" />
      <el-table-column label="虚拟账号" width="80" prop="is_fictitious">
        <template slot-scope="scope">
          <template v-if="scope.row.is_fictitious == 2">
             试用账号
          </template>
          <template v-else>
            <el-tag size="mini" :type="scope.row.is_fictitious ? '' : 'info'">
              {{scope.row.is_fictitious == 1 ? '是' : '否'}}
            </el-tag>
            <el-switch v-model="scope.row.is_fictitious" @change="changes(scope.row.is_fictitious,scope.row)"
              :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </template>
      </el-table-column>


      <el-table-column label="状态" width="80" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{scope.row.status == 1 ? '正常' : '禁用'}}
          </el-tag>
          <el-switch v-model="scope.row.status" @change="changes(scope.row.status,scope.row,'status')" :active-value="1"
            :inactive-value="0"></el-switch>
        </template>
      </el-table-column>

<!--      <el-table-column label="推广地址" width="200" prop="tg_url_txt" />-->
<!--      <el-table-column label="google验证码" width="400" prop="tg_url_google" />-->
      <el-table-column label="创建时间" width="160" prop="create_time" />
      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="xianHongs(scope.row)">
            限红设置
          </el-button>
         <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
          <el-button type="text" style="color: blue" icon="el-icon-edit" @click="showRecord(scope.row)">
            统计记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.user_name" placeholder="请输入账号(必填)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pwd" placeholder="请输入密码(不填默认aa123456)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="提现密码">
          <el-input v-model="form.withdraw_pwd" placeholder="请输入密码(不填默认123456)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-radio-group v-model="form.type" size="medium">
            <el-radio key="1" label="1">代理</el-radio>
            <el-radio key="2" label="2">会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称(必填)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="业务员ID">
          <el-input v-model="form.market_uid" placeholder="请输入业务员ID(可不填)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="占成比例%">
          <el-input v-model="form.agent_rate" placeholder="请输入占城比例" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="洗码率%">
          <el-input v-model="form.xima_lv" placeholder="请输入洗码率" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="可用余额￥">
          <el-input v-model="form.money_balance" readonly="" placeholder="请输入可用余额" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="冻结金额￥">
          <el-input v-model="form.money_freeze" readonly="" placeholder="请输入冻结余额" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <template v-if="auth == 1">
          <el-form-item label="代理ID" v-if="form.agent_id > 0 && typeEdit == 'edit' ">
            <template v-if="typeEdit == 'edit'" style="margin-right: 20rem;">
              <span>{{form.agent_id}}</span>
            </template>
          </el-form-item>
          <el-form-item label="代理ID"  v-if="typeEdit == 'add'">
            <template>
              <el-input v-model="form.id_code" placeholder="请输入上级代理ID" @keyup.enter.native="onSubmit"></el-input>
            </template>
          </el-form-item>

          <el-form-item label="代理昵称" v-if="form.agent_id > 0 && typeEdit == 'edit'">
            <span>{{form.agent_nickname}}</span>
          </el-form-item>
        </template>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号(可不填)" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" placeholder="请输入备注(可不填)" @keyup.enter.native="onSubmit"></el-input>
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
        <el-table-column label="ID" prop="id" width="50%" />
        <el-table-column label="用户名称" prop="user_name" />
        <el-table-column label="业务员" prop="admin_name" />
        <el-table-column label="详细类型" prop="status" />
        <el-table-column label="变化前金额" prop="money_before" />
        <el-table-column label="变化后金额" prop="money_end" />
        <el-table-column label="变化金额" prop="money" />
        <el-table-column label="创建时间" prop="create_time" />
      </tao-table>
      <template v-if="allpageRecharge>10">
        <el-pagination @current-change="handleCurrentChangeRecharge" :currentRecharge-page="1" :page-size="10"
          layout="total, prev, pager, next, jumper" :total="allpageRecharge">
        </el-pagination>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRechargeVisible = false">取 消</el-button>
        <el-button type="primary" @click="showRechargeVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户统计记录" width="50%" :visible.sync="showRechargeCount">
      <el-row :xs="24" :sm="12" :lg="6" style="margin-top: 20px;">
      <el-col :xs="12" :sm="12" :lg="5">
        <el-date-picker v-model="searchGameCountAll.start" @change="searchGameCount" @keyup.enter.native="searchGameCount" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
        </el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="1">
        <el-date-picker v-model="searchGameCountAll.end" type="date" @change="handleEnd()" @keyup.enter.native="handleEnd()" format="yyyy-MM-dd HH:mm:ss"  placeholder="结束日期">
        </el-date-picker>
      </el-col>
      </el-row>
      <el-row :xs="24" :sm="12" :lg="6" style="margin-top: 20px;">
      <el-button @click="searchGameCount">搜索</el-button>
      </el-row>
      <tao-table style="margin-top: 15px" :data="game_count_all" :showPage="false">
        <el-table-column label="游戏类型" prop="game_name"/>
        <el-table-column label="投注总额" prop="bet_amt" />
        <el-table-column label="输赢合计" prop="win_amt"/>
        <el-table-column label="输金额" prop="transport_bet_amt"/>
        <el-table-column label="赢金额" prop="win_win_amt"/>
        <el-table-column label="总洗码" prop="shuffling_amt"/>
        <el-table-column label="免佣洗码" prop="is_ok_exempt"/>
        <el-table-column label="非免佣洗码" prop="is_no_exempt"/>
      </tao-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="showRechargeCount = false">取 消</el-button> -->
        <el-button type="primary" @click="showRechargeCount = false">关 闭</el-button>
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

    <!-- 限红 -->
    <el-dialog title="限红设置" width="500px" :visible.sync="xianHongVisible">
      <el-form ref="form" :model="form" label-width="120px">
        <!-- <el-form-item label="启用会员限红">
          <el-radio-group v-model="form.is_xian_hong" size="medium">
            <el-radio key="1" label="1">启用</el-radio>
            <el-radio key="0" label="0">暂停</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="限红状态">
          <el-radio-group v-model="form.is_xian_hong" size="medium">
            <el-radio key="1" label="1">开启</el-radio>
            <el-radio key="0" label="0">关闭</el-radio>
          </el-radio-group>
          </el-form-item>
        <span style="color: red;">百家乐</span>
        <el-form-item label="限红闲最少">
          <el-input v-model="form.bjl_xian_hong_xian_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红闲最大">
          <el-input v-model="form.bjl_xian_hong_xian_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄最小">
          <el-input v-model="form.bjl_xian_hong_zhuang_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红庄最大">
          <el-input v-model="form.bjl_xian_hong_zhuang_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>


        <el-form-item label="限红和最小">
          <el-input v-model="form.bjl_xian_hong_he_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红和最大">
          <el-input v-model="form.bjl_xian_hong_he_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄对最小">
          <el-input v-model="form.bjl_xian_hong_zhuang_dui_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红庄对最大">
          <el-input v-model="form.bjl_xian_hong_zhuang_dui_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红闲对最小">
          <el-input v-model="form.bjl_xian_hong_xian_dui_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红闲对最大">
          <el-input v-model="form.bjl_xian_hong_xian_dui_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红幸运6最小">
          <el-input v-model="form.bjl_xian_hong_lucky6_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红幸运6最大">
          <el-input v-model="form.bjl_xian_hong_lucky6_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <hr/>
         <span style="color: red;">龙虎</span>
        <el-form-item label="限红龙最小">
          <el-input v-model="form.lh_xian_hong_long_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红龙最大">
          <el-input v-model="form.lh_xian_hong_long_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红虎最小">
          <el-input v-model="form.lh_xian_hong_hu_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红虎最大">
          <el-input v-model="form.lh_xian_hong_hu_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红和最小">
          <el-input v-model="form.lh_xian_hong_he_min" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红和最大">
          <el-input v-model="form.lh_xian_hong_he_max" type="number" @keyup.enter.native="xianHongSubmit"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="xianHongVisible = false">取 消</el-button>
        <el-button type="primary" @click="xianHongSubmit">确 定</el-button>
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
    getUserStatusApi,
    getIsStatusApi,
    getUserListApi,
    getUserDelApi,
    getUserEditApi,
    getUserAddApi,
    getMoneyEditApi,
    getXianHongApi
  } from '@/api/userApi'
  import {
    getMoneyListApi,
    getWinOrLoseApi
  } from '@/api/MoneylogApi'
  import {
    adminTypeAuth
  } from "@/utils/auth"
  import moment from "moment"
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
        xianHongVisible: false,
        showRechargeCount: false,
        searchGameCountAll:{
          id:0,
          start:'',
          end:''
        },
        xianHong: false,
        dialogTitle: '',
        infotitle: '',
        form: {
          username: '',
          desc: '',
        },
        searchParameter: {
          user_name: undefined,
          market_uid: undefined,
          phone: undefined,
          data_time: undefined,
          start: '',
          end: ''
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        auth: 1,
        count: 1,
        roleList: [],
        game_count_all:[],
        showRechargeVisible: false,
        rechargeList: [],
        currentRecharge: 1,
        allpageRecharge: 1, //总页数
        uid: '',
        status: 101,
        money_ststus: 90,
        moneyDialogVisible: false,
        dialogMoneyTitle: '编辑可用余额',
        moneyForm: {},
        money_change_type: '',
        change_money: '',
        typeEdit: 'add'
      };
    },
    created(){
      let dateType = this.$route.query.dateType ? this.$route.query.dateType : ''
      if(dateType == 'today') {
        let date = new Date()
        this.searchParameter.start = this.$minTool.handleDateType[dateType].start
        this.searchParameter.end = this.$minTool.handleDateType[dateType].end
      }
    },
    mounted() {
      this.searchParameter.type = 1;
      this.getUserList()
      this.auth = adminTypeAuth();
    },
    methods: {
      changes(status, row, type) {
        if (type == 'status') {
          getUserStatusApi({
            id: row.id,
            status: status,
          }).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            });
          })
          return;
        }
        getIsStatusApi({
          id: row.id,
        }).then(res => {})

      },
      /**
       * 设置结束日期
      */
      handleEndDate() {
        this.searchParameter.end = moment(this.searchParameter.end).format('YYYY-MM-DD') + ' 23:59:59'
        this.search()
      },
      /**
       * 设置编辑结束日期
      */
      handleEnd() {
        this.searchGameCountAll.end = moment(this.searchGameCountAll.end).format('YYYY-MM-DD') + ' 23:59:59'
        this.searchGameCount()
      },
      xianHongs: function(row) {
        this.xianHongVisible = true;
        row.is_xian_hong = row.is_xian_hong == null? '0':row.is_xian_hong.toString();
        console.log(row)
          this.form = row;
          if(this.form.is_xian_hong){
               this.form.is_xian_hong = row.is_xian_hong.toString()
          }

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
      xianHongSubmit: function() {
        //这里要修改方法
        getXianHongApi(this.form).then(res => {
          if (res.code === 1) {
            this.xianHongVisible = false;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.handleCurrentChange(this.current);
          }
        })
      },
      showMoneyDialog: function(row, type) {
        this.moneyForm = row;
        this.money_change_type = '';
        this.change_money = '';
        this.money_ststus = type;
        if (type == 90) {
          this.dialogMoneyTitle = '编辑可用余额';
        } else {
          this.dialogMoneyTitle = '编辑代理额度';
        }
        this.moneyDialogVisible = true;

      },
      onMoneySubmit: function() {
        //这里要修改方法
        getMoneyEditApi({
          money_change_type: this.money_change_type,
          uid: this.moneyForm.id,
          change_money: this.change_money,
          money_ststus: this.money_ststus //90可用余额   91冻结余额 93 积分
        }).then(res => {
          if (res.code === 1) {
            this.moneyDialogVisible = false;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.handleCurrentChange(this.current);
          }
        })
      },
      showRechargeList: function(row, status) {
        this.currentRecharge = 1;
        this.uid = row.id;
        this.status = status;
        getMoneyListApi({
          page: this.currentRecharge,
          uid: row.id,
          status: this.status
        }).then(res => {
          this.rechargeList = res.data.data;
          this.allpageRecharge = res.data.total;
          this.infotitle = status === 101 ? '充值详情' : '提现详情';
          this.showRechargeVisible = true;
        })
      },
      resetForm(formName) {
        this.searchParameter =  {
          user_name: undefined,
          market_uid: undefined,
          phone: undefined,
          data_time: undefined,
          start: '',
          end: '',
          type:1,
        },
        this.getUserList()
      },
      handleCurrentChangeRecharge: function(index) {
        this.currentRecharge = index;
        getMoneyListApi({
          page: index,
          uid: this.uid,
          status: this.status
        }).then(res => {
          this.rechargeList = res.data.data;
          this.allpageRecharge = res.data.total;
          this.showRechargeVisible = true;
        })
      },
      handleCurrentChange: function(index) {
        this.current = index;
        this.searchParameter.page = index;
        this.getUserList()
      },
      getUserList() {
        getUserListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },
      showRecord(e){
        this.showRechargeCount = true;
         this.searchGameCountAll =[];
        this.searchGameCountAll.id = e.id;

        getWinOrLoseApi({id:e.id}).then(res => {
          this.game_count_all = res.data;
        })
      },
      searchGameCount(){
        getWinOrLoseApi(this.searchGameCountAll).then(res => {
          this.game_count_all = res.data;
        })
      },
      search() {
        this.searchParameter.page = 1;
        this.getUserList()
      },
      searchAgent(type) {
        this.searchParameter.type = type;
        this.getUserList()
      },
      showDialog(type, row) {
        this.typeEdit = type;
        this.dvEdit = true;
        if (type == 'edit') {
          this.form = row;
          this.form.type = row.type.toString();
        } else {
          let nickname = '新用户' + Math.round(Math.random() * 100000);
          this.form = {
            'type': '1',
            'nickname': nickname,
            'money_balance': 0,
            'money_freeze': 0,
            'agent_rate': 0
          };
        }
        this.dialogTitle = type === 'add' ? '新增用户' : '编辑用户'
      },
      onSubmit() {
        if (this.form.id) {
          getUserEditApi(this.form).then(res => {
            if (res.code == 1) {
              this.dvEdit = false
              this.$message({
                message: '编辑成功',
                type: 'success'
              });
              //this.getUserList();
              this.handleCurrentChange(this.current);
              return;
            }
            return;
          })
          return;
        }

        getUserAddApi(this.form).then(res => {
          if (res.code == 1) {
            this.dvEdit = false
            this.$message({
              message: '新增成功',
              type: 'success'
            });
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
            if (res.code == 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
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
