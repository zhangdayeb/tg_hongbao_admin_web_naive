<template>
  <div class='page-content'>
    <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="3">
            <el-input placeholder="用户名" v-model="searchParameter.user_name" @keyup.enter.native="search"></el-input>
          </el-col>
      <el-col :xs="24" :sm="12" :lg="5" >
        <el-date-picker v-model="searchParameter.start" @change="search" @keydown.enter.capture.native="search" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
        </el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="5">
        <el-date-picker v-model="searchParameter.end" @change="handleEndDate()" @keydown.enter.capture.native="handleEndDate()" format="yyyy-MM-dd HH:mm:ss"  type="date" placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <el-button @click="search">搜索</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.today)">今日</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.yesterday)">昨日</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.week)">本周</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastWeek)">上周</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.month)">本月</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastMonth)">上月</el-button>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">

      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
     <el-button @click="showDialog('add')">新增菜单</el-button>
      </el-col>
    </el-row> -->

    <tao-table style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="用户ID" prop="id" min-width="100"/>
      <el-table-column label="用户名称" prop="user_name"/>
      <el-table-column label="下级总洗码" prop="shuffling_num"/>
      <el-table-column label="免佣洗码" prop="is_ok_shuffling_num"/>
      <el-table-column label="非免佣洗码" prop="is_no_shuffling_num"/>
      <el-table-column label="下级总输赢" prop="win_amt"/>
      <el-table-column label="下级总下注" prop="bet_amt"/>
      <el-table-column label="上级代理" prop="agent_name"/>
      <el-table-column label="累计洗码费" prop="money_freeze"/>
      <el-table-column label="洗码率（%）" prop="xima_lv"/>
      <el-table-column label="占成比例（%）" prop="agent_rate"/>
      <el-table-column label="账号类型" width="80" prop="type">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.type ? '' : 'info'">
            {{scope.row.type == 1 ? '代理' : '会员'}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="status"  v-if="admin_type == 1">
            <template slot-scope="scope">
              <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
                {{scope.row.status == 1 ? '正常' : '冻结'}}
              </el-tag>
              <el-switch   v-model="scope.row.status" @change="changes(scope.row.status,scope.row)" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
     <el-table-column fixed="right" label="操作" width="100px" v-if="admin_type == 1" >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            用户信息
          </el-button>
         <!-- <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </tao-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.user_name" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" readonly="" ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.type" readonly="" v-if="form.type == 1">代理</el-input>
          <el-input v-model="form.type" readonly=""  v-if="form.type == 2">会员</el-input>
        </el-form-item>
        <el-form-item label="业务员ID">
          <el-input v-model="form.market_uid" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="占成比例%">
          <el-input v-model="form.agent_rate" readonly=""></el-input>
        </el-form-item>
       <el-form-item label="洗码率%">
          <el-input v-model="form.xima_lv" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="可用余额￥">
          <el-input v-model="form.money_balance" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="冻结金额￥">
          <el-input v-model="form.money_freeze" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" readonly=""></el-input>
        </el-form-item>
      </el-form>
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
  import {getRelevantListApi,getUserStatusApi,getUserInfoApi } from '@/api/userApi';
  import moment from "moment"
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
        roleList: [],
        admin_type:2,
        searchParameter: {
          start: '',
          end: '',
          user_name:''
        }
      };
    },
    created(){
      let dateType = this.$route.query.dateType ? this.$route.query.dateType : ''
      if(dateType == 'today' ) {
          this.searchParameter.start = this.$minTool.handleDateType[dateType].start
          this.searchParameter.end = this.$minTool.handleDateType[dateType].end
      }
    },
    mounted() {
      this.admin_type = localStorage.getItem('admin_type');
      this.getUserList()

    },
    methods: {
      handleCurrentChange:function(index){
        this.current = index;
        getRelevantListApi({
          page:index,
          ...this.searchParameter
        }).then(res => {
          this.roleList = res.data.data;
          this.allpage = res.data.total;
        })
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
      search(){
        this.getUserList()
      },
      getUserList(){
        getRelevantListApi({
          start: this.searchParameter.start,
          end: this.searchParameter.end,
           user_name: this.searchParameter.user_name
        }).then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },

    changes(status,row){
           getUserStatusApi({
            id:row.id,
            status:status,
            }).then(res => {
              this.$message({message:res.msg,type: 'success'});
          })
      },
      showDialog(type,row) {
        this.dvEdit = true
        getUserInfoApi({
          id:row.id,
          }).then(res => {
            this.form  = res.data;
             console.log(this.form)
        })

        return;
        if(type === 'edit') this.form  = row;
         if(type === 'add') this.form  = {};
        this.dialogTitle = type === 'add' ? '新增' : '用户信息'
      },
      onSubmit() {
        //this.dvEdit = false
        if(this.form.id){
          getMenuEditApi(this.form).then(res => {

              if(res.code == 1){
               this.dvEdit = false
              this.$message({message:res.msg,type: 'success'});
             this.handleCurrentChange(this.current);
                return;
              }
          })
          return;
        }
           getMenuAddApi(this.form).then(res => {
            if(res.code == 1){
              this.dvEdit = false
              this.$message({message:res.msg,type: 'success'});
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

          getMenuDelApi({'id':scope.id}).then(res=>{
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
