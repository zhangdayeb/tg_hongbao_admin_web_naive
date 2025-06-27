import axios from '@/utils/request';

export function getMoneyListApi(data) {
  return axios.post({
    url: '/money/log',
       data: data,
  }).then((res) => {
    return res
  })
}

export function getPayListApi(data) {
  return axios.post({
    url: '/withdraw/list',
       data: data,
  }).then((res) => {
    return res
  })
}


export function gettPayPassApi(data) {
  return axios.post({
    url: '/withdraw/pass',
       data: data,
  }).then((res) => {
    return res
  })
}

export function gettPayRefuseApi(data) {
  return axios.post({
    url: '/withdraw/refuse',
       data: data,
  }).then((res) => {
    return res
  })
}

// 提现统计接口
export function getWithdrawStatisticsApi() {
  return axios.post({
    url: '/withdraw/statistics',
    data: {},
  }).then((res) => {
    return res
  })
}

export function getRechargeListApi(data) {
  return axios.post({
    url: '/recharge/list',
       data: data,
  }).then((res) => {
    return res
  })
}

// 充值审核接口
export function getRechargePassApi(data) {
  return axios.post({
    url: '/recharge/pass',
    data: data,
  }).then((res) => {
    return res
  })
}

// 充值审核接口
export function getRechargeRefuseApi(data) {
  return axios.post({
    url: '/recharge/refuse',
    data: data,
  }).then((res) => {
    return res
  })
}

// 充值统计接口
export function getRechargeStatisticsApi() {
  return axios.post({
    url: '/recharge/statistics',
    data: {},
  }).then((res) => {
    return res
  })
}


