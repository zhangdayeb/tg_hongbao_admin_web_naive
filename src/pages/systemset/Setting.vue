<template>
  <div class='page-content'>
    <div class="header">
      <h3>网站设置</h3>
    </div>

    <el-form label-width="95px" style="margin-top: 20px">
      <el-form-item label="网站名称：">
        <el-input v-model="sys.name" :disabled="!isEdit"/>
      </el-form-item>
      <el-form-item label="网站域名：">
        <el-input v-model="sys.website" :disabled="!isEdit"/>
      </el-form-item>
      <el-form-item label="缓存时间：">
        <el-input v-model="sys.keepAliveTime" :disabled="!isEdit"/>
      </el-form-item>
      <el-form-item label="图片大小：">
        <el-input v-model="sys.pictureSize" :disabled="!isEdit"/>
      </el-form-item>
      <el-form-item label="图片格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label=".jpg" :disabled="!isEdit"/>
          <el-checkbox label=".png" :disabled="!isEdit"/>
          <el-checkbox label=".jpeg" :disabled="!isEdit"/>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="视频格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label=".mp4" :disabled="!isEdit"/>
          <el-checkbox label=".rm" :disabled="!isEdit"/>
          <el-checkbox label=".rmvb" :disabled="!isEdit"/>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="附件格式：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label=".doc" :disabled="!isEdit"/>
          <el-checkbox label=".docx" :disabled="!isEdit"/>
          <el-checkbox label=".xls" :disabled="!isEdit"/>
          <el-checkbox label=".xlsx" :disabled="!isEdit"/>
          <el-checkbox label=".pdf" :disabled="!isEdit"/>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 90px" @click="edit">
          {{isEdit ? '保存' : '编辑'}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import setting from '@/config/setting'

  export default {
    data () {
      return {
        sys: {
          name: setting.systemName,
          website: 'http://www.lingchen.kim',
          keepAliveTime: '10',
          pictureSize: '10'
        },
        checkList: ['.jpg', '.png', '.mp4', '.rm', '.doc', '.docx', '.xls'],
        isEdit: false
      };
    },
    methods: {
      edit() {
        this.isEdit = !this.isEdit
      }
    },
  }
</script>

<style lang='scss' scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .header {
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      h3 {
        font-size: 17px;
        font-weight: 500;
      }
    }

    /deep/ .el-form {
      .el-form-item {
        max-width: 700px;
      }
    }
  }
</style>