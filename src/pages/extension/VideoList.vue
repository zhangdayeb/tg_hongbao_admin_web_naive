
<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="标题"  v-model="searchParameter.title"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
        <el-button @click="showDialog('add')">新增</el-button>

      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="setmeal('top')">一键上架套餐</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="setmeal('bottom')">一键下架套餐</el-button>
      </el-col>
    </el-row>
    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id" width="100"/>
      <el-table-column label="分类名" width="100" prop="name"/>
      <el-table-column label="视频名称" width="150" prop="title"/>
      <el-table-column label="视频地址" prop="video_url">
        <template slot-scope="scope">
          <a :href="scope.row.video_url" target="_blank">{{scope.row.video_url}}</a>
        </template>
      </el-table-column>
      <el-table-column label="单片价格" width="80" prop="video_price"/>
      <el-table-column fixed="right" label="套餐分配" width="220">
            <template slot-scope="scope">
              <template v-if="scope.row.types">
                <el-select v-model="scope.row.types" style="waidth:100%" :disabled="true" multiple>
                    <el-option
                      v-for="item in menulist"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </template>
              <el-button type="text"  style="color:green" icon="el-icon-edit" @click="branchMeun(scope.row)">
                套餐分配
              </el-button>
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



<el-dialog  title="套餐分类分配" width="50%" :visible.sync="MeuwEdit">
      <el-form :model="form" label-width="100px">
       <!-- <el-form-item label="角色名">
          <el-input v-model="form.title" disabled=""></el-input>
        </el-form-item> -->
        <el-form-item label="套餐选择">
          <el-select v-model="form.types" style="width: 100%;" multiple placeholder="请选择">
              <el-option
                v-for="item in menulist"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="MeuwEdit = false">取 消</el-button>
        <el-button type="primary" @click="MSubmit">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog :before-close="handleClose" :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
       <!-- <el-form-item label="分类名">
          <el-input v-model="form.name"></el-input>
        </el-form-item> -->

        <el-row style="display: flex">
        <el-input v-model="form.title" placeholder="输入标题" style="flex: 1"/>
          <el-input type="number" v-model="form.video_price" placeholder="单片价格" style="width: 100px;"/>
        <el-select v-model="form.type" placeholder="请选择分类" style="width: 150px; margin-left: 10px">
          <el-option
            v-for="item in getVideoTypeList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-row>
      <el-input v-model="form.description" type="textarea" :rows="4" placeholder="简介" />


      <el-row style="margin-top: 20px">
        <el-upload
          enctype="multipart/form-data"
          class="upload-demo"
          :action="uploadImage"
          accept=".jpg,.png"
          name="file"
          :limit="1"
          multiple
          :on-error="handleAvatarErrors"
          :on-remove="handleRemoves"
          :file-list="imageLists"
          :http-request="uploadFiles"
          list-type="picture">
          <el-button size="small" type="primary">封面点击上传</el-button>
        </el-upload>
      </el-row>



      <el-row style="margin-top: 20px">
        <el-upload
          enctype="multipart/form-data"
          class="upload-demo"
          :action="uploadImage"
          accept=".jpg,.png,.mp4,.avi"
          name="file"
          :limit="100"
          multiple
          :on-error="handleAvatarError"
          :on-remove="handleRemove"
          :file-list="imageList"
          :http-request="uploadFile"
          list-type="fileList">
          <el-button size="small" type="primary">视频上传</el-button>
        </el-upload>
      </el-row>

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
  var i=0;
  import {getVideoListApi, getVideoDelApi,getVideoEditApi,getVideoAddApi,getVideoAuthApi} from '@/api/VideoApi'
  import {getUploadVideoApi} from '@/api/uploadApi'
  import {getVideoVipListApi,getVideoVipFastApi,getVideoVipEndApi} from '@/api/VideoVipApi'
  import {getVideoTypeApi,getVideoTypeListApi, getVideoTypeDelApi,getVideoTypeEditApi,getVideoTypeAddApi} from '@/api/VideoTypeApi'
  import axios from "axios"
  import { baseUrl } from "@/utils/config.js";
  export default {
    data () {
      return {
        allpage:1,//总页数
        showItem:5,//分页显示得中间按钮个数
        current:1,//当前页
        dvEdit: false,
        dialogTitle: '',
        searchParameter: {
          title: undefined,
        },
        form: {
          username: '',
          desc: '',
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        MeuwEdit:false,
        options: {},
        count: 1,
        roleList: [],
        dialogImageUrl: [],
        dialogVisible: false,
        getVideoTypeList:[],
        uploadTxtAdress:[],
        imageList:[],
        imageLists:[],
        menulist:[],
        uploadImage:baseUrl + '/upload/video'
      };
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      handleCurrentChange:function(index){
                this.current = index;
                getVideoListApi({
                  page:index,
                }).then(res => {
                  this.roleList = res.data.data;
                  this.allpage = res.data.total;
                })
      },
      search() {
          this.getUserList()
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
      getUserList(){
        getVideoListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
           this.allpage = res.data.total;
        })
        //调控制器列表
        getVideoVipListApi({limit:100,type:1}).then(res => {
             this.menulist = res.data.data
         })
        getVideoTypeApi({limit:100}).then(res => {
          this.getVideoTypeList = res.data
        })
      },
      branchMeun(row){
             this.MeuwEdit = true
             this.form  = row;
         },
         MSubmit() {
           //this.MeuwEdit = false
              getVideoAuthApi(this.form).then(res => {
               if(res.code == 1){
                 this.MeuwEdit = false
                 this.$message({message:res.msg,type: 'success'});
                 this.handleCurrentChange(this.current);
                 return;
               }
            })
         },
       uploadFile:function(file){
         var fm = new FormData();
         fm.append('file', file.file);
         axios.post('/upload/video',fm).then(res=>{
          if(res.code ==0){
                  this.$message({message:'上传失败',type: 'error'});
                  return;
            }
           var arr = {
               'url': res.data.data[0],
               'name': res.data.data[0],
           };
           this.imageList.push(arr);
            this.$message({message:'上传成功',type: 'success'});
         });
      },
      handleRemove:function(file,fileList){
        this.imageList = fileList;
      },
      handleAvatarError:function(error,file){
        window.wxc.xcConfirm(error, window.wxc.xcConfirm.typeEnum.error);
      },


      handleAvatarErrors:function(error,file){
        window.wxc.xcConfirm(error, window.wxc.xcConfirm.typeEnum.error);
      },
      handleRemoves:function(file,fileList){
        console.log(fileList)
        this.imageLists = fileList;
      },
      uploadFiles:function(file){
         var fm = new FormData();
         fm.append('file', file.file);
         axios.post('/upload/video',fm).then(res=>{
           var arr = {
               'url': res.data.data[0],
               'uid': file.file.uid,
           };
           this.imageLists.push(arr);
         });
      },

      setmeal(type){
            //一键全部套餐
            this.$confirm('您确定一键改套餐吗?不包括已经分配的', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
             if(type == 'top'){
                 getVideoVipFastApi({}).then(res => {
                    if(res.code ==1){
                       this.getUserList()
                       this.$message({message:res.msg,type: 'success'});
                    }
                 })
             }
             if(type == 'bottom'){
                 getVideoVipEndApi({}).then(res => {
                    if(res.code ==1){
                       this.getUserList()
                       this.$message({message:res.msg,type: 'success'});
                    }
                 })
             }
             this.getUserList()
            }).catch(() => {});
      },

      showDialog(type,row) {
        this.imageLists = [];
         this.imageList=[];
        if(type == 'edit'){
          this.form  = row;
          this.imageLists=[];
           this.imageList=[];
          if(row.thumb_url){
            var image = row.thumb_url.split(',');
            for(let i = 0;i < image.length;i++){
              var arr = {
                  'url': image[i],
                  'uid': Math.round(Math.random()*100000000),
              };
              this.imageLists.push(arr);
            }
          }

          if(row.video_url){
            var image = row.video_url.split(',');
            for(let i = 0;i < image.length;i++){
              var arr = {
                  'url': image[i],
                  'uid': Math.round(Math.random()*100000000),
                   'name':image[i]
              };
              this.imageList.push(arr);
            }
          }
        }else{
          this.imageList = [];
          this.form  = {};
        }
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
        this.dvEdit = true;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onSubmit() {
        this.form.video_url=this.imageList;
        this.form.thumb_url=this.imageLists;

        if(this.form.video_url.length <=0){
          this.$message({message:'视频还没上传完',type: 'error'});
          return;
        }

        if(!this.form.video_price < 0){
          this.$message({message:'单片价格不能小于0',type: 'error'});
          return;
        }
         this.handleCurrentChange(this.current);
        if(this.form.id){
          getVideoEditApi(this.form).then(res => {
          if(res.code == 1){
           this.dvEdit = false
           this.$message({message:res.msg,type: 'success'});
          this.handleCurrentChange(this.current);
            return;
          }
          })
          return;
        }
         getVideoAddApi(this.form).then(res => {
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
          getVideoDelApi({'id':scope.id}).then(res=>{
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
