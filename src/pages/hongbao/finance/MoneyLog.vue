<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户" v-model="user_name"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
      </el-col>
    </el-row>

    <el-table style="margin-top: 15px" border @sort-change="sortChange" border :data="roleList" :showPage="false">
      <el-table-column label="ID" width="80" prop="id"/>
      <el-table-column label="用户" width="140" prop="user_name"/>
      <el-table-column label="变化前金额" width="100" prop="money_before"/>
      <el-table-column label="变化金额" width="100" prop="money"/>
      <el-table-column label="变化后金额" width="100" prop="money_end"/>
      <el-table-column label="源头ID" width="80" prop="source_id">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toSource(scope.row)" plain>{{scope.row.source_id}}</el-button>
        </template>
      </el-table-column>

      <el-table-column  label="操作时间" sortable="custom"  width="160" prop="create_time"/>
      <el-table-column label="业务员" width="140" prop="admin_name"/>
      <el-table-column label="详细类型" width="100" prop="status"/>
      <el-table-column label="类型" width="130" prop="type"/>
      <el-table-column label="备注" width="100" prop="mark"/>

    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.desc"
          />
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            @check-change="handleCheckChange">
          </el-tree>
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
   import {getMoneyListApi} from '@/api/MoneylogApi'
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
        user_name:'',
        create_time_sort:''
      };
    },
    mounted() {
      this.getUserList()
      //console.log(this.getVideoBase64('http://tp.com/static/qwe.mp4'))
    },
    methods: {
      getVideoBase64(url) {
            return new Promise(function (resolve, reject) {
                let dataURL = '';
                let video = document.createElement("video");
                video.setAttribute('crossOrigin', 'anonymous');//处理跨域
                video.setAttribute('src', url);
                video.setAttribute('width', 400);
                video.setAttribute('height', 240);
                video.addEventListener('loadeddata', function () {
                    let canvas = document.createElement("canvas"),
                        width = video.width, //canvas的尺寸和图片一样
                        height = video.height;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
                    dataURL = canvas.toDataURL('image/jpeg'); //转换为base64

                    resolve(dataURL);
                });
            })
        },
      toSource:function(row){
        if(row.source_id){
          if(row.status == '充值分销奖励'){
            this.$router.push({path: '/platform/rechargelog', query: {id: row.source_id}})
            return;
            }
                 // this.$router.push('/log/order?id='+row.source_id)
            this.$router.push({path: '/platform/order', query: {id: row.source_id}})
            }
      },
      sortChange:function(column, prop, order){

        if(column.order == 'ascending'){
          this.create_time_sort = 'asc';
        }else{
          this.create_time_sort = 'desc';
        }
        this.handleCurrentChange(1);
      },
      search:function(){
        this.handleCurrentChange(1);
      },
      handleCurrentChange:function(index){
        this.current = index;
        getMoneyListApi({
          page:index,
          user_name:this.user_name,
          create_time_sort:this.create_time_sort
        }).then(res => {
          this.roleList = res.data.data;
          this.allpage = res.data.total;
        })
      },
      getMoneyListApi:function(index){
                this.current = index;
                getArticleTypeListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getUserList(){
        getMoneyListApi({create_time_sort:this.create_time_sort}).then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
          console.log(res.data)
        })

      },
      showDialog(type) {
        this.dvEdit = true
        this.dialogTitle = type === 'add' ? '新增角' : '编辑'
      },
      onSubmit() {
        this.dvEdit = false
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
