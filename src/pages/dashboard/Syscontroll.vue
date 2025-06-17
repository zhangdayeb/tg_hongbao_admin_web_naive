<template>
  <div class="task console">
    <el-button :type="primary" plain style="margin-bottom: 10px;" @click="restart" v-html="weihu"></el-button>
    <el-button type="primary" plain style="margin-bottom: 10px;" @click="stop">清除全体用户登录日志</el-button>
    <el-button type="primary" plain style="margin-bottom: 10px;" @click="luzhu">露珠数据备份</el-button>
    <el-button type="primary" plain style="margin-bottom: 10px;" @click="order">投注记录数据备份</el-button>
    <!-- <el-button :type="registerprimary  " plain style="margin-bottom: 10px;" @click="getRegisters" v-html="registers">开启注册</el-button> -->
  </div>
</template>

<script>
  import ConsoleCard from "@/components/dashboard/ConsoleCard"

  import {
    getConfigInfoApi,getConfigEditApi,getClearTokenApi,getMysqlBackupsApi,getMysqlRecordsApi
  } from '@/api/CountApi'
  export default {
    data () {
      return {
        primary:'primary',
        weihu: '开启平台维护',
        web_maintain:[],
        registerprimary:'primary',
        registers: '开启平台注册',
         app_register:[],
      }
    },
    components: {
      ConsoleCard,
    },
    mounted() {
      //获取配置
      this.getConfigInfo();

    },
    methods: {
      getConfigInfo(){
        getConfigInfoApi({name:'web_maintain'}).then(res => {
          if (res.code == 1) {
            this.web_maintain=res.data
            if (res.data.value == 1){
              this.weihu = '平台维护中'
              this.primary = 'warning'
            }else{
              this.weihu = '开启平台维护'
              this.primary = 'primary'
            }
          }
        }),
        getConfigInfoApi({name:'app_register'}).then(res => {
          if (res.code == 1) {
            this.app_register=res.data
            if (res.data.value == 1){
              this.registers = '开启注册'
             this.registerprimary = 'primary'
            }else{
              this.registers = '关闭注册'
               this.registerprimary = 'warning'
            }
          }
        })
      },
      order() {
        this.$confirm('确定备份吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMysqlRecordsApi().then(res => {
            if (res.code == 1) {
              this.$message({
                type: 'success',
                message: '备份成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '备份失败'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消备份'
          });
        });
      },
      restart() {
        this.$confirm('确定切换平台状态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.web_maintain.value == 1){
            this.web_maintain.value=0;
          }else {
            this.web_maintain.value = 1;
          }

          getConfigEditApi(this.web_maintain).then(res => {
            if (res.code == 1) {
              this.getConfigInfo();
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '请检查web_maintain配置'
          });
        });
      },

      getRegisters() {
        this.$confirm('确定切换注册状态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.app_register.value == 1){
            this.app_register.value=0;
          }else {
            this.app_register.value = 1;
          }

          getConfigEditApi(this.app_register).then(res => {
            if (res.code == 1) {
              this.getConfigInfo();
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '修改失败'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '请检查app_register配置'
          });
        });
      },

      stop() {
        this.$confirm('确定清理吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getClearTokenApi().then(res => {
            if (res.code == 1) {
              this.$message({
                type: 'success',
                message: '清理成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '清理失败'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消清理'
          });
        });
      },

      luzhu() {
        this.$confirm('确定备份吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getMysqlBackupsApi().then(res => {
            if (res.code == 1) {
              this.$message({
                type: 'success',
                message: '备份成功!'
              })
            } else {
              this.$message({
                type: 'info',
                message: '备份失败'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消备份'
          });
        });
      }

    }
  }
</script>

<style lang="scss" scoped>
  .console {
    height: 100%;

    &::-webkit-scrollbar {
      width: 0px !important;
    }

    >>>.head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      padding: 10px 0;
      border-bottom: 1px solid #F0F0F0;
      position: relative;
      z-index: 999;

      .line-title {
        padding: 0 13px;
        display: flex;
        align-items: center;

        i {
          display: inline-block;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 50%;
          color: #1890FF;
          background-color: rgb(230, 247, 255);
          font-size: 15px;
        }

        span {
          color: #555;
          font-size: 15px;
          margin-left: 10px;
        }
      }
    }

    .row {
      display: flex;
      margin-top: 15px;
      background: transparent !important;

      >div {
        margin-right: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 3px;
        transition: box-shadow .3s;

        &:last-of-type {
          margin-right: 0 !important;
        }
      }
    }

    .row1,
    .row2 {
      height: 380px;
    }
  }

  @media only screen and (max-width: $device-notebook) {
    .console {
      .row1 {
        height: 350px;
      }

      .row2 {
        height: 300px;
      }
    }
  }

  @media only screen and (max-width: $device-ipad) {
    .console {

      .row {
        display: block;
        height: auto !important;

        >div {
          height: 370px;
        }
      }

      .row1 {
        margin-top: 0;
      }
    }
  }
</style>
