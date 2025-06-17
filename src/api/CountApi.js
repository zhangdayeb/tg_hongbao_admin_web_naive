import axios from '@/utils/request'


//今日和总注册
export function  getDashboardApi(data) {
  return axios.post({
    url: '/dashboard/all',
     data: data,
  }).then((res) => {
    return res
  })
}



//今日和总注册
export function  getRegisterApi(data) {
  return axios.post({
    url: '/register/all',
     data: data,
  }).then((res) => {
    return res
  })
}

//今日注册量
export function  getRegisterTodayApi(data) {
  return axios.post({
    url: '/register/today',
     data: data,
  }).then((res) => {
    return res
  })
}
//总注册
export function  getRegisterTotalApi(data) {
  return axios.post({
    url: '/register/total',
    data: data,
  }).then((res) => {
    return res
  })
}

//今日充值 总充值
export function  getRechargeApi(data) {
  return axios.post({
    url: '/recharge/all',
    data: data,
  }).then((res) => {
    return res
  })
}

//今日充值
export function  getRechargeTodayApi(data) {
  return axios.post({
    url: '/recharge/today',
    data: data,
  }).then((res) => {
    return res
  })
}
//总充值
export function  getRechargeTotalApi(data) {
  return axios.post({
    url: '/recharge/total',
    data: data,
  }).then((res) => {
    return res
  })
}

//今日提现 总提现
export function  getWithdrawalApi(data) {
  return axios.post({
    url: '/withdrawal/all',
    data: data,
  }).then((res) => {
    return res
  })
}

//今日提现
export function  getWithdrawalTodayApi(data) {
  return axios.post({
    url: '/withdrawal/today',
    data: data,
  }).then((res) => {
    return res
  })
}
//总提现
export function  getWithdrawalTotalApi(data) {
  return axios.post({
    url: '/withdrawal/total',
    data: data
  }).then((res) => {
    return res
  })
}

//今日订单  今日订单
export function  getOrderApi(data) {
  return axios.post({
    url: '/order/all',
    data: data
  }).then((res) => {
    return res
  })
}


 //今日订单
 export function  getOrderTodayPayApi(data) {
   return axios.post({
     url: '/order/today_pay',
     data: data
   }).then((res) => {
     return res
   })
 }

//总订单
export function  getOrderTotalPayApi(data) {
  return axios.post({
    url: '/order/total_pay',
    data: data
  }).then((res) => {
    return res
  })
}

//总订单金额
export function  getOrderTotalMoneyApi(data) {
  return axios.post({
    url: '/order/total_money',
    data: data
  }).then((res) => {
    return res
  })
}
//今日订单金额
export function  getOrderTodayMoneyApi(data) {
  return axios.post({
    url: '/order/today_money',
    data: data
  }).then((res) => {
    return res
  })
}

//出入金展示
export function  getCountInAndOutApi(data) {
  return axios.post({
    url: '/cash/count',
    data: data
  }).then((res) => {
    return res
  })
}

export function  getConfigInfoApi(data) {
  return axios.post({
    url: '/config/info',
    data: data
  }).then((res) => {
    return res
  })
}

export function  getConfigEditApi(data) {
  return axios.post({
    url: '/config/edit',
    data: data
  }).then((res) => {
    return res
  })
}

export function  getOnlineUserApi(data) {
  return axios.post({
    url: '/user/all',
    data: data
  }).then((res) => {
    return res
  })
}


export function  getClearTokenApi(data) {
  return axios.post({
    url: '/clear/token',
    data: data
  }).then((res) => {
    return res
  })
}
export function  getMysqlBackupsApi(data) {
  return axios.post({
    url: '/mysql/backups',
    data: data
  }).then((res) => {
    return res
  })
}
export function  getMysqlRecordsApi(data) {
  return axios.post({
    url: '/mysql/records',
    data: data
  }).then((res) => {
    return res
  })
}
