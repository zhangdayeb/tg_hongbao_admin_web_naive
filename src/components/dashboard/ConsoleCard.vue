<template>
  <div class="card">
    <el-row :xs="24" :sm="12" :lg="6" style="margin-top: 0.625rem; margin-bottom: 0.625rem;">
      <el-col :xs="12" :sm="12" :lg="5">
        <el-date-picker v-model="searchGameCountAll.start" format="yyyy-MM-dd HH:mm:ss"  type="date"
                        placeholder="开始日期">
        </el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="5">
        <el-date-picker v-model="searchGameCountAll.end" type="date"
        format="yyyy-MM-dd HH:mm:ss" @change="handleEndDate()"
        placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <el-button @click="searchGameCountForAll">统计搜索</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.today)">今日</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.yesterday)">昨日</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.week)">本周</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastWeek)">上周</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.month)">本月</el-button>
        <el-button @click="handSearchType($minTool.DATE_CATEGORY.lastMonth)">上月</el-button>
      </el-col>
    </el-row>
    <ul>
      <li v-for="(item, index) in dataList" :key="index" :style="dataListStyle" @click="navigate(item)">
        <svg class="svg-icon " aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="des">{{ item.des }}</span>
        <count-to class="number" :startVal='item.startVal' :endVal='item.endVal' :duration='1500' separator=''/>
      </li>
    </ul>
    <br>
    <ul>
      <li v-for="(item, index) in dataListss" :key="index" :style="dataListStyle" @click="navigate(item)">
        <svg class="svg-icon " aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="des">{{ item.des }}</span>
        <count-to class="number" :startVal='item.startVal' :endVal='item.endVal' :duration='1500' separator=''/>
      </li>
    </ul>
    <br>
    <ul>
      <li v-for="(item, index) in dataLists_v3" :key="index" :style="dataListStyle" @click="navigate(item)">
        <svg class="svg-icon " aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="des">{{ item.des }}</span>
        <count-to class="number" :startVal='item.startVal' :endVal='item.endVal' :duration='1500' separator=''/>
      </li>
    </ul>
    <br>
    <ul>
      <li v-for="(item, index) in dataLists_v4" :key="index" :style="dataListStyle" @click="navigate(item)">
        <svg class="svg-icon " aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="des">{{ item.des }}</span>
        <count-to class="number" :startVal='item.startVal' :endVal='item.endVal' :duration='1500' separator=''/>
      </li>
    </ul>
  </div>

</template>

<script>
import countTo from 'vue-count-to'
import { getDashboardApi } from '@/api/CountApi'

export default {
  name: "ConsoleCard",
  components: {
    countTo
  },
  data() {
    return {
      startVal: 0,
      dataList: [{
        des: '历史注册人数',
        icon: '#iconyonghu1',
        startVal: 0,
        duration: 1000,
        endVal: 0,
        width: 24,
        height: 26,
        pathName: 'userManageList',
        dateType: 'all',
      },
        {
          des: '今日注册人数',
          icon: '#iconyonghu1',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 24,
          height: 25,
          pathName: 'userManageList',
          dateType: 'today',
        },
        {
          des: '历史充值总额',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'all',
          select: 101,
        },
        {
          des: '今日充值',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 24,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'today',
          select: 101,
        },
        {
          des: '历史提现总额',
          icon: '#iconquyufangwenqushi',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 24,
          height: 24,
          pathName: 'logMoneylog',
          dateType: 'all',
          select: 102,
        },
        {
          des: '今日提现',
          icon: '#iconquyufangwenqushi',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'today',
          select: 102,
        },
      ],
      dataListss: [
        {
          des: '历史下注总数',
          icon: '#iconshalou',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logRecords',
          dateType: 'all',
        },
        {
          des: '今日下注数',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logRecords',
          dateType: 'today',
        },
        {
          des: '历史下注总额',
          icon: '#iconshalou',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logRecords',
          dateType: 'all',
        },
        {
          des: '今日下注',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logRecords',
          dateType: 'today',
        },
        {
          des: '历史盈亏总额',
          icon: '#iconshalou',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'agentlist',
          dateType: 'all',
        },
        {
          des: '今日盈亏',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'agentlist',
          dateType: 'today',
        },

      ],
      dataLists_v3: [{
        des: '历史洗码总量',
        icon: '#iconshalou',
        startVal: 0,
        duration: 1000,
        endVal: 0,
        width: 27,
        height: 25,
        pathName: 'agentlist',
        dateType: 'all',
      },
        {
          des: '今日洗码量',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'agentlist',
          dateType: 'today',
        },
        {
          des: '历史洗码费总计',
          icon: '#iconshalou',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'all',
          select: 602,
        },
        {
          des: '今日洗码费',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'today',
          select: 602,
        },
        {
          des: '当前在线',
          icon: '#iconchuli',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'agentUserlist',
          dateType: 'today',
        },

      ],
      dataLists_v4: [
        {
          des: '历史授权额度',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'all',
          select: 101,
        },
        {
          des: '今日授权额度',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 24,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'today',
          select: 101,
        },
        {
          des: '历史扣除授权额度',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 27,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'all',
          select: 101,
        },
        {
          des: '今日扣除授权额度',
          icon: '#iconsidebar',
          startVal: 0,
          duration: 1000,
          endVal: 0,
          width: 24,
          height: 25,
          pathName: 'logMoneylog',
          dateType: 'today',
          select: 101,
        },
      ],
      endVal: 2020,
      duration: 1000,
      dataListStyle: {},
      countMoney: [],
      searchGameCountAll: {
        start: '',
        end: ''
      }
    };
  },
  mounted() {
    this.computedItemWidth()
    this.getUserList()
    // this.getCountInAndOut()
  },
  methods: {
    getUserList(searchData = {}) { //endVal //注册
      getDashboardApi(searchData).then(res => {

        this.dataList[0].endVal = res.data.count_register      //历史注册人数
        this.dataList[1].endVal = res.data.today_register      //今日注册人数

          this.dataList[2].endVal = res.data.count_recharge      //历史充值总额
          this.dataList[3].endVal = res.data.today_recharge      //今日充值金额

          this.dataLists_v4[0].endVal = res.data.count_grant //历史授权额度
          this.dataLists_v4[1].endVal = res.data.today_grant  //今日授权额度
          this.dataLists_v4[2].endVal = res.data.count_dec_grant //历史扣除授权
          this.dataLists_v4[3].endVal = res.data.today_dec_grant //今日扣除授权


          this.dataList[4].endVal = res.data.count_with      //历史提现总额
          this.dataList[5].endVal = res.data.today_with      //今日提现金额
          // 补充新增
          this.dataLists_v3[2].endVal = res.data.count_xima      //历史总洗码费
          this.dataLists_v3[3].endVal = res.data.today_xima      //今日总洗码费


          // 第一行
          this.dataListss[0].endVal = res.data.count_order      //历史总下注数
          this.dataListss[1].endVal = res.data.today_order      //今日下注数
          this.dataListss[2].endVal = res.data.count_order_money      //历史下注总额
          this.dataListss[3].endVal = res.data.today_order_money      //今日下注金额
          this.dataListss[4].endVal = res.data.count_win_bet      //历史盈亏总额
          this.dataListss[5].endVal = res.data.today_win_bet      //今日盈亏金额
          // 第二行
          this.dataLists_v3[0].endVal = res.data.count_xima_sum      //历史洗码总量
          this.dataLists_v3[1].endVal = res.data.today_xima_sum      //今日总洗码量

          // 第二行
          this.dataLists_v3[4].endVal = res.data.today_online      //在线人数

      })

    },
    /**
     * 设置结束日期
    */
    handleEndDate() {
      this.searchGameCountAll.end = this.$minTool.moment(this.searchGameCountAll.end).format('YYYY-MM-DD') + ' 23:59:59'
    },
    /**
     * 设置时间
     * @param dateType 日期类型
     * **/
    handSearchType(dateType) {
      this.searchGameCountAll.start = this.$minTool.handleDateType[dateType].start
      this.searchGameCountAll.end = this.$minTool.handleDateType[dateType].end
      this.getUserList(this.searchGameCountAll)

    },
    /**
     * 跳转
     * @param item 数据总汇单个信息
     * */
    navigate(item) {
      let query = {
        dateType: item.dateType
      }
      if (item.pathName == "logMoneylog") {
        query.select = item.select
      }
      this.$router.push({
        name: item.pathName,
        query: query
      })
    },
    // getCountInAndOut(){
    //   getCountInAndOutApi(this.searchGameCountAll).then(res => {
    //    this.countMoney = res.data
    //   })
    // },
    // searchGameCount(){
    //   this.getCountInAndOut()
    // },
    searchGameCountForAll() {
      this.getUserList(this.searchGameCountAll)
    },
    computedItemWidth() {
      let count = this.dataList;
      let width = 100 / count;

      this.dataListStyle = {
        width: `calc(${width}% - 20px)`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  background: transparent !important;

  ul {
    width: calc(100% + 15px);
    margin-left: -15px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    background: transparent !important;

    li {
      cursor: pointer;
      width: calc(16.666% - 15px);
      height: 125px;
      line-height: 125px;
      text-align: center;
      margin: 0 0 0 15px;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      position: relative;
      border-radius: 3px;
      box-shadow: 0 0px 7px rgba(28, 76, 186, .08);
      transition: box-shadow .3s;

      &:hover {
        box-shadow: 0 5px 20px rgba(28, 76, 186, .12);
      }

      .svg-icon {
        width: 3em;
        height: 3em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        -moz-transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        bottom: 0;
        left: 10%;
      }

      .number {
        color: #515a6e;
        font-size: 26px;
        line-height: 26px;
        margin: 0;
        position: absolute;
        bottom: 50%;
        right: 10%;
      }

      .des {
        color: #999999;
        font-size: 13px;
        line-height: 14px;
        height: 14px;

        position: absolute;
        bottom: 30%;
        right: 10%;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
      }

    }
  }
}

@media only screen and (max-width: $device-notebook) {
  .card {
    padding-top: 0 !important;

    ul {
      li {
        height: 100px;

        .des {
          font-size: 12px;
        }
      }
    }

    .iconfont {
      left: 15px !important;
    }

    .number,
    .des {
      right: 15px !important;
    }
  }
}

@media only screen and (max-width: $device-ipad) {
  .card {

    ul {
      width: calc(100% + 15px);
      margin-left: -15px;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;

      li {
        width: calc(33.333% - 15px);
        height: 120px;
        line-height: 120px;
        margin-bottom: 15px;
      }
    }
  }
}

@media only screen and (max-width: $device-phone) {
  .card {

    ul {
      width: calc(100% + 15px);
      margin-left: -15px;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;

      li {
        width: 100%;
        height: 100px;
        line-height: 100px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
