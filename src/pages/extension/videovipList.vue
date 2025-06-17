<template>
  <div class='page-content'>
    <el-row :gutter="20">
     <!-- <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="分类名"></el-input>
      </el-col> -->
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <!-- <el-button>搜索</el-button> -->
        <el-button @click="showDialog('add','')">新增</el-button>
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="套餐所属分类" prop="video_type_name"/>
      <el-table-column label="套餐标题" prop="title"/>
      <el-table-column label="单价" prop="price_single"/>
      <el-table-column label="套餐价格" prop="price_vip"/>
      <el-table-column label="有效期/分钟" prop="validity_time"/>
        <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{scope.row.status == 1 ? '正常' : '冻结'}}
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

        <el-form-item label="分类选择">
        <el-select v-model="form.type" placeholder="请选择分类" style="width: 200px; margin-left: 10px">
          <el-option
            v-for="item in getVideoTypeName"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="套餐名">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="form.price_single" type="number"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格">
          <el-input v-model="form.price_vip" type="number"></el-input>
        </el-form-item>
        <el-form-item label="有效期/分钟">
          <el-input v-model="form.validity_time" type="number"></el-input>
        </el-form-item>
        <el-form-item label="套餐状态">
            <el-radio-group v-model="form.status" size="medium">
              <el-radio  :key="1" :label="1">正常</el-radio>
              <el-radio  :key="0" :label="0">冻结</el-radio>
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
  import {getVideoVipListApi,getVideoVipDelApi,getVideoVipAddApi,getVideoVipEditApi,getVideoVipStatusApi,getVideoVipNameListApi} from '@/api/VideoVipApi'
  import { baseUrl } from "@/utils/config.js";
  import axios from "axios"
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
        getVideoTypeName:[],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        roleList: [],
        imageList:[],
        uploadImage:baseUrl + '/upload/video'
      };
    },
    mounted() {
      this.getUserList();
      this.getVideoTypeNameList();
    },
    methods: {

      changes(status,row){
          getVideoVipStatusApi({
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
                getVideoVipListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      getUserList(){
        getVideoVipListApi().then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
        })
      },

       uploadFile:function(file){
         var fm = new FormData();
         fm.append('file', file.file);
         axios.post('/upload/video',fm).then(res=>{
           var arr = {
               'url': res.data.data[0],
               'uid': file.file.uid,
           };
           this.imageList.push(arr);
         });
      },
      handleRemove:function(file,fileList){
        this.imageList = fileList;
      },
      handleAvatarError:function(error,file){
        window.wxc.xcConfirm(error, window.wxc.xcConfirm.typeEnum.error);
      },
      showDialog(type,row) {
        this.imageList = [];
        if(type == 'edit'){
          this.form  = row;
          if(row.thumb_url){
            console.log(row.thumb_url)
            var image = row.thumb_url.split(',');
            for(let i = 0;i < image.length;i++){
              var arr = {
                  'url': image[i],
                  'uid': Math.round(Math.random()*100000000)
              };
              this.imageList.push(arr);
            }
          }
        }else{
          this.imageList = [];
          this.form  = {};
        }
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
        this.dvEdit = true;//
      },
      getVideoTypeNameList(){
        //获取vip套餐分类
          getVideoVipNameListApi().then(res => {
            console.log(res.data)
              this.getVideoTypeName=res.data
          })
      },
      onSubmit() {

         //this.form.thumb_url=this.imageList
        if(this.form.id){
          getVideoVipEditApi(this.form).then(res => {

          if(res.code == 1){
           this.dvEdit = false
           this.$message({message:res.msg,type: 'success'});
           this.handleCurrentChange(this.current);
            return;
          }
          })
          return;
        }
         getVideoVipAddApi(this.form).then(res => {

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
          getVideoVipDelApi({'id':scope.id}).then(res=>{
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
