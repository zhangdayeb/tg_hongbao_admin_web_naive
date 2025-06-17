<template>
  <div class='page-content'>
  <el-row :gutter="20">
   <el-col :xs="3" :sm="12" :lg="4">
      <el-select v-model="searchTtypeId.type_id" placeholder="请选择游戏" @change="search">
        <el-option v-for="item in options" :key="item.id" :label="item.type_name" :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
      <el-button @click="search">搜索</el-button>
      <el-button @click="showDialog('add','')">新增</el-button>
    </el-col>
  </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">

      <el-table-column label="ID" prop="id"/>
      <el-table-column label="游戏名称" prop="type_name"/>
      <el-table-column label="游戏赔率" prop="peilv"/>
      <el-table-column label="桌面提示" prop="game_tip_name"/>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="备注信息" prop="remark"/>
      <el-table-column fixed="right" label="操作" width="200">
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

        <el-form-item label="分类选择">
        <el-select v-model="form.game_type_id" placeholder="请选择分类" style="width: 200px; margin-left: 10px">
          <el-option
            v-for="item in options"
            :key="item.game_type_id"
            :label="item.type_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="赔率">
          <el-input v-model="form.peilv" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="桌面提示">
          <el-input v-model="form.game_tip_name" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input v-model="form.remark" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model="form.sort" type="number" @keyup.enter.native="onSubmit"></el-input>
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
  import {getGameOddsListApi,getGameOddsAddApi,getGameOddsEditApi,getGameOddsDelApi,getGameOddsGameApi} from '@/api/DeskApi'
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
        searchTtypeId: {
          type_id: undefined,
        },
        count: 1,
        roleList: [],
        options:[]
      };
    },
    mounted() {
      this.getUserList()
      this.gameTypeList()
    },
    methods: {
      gameTypeList(){
        getGameOddsGameApi({
        }).then(res => {
          this.options = res.data
        })
      },
      handleCurrentChange:function(index){
                this.current = index;
                getGameOddsListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getUserList(){
        getGameOddsListApi(this.searchTtypeId).then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
        })
      },
      changes(status,row,type){
        getGameOddsStatusApi({
            id:row.id,
            status:status
            }).then(res => {
              if(res.code == 1){
               this.$message({message:res.msg,type: 'success'});
              }
          })
      },
      search() {
        this.getUserList()
      },
      showDialog(type,row) {
        this.dvEdit = true;
        if(type === 'edit') this.form  = row;
        if(type === 'add') this.form  = {};
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      onSubmit() {
          if(this.form.id){
            getGameOddsEditApi(this.form).then(res => {
            if(res.code == 1){
             this.dvEdit = false
             this.$message({message:res.msg,type: 'success'});
             this.handleCurrentChange(this.current);
              return;
            }
            })
            return;
          }
           getGameOddsAddApi(this.form).then(res => {
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
          getGameOddsDelApi({'id':scope.id}).then(res=>{
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
