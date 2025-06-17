<template>
  <div class='page-content'>
    <el-row :gutter="20">
      <!-- <el-col :xs="24" :sm="12" :lg="4">
        <el-input placeholder="用户名或昵称"></el-input>
      </el-col> -->
      <el-col :xs="24" :sm="12" :lg="4" class="el-col2">
        <!-- <el-button>搜索</el-button> -->
        <el-button @click="showDialog('add')">新增</el-button>
      </el-col>
    </el-row>

    <el-table border style="margin-top: 15px" :data="roleList" :showPage="false">
      <el-table-column label="ID" prop="id" />
      <!-- <el-table-column width="400" label="name" prop="ip"/> -->
      <el-table-column width="100" label="名称" prop="table_title" />
      <el-table-column width="80" label="荷官名称" prop="he_guan_name" />
      <el-table-column width="80" label="游戏类型" prop="type_name" />

      <el-table-column label="运行状态" prop="run_status" width="80px">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.run_status ? '' : 'info'">
            {{scope.row.run_status == 1 ? '投注' : scope.row.run_status == 0 ? '暂停':'开牌'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="90" label="每局倒计时(秒)" prop="countdown_time" />
      <el-table-column width="120" label="当局开始时间" prop="start_time.test" />

      <el-table-column label="是否开启" width="200" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status ? '' : 'info'">
            {{scope.row.status == 1 ? '是' : '否'}}
          </el-tag>
          <el-switch v-model="scope.row.status" @change="changes(scope.row.status,scope.row)" :active-value="1"
            :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="台座限红" width="200" prop="is_table_xian_hong">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.is_table_xian_hong ? '' : 'info'">
            {{scope.row.is_table_xian_hong == 1 ? '是' : '否'}}
          </el-tag>
          <el-switch v-model="scope.row.is_table_xian_hong" @change="isTableXianHong(scope.row.is_table_xian_hong,scope.row)" :active-value="1"
            :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示排序" prop="list_order" />

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit',scope.row)">
            编辑
          </el-button>
          <el-button type="text" style="color: #67c23a" icon="el-icon-details" @click="showLangType(scope.row)">
            多语言
          </el-button>
          <el-button type="text" style="color: #67c23a" icon="el-icon-details" @click="details(scope.row)">
            详情
          </el-button>
          <el-button type="text" style="color: #FA6962" icon="el-icon-delete" @click="deleteUser(scope.row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="台桌名字">
          <el-input v-model="form.table_title" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="台桌描述">
          <el-input v-model="form.table_describe" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="近景视频地址">
          <el-input v-model="form.video_near" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="远景视频地址">
          <el-input v-model="form.video_far" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="荷官名称">
          <el-input v-model="form.he_guan_name" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="荷官头像">
          <el-row>
            <el-upload enctype="multipart/form-data" class="upload-demo" :action="uploadImage"
              accept=".jpg,.png,.mp4,.avi" name="file" :limit="1" :on-error="handleAvatarError"
              :on-remove="handleRemove" :file-list="imageList" :http-request="uploadFile" list-type="picture">
              <el-button size="small" type="primary">荷官头像</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-row>
        </el-form-item>

        <el-form-item label="荷官描述">
          <el-input v-model="form.he_guan_describe" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="游戏类型">
          <el-select v-model="form.game_type" filterable placeholder="请选择" clearable :style="{width: '100%'}">
            <el-option v-for="item in positionKey" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台桌状态">
          <el-radio-group v-model="form.status" size="medium">
            <el-radio :key="1" :label="1">正常</el-radio>
            <el-radio :key="2" :label="2">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运行状态">
          <el-radio-group v-model="form.run_status" size="medium">
            <el-radio :key="1" :label="1">投注</el-radio>
            <el-radio :key="2" :label="2">开牌</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="当局开始时间">
          <el-date-picker v-model="form.start_time" type="datetime" placeholder="开始日期">
          </el-date-picker>

        </el-form-item>
        <el-form-item label="当局时间倒计时">
          <el-input v-model="form.countdown_time" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄闲美金">
          <el-input v-model="form.xian_hong_zhuang_xian_usd" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄闲人民币">
          <el-input v-model="form.xian_hong_zhuang_xian_cny" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红和美金">
          <el-input v-model="form.xian_hong_he_usd" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红和人民币">
          <el-input v-model="form.xian_hong_he_cny" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红对子美金">
          <el-input v-model="form.xian_hong_duizi_usd" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红对子人民币">
          <el-input v-model="form.xian_hong_duizi_cny" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红幸运6美金">
          <el-input v-model="form.xian_hong_lucky6_usd" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红幸运6人民币">
          <el-input v-model="form.xian_hong_lucky6_cny" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
          <!-- bjl限红 -->
          <el-form-item label="台座限红">
            <el-radio-group v-model="form.is_table_xian_hong" size="medium">
              <el-radio :key="1" :label="1">开启</el-radio>
              <el-radio :key="0" :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <div>百家乐限红</div>
        <el-form-item label="限红闲->大">
          <el-input v-model="form.bjl_xian_hong_xian_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红闲->小">
          <el-input v-model="form.bjl_xian_hong_xian_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄->大">
          <el-input v-model="form.bjl_xian_hong_zhuang_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红庄->小">
          <el-input v-model="form.bjl_xian_hong_zhuang_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红和->大">
          <el-input v-model="form.bjl_xian_hong_he_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红和->小">
          <el-input v-model="form.bjl_xian_hong_he_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红庄对->大">
          <el-input v-model="form.bjl_xian_hong_zhuang_dui_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红庄对->小">
          <el-input v-model="form.bjl_xian_hong_zhuang_dui_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红闲对->大">
          <el-input v-model="form.bjl_xian_hong_xian_dui_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红闲对->小">
          <el-input v-model="form.bjl_xian_hong_xian_dui_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="限红幸运6->大">
          <el-input v-model="form.bjl_xian_hong_lucky6_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红幸运6->小">
          <el-input v-model="form.bjl_xian_hong_lucky6_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
          <!-- lh限红 -->
        <div>龙虎限红</div>
        <el-form-item label="限红龙->大">
          <el-input v-model="form.lh_xian_hong_long_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红龙->小">
          <el-input v-model="form.lh_xian_hong_long_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红虎->大">
          <el-input v-model="form.lh_xian_hong_hu_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红虎->小">
          <el-input v-model="form.lh_xian_hong_hu_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红和->大">
          <el-input v-model="form.lh_xian_hong_he_max" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="限红和->小">
          <el-input v-model="form.lh_xian_hong_he_min" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
          <!-- 牛牛限红 -->

          <!-- 三公限红 -->
        <el-form-item label="露珠台桌名称">
          <el-input v-model="form.lu_zhu_name" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input v-model="form.remark" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="显示排序">
          <el-input v-model="form.list_order" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <span v-show="!det">
          <el-form-item label="创建时间">
            <el-input v-model="form.create_time" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="form.update_time" @keyup.enter.native="onSubmit"></el-input>
          </el-form-item>
        </span>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button v-show="det" type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑" width="500px" :visible.sync="LangEdit">
      <el-form ref="form" label-width="60px">
        <el-form-item label="英语">
          <el-input v-model="formPost.en"></el-input>
        </el-form-item>
        <el-form-item label="日语">
          <el-input v-model="formPost.jp"></el-input>
        </el-form-item>
        <el-form-item label="韩语">
          <el-input v-model="formPost.kor"></el-input>
        </el-form-item>
        <el-form-item label="泰语">
          <el-input v-model="formPost.tha"></el-input>
        </el-form-item>
        <el-form-item label="越语">
          <el-input v-model="formPost.vnm"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="LangEdit = false">取 消</el-button>
        <el-button type="primary" @click="LangOnSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import {
    baseUrl
  } from "@/utils/config.js";
  import {
    getDeskListApi,
    getDeskAddApi,
    getDeskEditApi,
    getDeskStatusApi,
    getDeskGameApi,
    getDeskDelApi,
    getTableLangEditApi,
    getTableLangListApi,
    getIsTableXianHongApi
  } from '@/api/DeskApi';
  import axios from "axios"
  export default {
    data() {
      return {

        dvEdit: false,
        LangEdit: false,
        det: true,
        dialogTitle: '',
        positionKey: [],
        form: {
          username: '',
          desc: '',
        },
        formPost: {
          en: '',
          jp: '',
          kor: '',
          tha: '',
          vnm: '',
        },
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        roleList: [],
        imageList: [],
        uploadImage: baseUrl + '/upload/video'
      };
    },
    mounted() {
      this.getUserList();
      this.getGaneTypeList();

    },
    methods: {
      getUserList() {
        getDeskListApi().then(res => {
          this.roleList = res.data.data
        })
      },
      changes(status, row, type) {
        getDeskStatusApi({
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

     isTableXianHong(status, row, type) {
        getIsTableXianHongApi({
          id: row.id,
          is_xh: status
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

      handleAvatarError: function(error, file) {
        window.wxc.xcConfirm(error, window.wxc.xcConfirm.typeEnum.error);
      },

      showLangType(row) { //查询当前语言是否存在
        getTableLangListApi({
          id: row.id
        }).then(res => {
          if (res.code == 1) {
            let countNum = res.data.length; //赋值变量
            let countData = res.data;
            for (let i = 0; i < countNum; i++) {
              if (countData[i]['lang_type'] == 'zh-cn') {
                this.formPost.zh = countData[i]['explain'];
                continue;
              }
              if (countData[i]['lang_type'] == 'en-us') {
                this.formPost.en = countData[i]['explain'];
                continue;
              }
              if (countData[i]['lang_type'] == 'jp') {
                this.formPost.jp = countData[i]['explain'];
                continue;
              }
              if (countData[i]['lang_type'] == 'kor') {
                this.formPost.kor = countData[i]['explain'];
                continue;
              }
              if (countData[i]['lang_type'] == 'tha') {
                this.formPost.tha = countData[i]['explain'];
                continue;
              }
              if (countData[i]['lang_type'] == 'vnm') {
                this.formPost.vnm = countData[i]['explain'];
                continue;
              }
            }
            this.formPost.id = row.id
            this.$forceUpdate()
            this.LangEdit = true;
          }
        })


      },

      uploadFile: function(file) {
        var fm = new FormData();
        fm.append('file', file.file);
        axios.post('/upload/video', fm).then(res => {
          var arr = {
            'url': res.data.data[0],
            'uid': file.file.uid,
          };
          this.imageList.push(arr);
        });
      },
      handleRemove: function(file, fileList) {
        this.imageList = fileList;
      },
      details(row) {
        this.det = false;
        this.imageList = [];
        this.form = row;
        if (row.he_guan_head_img) {
          var image = row.he_guan_head_img.split(',');
          for (let i = 0; i < image.length; i++) {
            var arr = {
              'url': image[i],
              'uid': Math.round(Math.random() * 100000000)
            };
            this.imageList.push(arr);
          }
        }
        this.dialogTitle = '详情';
        this.dvEdit = true;
      },
      showDialog(type, row) {
        this.det = true;
        this.imageList = [];
        if (type == 'edit') {
          this.form = row;
          this.form.start_time = row.start_time.test;
          if (row.he_guan_head_img) {
            var image = row.he_guan_head_img.split(',');
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
        this.dvEdit = true;
      },

      onSubmit() {
        this.form.he_guan_head_img = this.imageList
        if (this.form.id) {
          getDeskEditApi(this.form).then(res => {
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
          return;
        }
        this.form.status = 1;
        getDeskAddApi(this.form).then(res => {
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

      LangOnSubmit() { //多语言保存
        getTableLangEditApi(this.formPost).then(res => {
          if (res.code == 1) {
            this.LangEdit = false
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.getUserList();
            return;
          }
        })

      },

      getGaneTypeList() {
        getDeskGameApi().then(res => {
          this.positionKey = res.data
        })
      },
      handleCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        // console.log(data);
      },

      deleteUser(scope) {
        this.$confirm('您确定要删除当前用户吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          getDeskDelApi({
            'id': scope.id
          }).then(res => {
            if (res.code == 1) {
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.getUserList();
            } else {
              this.$message('no');
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
