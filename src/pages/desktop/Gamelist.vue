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

      <el-table-column label="ID" prop="id" />
      <el-table-column label="游戏名称" prop="type_name" />

      <el-table-column label="运行状态" width="200" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{scope.row.status == 1 ? '是' : '否'}}
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
          <el-button type="text" icon="el-icon-edit" @click="showLangType(scope.row)">
            多语言
          </el-button>
          <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="游戏名">
          <el-input v-model="form.type_name" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="详情">
          <quill-editor class="editor" ref="quillEditor" v-model="form.explain" :options="editorOption" />
        </el-form-item>
        <!--        <quill-editor class="editor" ref="quillEditor" v-model="form.explain" :options="editorOption"/>-->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 多语言 -->
    <el-dialog title="编辑" width="600px" :visible.sync="LangEdit">
      <el-form ref="form" :model="form" label-width="60px">
        <!-- <el-form-item label="中文">
          <quill-editor class="editor" ref="quillEditor" v-model="LangList.zh" :options="editorOption" />
        </el-form-item> -->
        <el-form-item label="英语">
          <quill-editor class="editor" ref="quillEditor" v-model="form.en" :options="editorOption" />
        </el-form-item>
        <el-form-item label="日语">
          <quill-editor class="editor" ref="quillEditor" v-model="form.jp" :options="editorOption" />
        </el-form-item>
        <el-form-item label="韩语">
          <quill-editor class="editor" ref="quillEditor" v-model="form.kor" :options="editorOption" />
        </el-form-item>
        <el-form-item label="泰语">
          <quill-editor class="editor" ref="quillEditor" v-model="form.tha" :options="editorOption" />
        </el-form-item>
        <el-form-item label="越语">
          <quill-editor class="editor" ref="quillEditor" v-model="form.vnm" :options="editorOption" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="LangEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitLang">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getGameNameListApi,
    getGameNameStatusApi,
    getGameNameAddApi,
    getGameNameEditApi,
    getGameNameDelApi,
    getGameLangListListApi,
    getGameLangEditApi
  } from '@/api/DeskApi'

  import {
    baseUrl
  } from "@/utils/config.js";
  import quillConfig from "@/utils/quill-config.js";
  import {
    quillEditor
  } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import '@/config/quill/quill.scss';

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        dialogTitle: '',
        LangEdit: false,
        LangList: {
          id: 0,
          zh: '',
          en: '',
          jp: '',
          kor: '',
          tha: '',
          vnm: '',
        },
        roleList: [],
        lists: [],
        allpage: 1, //总页数
        showItem: 5, //分页显示得中间按钮个数
        current: 1, //当前页
        word: '',
        status: '',
        form: {
          username: '',
          desc: '',
        },
        article_type_id: '',
        model: {},
        dvEdit: false,
        editorOption: quillConfig,
        articleTypeList: [],
        //uploadImage: uploadImageUrl,
        thumb_url: '',
        dialogBigVisible: false,
        bigSrc: '',
      };
    },
    created: function() {
      //this.handleCurrentChange(1);
    },
    mounted: function() {
      this.getUserList()
      //this.loadArticleTypeList();
    },
    methods: {
      changes(status, row) {
        getGameNameStatusApi({
          id: row.id,
          status: status
        }).then(res => {
          if (res.code == 1) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
          } else {
            this.$message('no');
          }
        })
      },
      getUserList() {
        getGameNameListApi().then(res => {
          this.roleList = res.data.data
          this.allpage = res.data.total;
        })
      },
      loadArticleTypeList() {
        getArticleTypeListAll().then(res => {
          this.articleTypeList = res.data.lists;
        })
      },
      clickBig: function(img) {
        this.bigSrc = img;
        this.dialogBigVisible = true;
      },
      onSubmit() {
        if (this.form.id) {
          getGameNameEditApi(this.form).then(res => {
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
        getGameNameAddApi(this.form).then(res => {
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
      showDialog(type, row) {
        this.dvEdit = true;
        if (type === 'edit') this.form = row;
        if (type === 'add') this.form = {};
        this.dialogTitle = type === 'add' ? '新增' : '编辑'
      },
      showLangType(row) {
        //查询当前语言是否存在
        getGameLangListListApi({
          id: row.id
        }).then(res => {
          if (res.code == 1) {
            let countNum = res.data.length; //赋值变量
            let countData = res.data;
            if (countNum > 0) {
              for (let i = 0; i < countNum; i++) {
                if (countData[i]['lang_type'] == 'zh-cn') {
                  this.form.zh = countData[i]['explain'];
                  continue;
                }
                if (countData[i]['lang_type'] == 'en-us') {
                  this.form.en = countData[i]['explain'];
                  continue;
                }
                if (countData[i]['lang_type'] == 'jp') {
                  this.form.jp = countData[i]['explain'];
                  continue;
                }
                if (countData[i]['lang_type'] == 'kor') {
                  this.form.kor = countData[i]['explain'];
                  continue;
                }
                if (countData[i]['lang_type'] == 'tha') {
                  this.form.tha = countData[i]['explain'];
                  continue;
                }
                if (countData[i]['lang_type'] == 'vnm') {
                  this.form.vnm = countData[i]['explain'];
                  continue;
                }
              }
            }
             this.form.id = row.id
            this.$forceUpdate()
          }
        })
        this.LangEdit = true;
        this.langType = '编辑'
      },
      onSubmitLang() {
        //多语言保存
        getGameLangEditApi(this.form).then(res => {
          if (res.code == 1) {
            this.$message({
              message: '成功',
              type: 'success'
            });
          }
          this.LangEdit = false;
        })
      },
      updateModel: function(row) {
        this.model = row;
        this.thumb_url = row.thumb_url;
        this.dvEdit = true;
      },
      reset: function() {
        this.word = '';
        this.status = '';
        this.article_type_id = '';
      },
      search: function() {
        this.handleCurrentChange(1);
      },
      handleCurrentChange: function(index) {
        this.current = index;
        getGameNameListApi({
          page: index,
          word: this.word,
          status: this.status,
          article_type_id: this.article_type_id
        }).then(res => {
          this.lists = res.data.lists;
          this.allpage = res.data.allpage;
        })
      },
      deleteModel(row) {
        this.$confirm('您确定要删除当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          deleteArticle({
            id: row.id
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.handleCurrentChange(this.current);
            }
          })
        }).catch(() => {})
      },
      changeColumn(columns) {
        this.columns = columns;
        this.$refs.table.doLayout()
      },
      handleClose: function(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleAvatarSuccess: function(res, file) {
        this.thumb_url = res.data.src;
      },
      handleRemove: function(file, fileList) {
        this.thumb_url = '';
      },
      beforeRemove: function(file, fileList) {
        this.thumb_url = '';
      },
    }
  }
</script>

<style lang='scss' scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }

  avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  input[type='file'] {
    display: none;
  }
</style>
