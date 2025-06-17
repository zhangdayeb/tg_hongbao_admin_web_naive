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


