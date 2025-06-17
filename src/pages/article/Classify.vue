<template>
  <div class="page-content">
    <table-bar :showTop="false" :columns="columns" @changeColumn="changeColumn">
      <div slot="top">
        <el-form label-width="82px">
          <el-row :gutter="20">
            <form-input label="分类名称"></form-input>
            <form-input label="文章数量"></form-input>
            <form-input label="分类ID"></form-input>
            
            <el-row :xs="24" :sm="12" :lg="6" style="float: right; margin-right: 10px;">
              <el-button type="primary">搜索</el-button>
              <el-button>重置</el-button>
            </el-row>
          </el-row>
        </el-form>
      </div>
      <div slot="bottom">
        <el-button type="primary" plain @click="showDialog('add')">新增分类</el-button>
      </div>
    </table-bar>

    <tao-table :showPage="false" :data="tableData" ref="table">
      <el-table-column v-if="columns[0].show" label="分类" style="display: flex;">
        <template slot-scope="scope" >
          <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="scope.row.icon"></use>
          </svg>
          <span style="margin-left: 5px">
            {{scope.row.title}}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="columns[1].show" prop="number" label="文章数量" />
      <el-table-column v-if="columns[2].show" prop="date" label="创建时间" />
      <el-table-column v-if="columns[3].show" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status === 1 ? '' : 'info'">
            {{scope.row.status === 1 ? '启用' : '禁用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150px">
        <template>
          <el-button type="text" icon="el-icon-edit" @click="showDialog('edit')">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-delete" class="el-btn-red" @click="deleteClassify()">
            删除
          </el-button>
        </template>
      </el-table-column>
    </tao-table>

    <el-dialog :title="dialogTitle" width="500px" :visible.sync="dvEdit" top="30vh">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="分类">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dvEdit = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dvEdit: false,
        dialogTitle: '',
        form: {
          name: ''
        },
        tableData: [
          {
            icon: '#iconVue',
            title: 'Vue',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconReact',
            title: 'React',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconflutter-fill',
            title: 'Flutter',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconhtml',
            title: 'HTML',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconCSS',
            title: 'CSS',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconjs',
            title: 'js',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconjava',
            title: 'java',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconxiaoxiong',
            title: 'Golang',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconsikao',
            title: '总结',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconMySQL',
            title: 'MySQL',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#icongit',
            title: 'Git',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconlinux',
            title: 'Linux',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
          {
            icon: '#iconnginx',
            title: 'Nginx',
            number: 20,
            status: 1,
            date: '2020-03-12'
          },
        ],
        columns: [
          { name: "分类", show: true },
          { name: "文章数量", show: true },
          { name: "创建时间", show: true },
          { name: "状态", show: true }
        ]
      }
    },
    mounted() {},
    methods: {
      showDialog(type) {
        this.dvEdit = true
        this.dialogTitle = type === 'add' ? '新增分类' : '编辑分类'
      },
      onSubmit() {
        this.dvEdit = false
      },
      deleteClassify(scope) {
        this.$confirm('您确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          
        }).catch(() => {})
      },
      changeColumn(columns) {
        this.columns = columns
        this.$refs.table.doLayout()
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      vertical-align: -8px;
      fill: currentColor;
      overflow: hidden;
    }
  }
</style>