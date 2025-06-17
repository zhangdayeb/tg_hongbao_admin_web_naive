<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
       <el-input placeholder="通知内容" v-model="searchParameter.content" @keyup.enter.native="search"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
       <el-button @click="search">搜索</el-button>
        <el-button @click="showDialog('add')">新增</el-button>
      </el-col>
    </el-row>

    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="公告位置" prop="value"/>
      <el-table-column label="公告内容" prop="content"/>
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
       <el-form-item label="公告位置">
              <el-select v-model="form.position" filterable placeholder="请选择" clearable :style="{width: '100%'}">
                <el-option v-for="item in positionKey" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model="form.content" type="textarea" autosize></el-input>
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
  import {getNoticeStatusApi,getNoticeListApi,getNoticeEditApi,getNoticeAddApi, getNoticeDelApi,getNoticePositionApi,getNoticeDetailApi} from '@/api/NoticeApi'
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
          content: undefined,
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        roleList: [],
        positionKey: [],
      };
    },
    mounted() {
      this.getUserList()
      this.getPositionList()
    },
    methods: {
      changes(status,row){
          getNoticeStatusApi({
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
                getNoticeListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },

      getUserList(){
        getNoticeListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },

      getPositionList(){
          getNoticePositionApi().then(res => {
            this.positionKey = []
            for (let item in res.data[0]) {
              this.positionKey.push({label: res.data[0][item], value: item})
            }
          })

        },
        search() {
          this.getUserList()
        },

      showDialog(type,row) {
        this.dvEdit = true

         if (type === 'edit'){
           this.form = row
           this.form.position = this.form.position.toString()
         };
         if (type === 'add') this.form = {};

        this.dialogTitle = type === 'add' ? '新增' : '编辑'

      },
     onSubmit() {

       if (this.form.id) {
         getNoticeEditApi(this.form).then(res => {

           if(res.code == 1){
            this.dvEdit = false
            this.$message({message:res.msg,type: 'success'});
            this.handleCurrentChange(this.current);
             return;
           }
         })
         return;
       }
       getNoticeAddApi(this.form).then(res => {
         console.log(res)
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
          getNoticeDelApi({'id':scope.id}).then(res=>{
                if(res.code == 1){
                 this.$message({message:'删除成功',type: 'success'});
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
