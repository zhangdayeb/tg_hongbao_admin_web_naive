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
    url: '/pay/list',
       data: data,
  }).then((res) => {
    return res
  })
}
export function getRecordListApi(data) {
  return axios.post({
    url: '/record_money/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function gettPayStatusApi(data) {
  return axios.post({
    url: '/pay/status',
       data: data,
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

export function getXimaListApi(data) {
  return axios.post({
    url: '/xima/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getAgentAuthListApi(data) {
  return axios.post({
    url: '/agent_auth/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getWinOrLoseApi(data) {
  return axios.post({
    url: '/records/total',
       data: data,
  }).then((res) => {
    return res
  })
}

export function getTypeApi(data) {
  return axios.post({
    url: '/type/log',
    data: data,
  }).then((res) => {
    return res
  })
}
