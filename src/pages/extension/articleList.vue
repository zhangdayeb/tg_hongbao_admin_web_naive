<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="标题" v-model="searchParameter.title" @keyup.enter.native="search"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <el-button @click="search">搜索</el-button>
        <el-button @click="showDialog('add')">新增</el-button>
      </el-col>
    </el-row>

    <el-table style="margin-top: 15px" border :data="roleList" :showPage="false">
      <el-table-column label="分类" prop="name" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="作者" prop="author" />
      <el-table-column label="创建时间" prop="create_time" />
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

    <el-dialog :before-close="handleClose" :title="dialogTitle" width="50%" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="50%">
        <div class="form">
          <el-row style="display: flex">
            <el-input v-model="form.title" placeholder="输入标题" @keyup.enter.native="onSubmit" style="flex: 1"  />
            <el-input v-model="form.author" placeholder="作者" style="flex: 1"  @keyup.enter.native="onSubmit" />
            <el-select v-model="form.type" placeholder="请选择分类" style="width: 200px; margin-left: 10px">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-row>
          <quill-editor class="editor" ref="quillEditor" v-model="form.content" :options="editorOption"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" />
          <el-input v-model="form.description" type="textarea" :rows="4"  @keyup.enter.native="onSubmit" placeholder="简介" />
          <el-row style="margin-top: 20px">
            <el-upload enctype="multipart/form-data" class="upload-demo" :action="uploadImage"
              accept=".jpg,.png,.mp4,.avi" name="file" :limit="1" :on-error="handleAvatarError"
              :on-remove="handleRemove" :file-list="imageList" :http-request="uploadFile" list-type="picture">
              <el-button size="small" type="primary">封面点击上传</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-row>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
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
    getArticleListApi,
    getArticleEditApi,
    getArticleDelApi,
    getArticleAddApi
  } from '@/api/ArticleApi'
  import {
    getArticleTypeListApi
  } from '@/api/ArticleTypeApi'
  import {
    quillEditor
  } from 'vue-quill-editor'
  import {getUploadDataApi} from '@/api/uploadApi'
  import 'quill/dist/quill.core.css'
  import quillConfig from "@/utils/quill-config.js";
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import '@/config/quill/quill.scss'
  import {baseUrl} from "@/utils/config.js";
  import axios from "axios"
  export default {
    components: {
      quillEditor
    },
    data() {
      return {

        allpage: 1, //总页数
        showItem: 5, //分页显示得中间按钮个数
        current: 1, //当前页
        dvEdit: false,
        dialogTitle: '',
        form: {
          username: '',
          desc: '',
        },
        editorOption: quillConfig,
        searchParameter: {
          title: undefined,
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        options: [],
        articleTypeList: [],
        count: 1,
        roleList: [],
        imageList: [],
        uploadImage: baseUrl + '/upload/video'
      };
    },
    mounted() {
      this.getUserList();
      this.getArticleTypeList();
    },
    methods: {
      handleCurrentChange: function(index) {
        this.current = index;
        getArticleListApi({
          page: index,
        }).then(res => {
          this.roleList = res.data.data;
          this.allpage = res.data.total;
        })
      },
      getUserList() {
        getArticleListApi(this.searchParameter).then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;

        })
      },
      getArticleTypeList() {
        getArticleTypeListApi({
          limit: 100
        }).then(res => {
          this.articleTypeList = res.data.data
          this.options = res.data.data

        })
      },

      handleRemove: function(file, fileList) {
        this.imageList = fileList;
      },
      uploadFile: function(file) {
        var fm = new FormData();
        fm.append('file', file.file);
        axios.post('/upload/video', fm).then(res => {

          var arr = {
            'url': res.data.data[0],
            'uid': file.file.uid,
          };
          console.log(res.data.data)
          this.imageList.push(arr);
        });
      },
      handleAvatarError: function(error, file) {
        window.wxc.xcConfirm(error, window.wxc.xcConfirm.typeEnum.error);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      search() {
        this.getUserList()
      },
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate);
      },
      onEditorBlur(quill) {

      },
      onEditorFocus(quill) {

      },
      onEditorReady(quill) {

      },
      handleNodeClick(data) {
        // console.log(data);
      },
      showDialog(type, row) {
        this.imageList = [];
        if (type == 'edit') {
          this.form = row;
          if (row.thumb_url) {
            var image = row.thumb_url.split(',');
            for (let i = 0; i < image.length; i++) {
              var arr = {
                'url': image[i],
                'uid': Math.round(Math.random() * 100000000)
              };
              this.imageList.push(arr);
            }
          }
        } else {
          this.imageList = [];
          this.form = {};
        }
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
        this.dvEdit = true; //
      },

      onSubmit() {
        this.form.thumb_url = this.imageList
        if (this.form.id) {
          getArticleEditApi(this.form).then(res => {

            if (res.code == 1) {
              this.dvEdit = false
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.handleCurrentChange(this.current);
              return;
            }
          })
          return;
        }
        getArticleAddApi(this.form).then(res => {
          if (res.code == 1) {
            this.dvEdit = false
            this.$message({
              message: res.msg,
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
          getArticleTypeDelApi({
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
