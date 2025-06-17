import axios from '@/utils/request';

export function getUserListApi(data) {
  return axios.post({
    url: '/user/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getUserStatusApi(data) {
  return axios.post({
    url: '/user/status',
    data: data
  }).then((res) => {
    return res
  })
}

export function getUserBankApi(data) {
  return axios.post({
    url: '/pay_bank/info',
    data: data
  }).then((res) => {
    return res
  })
}

export function getBankEditApi(data) {
  return axios.post({
    url: '/pay_bank/edit',
    data: data
  }).then((res) => {
    return res
  })
}

export function getUserDelApi(params) {
  return axios.post({
    url: '/user/del',
    data: params,
  }).then((res) => {
    return res
  })
}

export function getUserDetailApi(data) {
  return axios.post({
    url: '/user/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getUserAddApi(data) {
  return axios.post({
    url: '/user/add',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getUserEditApi(data) {
  return axios.post({
    url: '/user/edit',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getUserRealListApi(data) {
  return axios.post({
    url: '/userreal/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMoneyEditApi(data) {
  return axios.post({
    url: '/money/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getIsStatusApi(data) {
  return axios.post({
    url: '/user/is_status',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getIsAgentApi(data) {
  return axios.post({
    url: '/user/agent',
    data: data,
  }).then((res) => {
    return res
  })
}

// 用户盈亏
export function getProfitListApi(data) {
  return axios.post({
    url: '/profit/list',
    data: data,
  }).then((res) => {
    return res
  })
}

//用户排行
export function getUserSortListApi(data) {
  return axios.post({
    url: '/usersort/list',
    data: data,
  }).then((res) => {
    return res
  })
}

//代理关系
export function getRelevantListApi(data) {
  return axios.post({
    url: '/relevant/list',
    data: data,
  }).then((res) => {
    return res
  })
}

//代理关系
export function getXianHongApi(data) {
  return axios.post({
    url: '/xian_hong/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

//用户信息
export function getUserInfoApi(data) {
  return axios.post({
    url: '/user/info',
    data: data,
  }).then((res) => {
    return res
  })
}
