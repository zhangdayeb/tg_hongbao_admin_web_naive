<template>
  <div class='page-content'>
    <el-row :gutter="5" class="page-content-condition" type="flex">
      <el-col :span="3">
        <el-select v-model="searchTtypeId.game_type" ref="tableSearch" placeholder="请选择游戏类型" @keyup.enter.native="getTable()" @change="gameTypeList()">
          <el-option v-for="item in gameList" :key="item.gameType" :label="item.name" :value="item.gameType">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="searchTtypeId.table_id" ref="tableSearch" placeholder="请选择台桌" @keyup.enter.native="search">
          <el-option v-for="item in options" :key="item.id" :label="item.table_title" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <!-- 在现有的搜索行中添加 -->
<el-col :span="3">
  <el-input placeholder="靴号" v-model="searchTtypeId.xue" clearable></el-input>
</el-col>
<el-col :span="3">
  <el-input placeholder="铺号" v-model="searchTtypeId.pu" clearable></el-input>
</el-col>
    
      <el-col :span="4">
        <el-button class="page-content-btn" @click="search">搜索</el-button>
      </el-col>

    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">

      <el-table-column label="ID" prop="id"/>
      <el-table-column label="台桌名称" prop="table_title"/>
      <el-table-column label="类型" prop="type_name"/>
      <el-table-column label="结果" prop="result"/>
      <!-- <el-table-column label="开牌的数字" prop="result_pai"/> -->
      <el-table-column label="开牌信息" prop="z" width="150">
        <template slot-scope="scope">
          <span style="color: red;">{{ scope.row.z }}</span>
          <br>
          <span style="color: blue;">{{ scope.row.x }}</span>
        </template>
      </el-table-column>
      <el-table-column label="靴号" prop="xue_number"/>
      <el-table-column label="铺号" prop="pu_number"/>
      <el-table-column label="运行状态" width="200" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{ scope.row.status == 1 ? '是' : '否' }}
          </el-tag>
          <el-switch v-model="scope.row.status" @change="changes(scope.row.status,scope.row)" :active-value="1"
                     :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
          <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
          <el-button type="warning" plain @click="unsettledRetreat_v2('edit_luzhu',scope.row)" v-if="scope.row.status == 1">
            露珠作废结算
          </el-button>
<!--          <el-button type="warning" plain @click="unsettledRetreat(scope.row)" v-if="scope.row.status == 1">
            露珠作废结算
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="	选择台桌">
          <el-select ref="formTable" v-model="form.table_id" placeholder="请选择台桌"
                     @keyup.enter.native="handleFormEnter()">
            <el-option v-for="item in options" :key="item.id" :label="item.table_title+'   ('+item.type_name+')'"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏类型">
          <el-input value="游戏类型会根据台桌自动生成" disabled="" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="结果">
          <el-input v-model="form.result" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="开牌的数字">
          <el-input v-model="form.result_pai" type="number" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="靴号">
          <el-input v-model="form.xue_number" type="number" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="铺号">
          <el-input v-model="form.pu_number" type="number" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogTitle_luzhu" width="500px" :visible.sync="Edit_luzhu">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="请输入密码">
          <el-input v-model="Edit_luzhu_mima" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="Edit_luzhu = false">取 消</el-button>
        <el-button type="primary" @click="sendLuZhuSubmit">确 定</el-button>
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
import {
  getluZzhuListApi,
  getDeskListApi,
  getluZzhuAddApi,
  getluZzhuEditApi,
  getluZzhuStatusApi,
  getluZzhuDelApi,
  getRetreatApi,
  getDesktopTableApi,
  getPrintListApi
} from '@/api/DeskApi'
import {  baseUrl} from "@/utils/config.js"
import moment from "moment"
export default {
  data() {
    return {
      allpage: 1,//总页数
      showItem: 5,//分页显示得中间按钮个数
      current: 1,//当前页
      dvEdit: false,
      Edit_luzhu:false,
      Edit_luzhu_mima:'',
      Edit_luzhu_id:'',
      dialogTitle_luzhu: '',
      dialogTitle: '',
      positionKey: [],
      form: {
        username: '',
        desc: '',
      },
      //游戏类型列表
      gameList: [{
        name: '百家乐',
        gameType: '3'
      },{
        name: '龙虎',
        gameType: '2'
      },{
        name: '牛牛',
        gameType: '6'
      },{
        name: '三公',
        gameType: '8'
      }],
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      roleList: [],
      searchTtypeId: {
        game_type: '',
        table_id: '',
        xue: '',
        pu: '',
        start: '',
        end: ''
      },
      options: []
    };
  },
  created() {
    this.searchTtypeId.game_type = this.gameList[0].gameType
  },
  mounted() {
    this.getUserList()
    this.gameTypeList()

  },
  methods: {
    gameTypeList() {
      getDesktopTableApi({game_type: this.searchTtypeId.game_type}).then(res => {
        this.options = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },

    getPrintList() {
      if(this.searchTtypeId.game_type.trim().length < 1) {
        this.$message({message:'请选择游戏类型', type: 'warning'});
        return
      }
      if(this.searchTtypeId.table_id.length < 1) {
        this.$message({message:'请选择游戏桌号', type: 'warning'});
        return
      }
      if(this.searchTtypeId.xue.trim().length < 1) {
        this.$message({message:'请选择游戏靴号', type: 'warning'});
        return
      }
      if(this.searchTtypeId.pu.trim().length < 1) {
        this.$message({message:'请选择游戏铺号', type: 'warning'});
        return
      }
      let tableName = ''
      this.options.forEach(el => {
        if(el.id == this.searchTtypeId.table_id) {
          tableName = el.table_title
        }
      })

      let url = `${baseUrl}/static/luzhu/pc_only.html?gameType=${this.searchTtypeId.game_type}&tableId=${this.searchTtypeId.table_id}&xueNumber=${this.searchTtypeId.xue}&pu=${this.searchTtypeId.pu}&start=${this.searchTtypeId.start}&end=${this.searchTtypeId.end}&token=${this.searchTtypeId.token}&admin_type=${this.searchTtypeId.admin_type}&tableName=${tableName}`
      window.open(url, "_blank");
    },
    handleEndDate() {
      this.searchTtypeId.end = moment(this.searchTtypeId.end).format('YYYY-MM-DD') + ' 23:59:59'
    },
    handleCurrentChange: function (index) {
      this.current = index;
      this.searchTtypeId.page = index
      this.getUserList()
    },
    unsettledRetreat_v2(type, row) {
      this.Edit_luzhu = true;
      this.Edit_luzhu_id = row.id
      this.Edit_luzhu_mima = ''
      this.dialogTitle_luzhu = '作废露珠'
    },
    sendLuZhuSubmit(row){
      this.Edit_luzhu = false;
      getRetreatApi({id:this.Edit_luzhu_id,pwd:this.Edit_luzhu_mima}).then(res => {
        if(res.code == 1){
          this.getUserList()
          this.$message({message:res.msg,type: 'success'});
        }
      })
    },
    //结算了退回
    unsettledRetreat(row) {
      this.$confirm('您确定要退还当前订单吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        getRetreatApi({id:row.id}).then(res => {
          if(res.code == 1){
            this.getUserList()
            this.$message({message:res.msg,type: 'success'});
          }
        })
      }).catch(() => {})
    },
    getUserList() {
      getluZzhuListApi(this.searchTtypeId).then(res => {
        this.roleList = res.data.data
        this.allpage = res.data.total;
      })
    },
    /**
     * 表单回车事件
     * **/
    handleFormEnter() {
      this.$refs.formTable.blur();
      this.onSubmit()
    },
    showDialog(type, row) {
      this.dvEdit = true;
      if (type === 'edit') this.form = row;
      if (type === 'add') this.form = {};
      this.dialogTitle = type === 'add' ? '新增' : '编辑'
    },
    onSubmit() {
      if (this.form.id) {
        getluZzhuEditApi(this.form).then(res => {
          if (res.code == 1) {
            this.dvEdit = false
            this.$message({message: res.msg, type: 'success'});
            this.getUserList();
            return;
          }
        })
        return;
      }
      this.form.status = 1;
      getluZzhuAddApi(this.form).then(res => {
        if (res.code == 1) {
          this.dvEdit = false
          this.$message({message: res.msg, type: 'success'});
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
    search() {
      this.$refs.tableSearch.blur();
      this.getUserList()
    },
    changes(status, row, type) {
      getluZzhuStatusApi({
        id: row.id,
        status: status
      }).then(res => {
        if (res.code == 1) {
          this.$message({message: res.msg, type: 'success'});
        } else {
          this.$message('no');
        }
      })
    },

    // loadNode(node, resolve) {
    //   if (node.level === 0) {
    //     return resolve([
    //       { name: '监控中心' },
    //       { name: '文章管理' },
    //       { name: '用户管理' },
    //       { name: '菜单管理' },
    //       { name: '个性设置' },
    //       { name: '异常管理' },
    //       { name: '系统设置' },
    //     ]);
    //   }
    //   if (node.level > 3) return resolve([]);

    //   var hasChild;
    //   if (node.data.name === 'region1') {
    //     hasChild = true;
    //   } else if (node.data.name === 'region2') {
    //     hasChild = false;
    //   } else {
    //     hasChild = Math.random() > 0.5;
    //   }

    //   setTimeout(() => {
    //     var data;
    //     if (hasChild) {
    //       data = [{
    //         name: 'zone' + this.count++
    //       }, {
    //         name: 'zone' + this.count++
    //       }];
    //     } else {
    //       data = [];
    //     }

    //     resolve(data);
    //   }, 500);
    // },
    deleteUser(scope) {
      this.$confirm('您确定要删除当前用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log(1)
        getluZzhuDelApi({'id': scope.id}).then(res => {
          if (res.code == 1) {
            this.$message({message: res.msg, type: 'success'});
            this.getUserList();
          } else {
            this.$message('no');
          }
        })
      }).catch(() => {
      })
    }
  },
}
</script>

<style lang='scss' scoped>
::v-deep .page-content-condition .el-date-editor .el-input{
  width: 150px;
}
.page-content {
  width: 100%;
  height: 100%;
  .page-content-condition{
    // display: flex;
    // justify-content: flex-start;
  }
  .page-content-btn{
    margin: 0;
  }
}
</style>
