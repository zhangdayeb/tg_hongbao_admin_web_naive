import axios from '@/utils/request';

export function getMarketLevelListApi(data) {
  return axios.post({
    url: '/market_level/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getMarketLevelAddApi(data) {
  return axios.post({
    url: '/market_level/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getMarketLevelDelApi(data) {
  return axios.post({
    url: '/market_level/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMarketLevelDetailApi(data) {
  return axios.post({
    url: '/market_level/detail',
    data: data,
  }).then((res) => {
    return res
  })
}
                
export function getMarketLevelEditApi(data) {
  return axios.post({
    url: '/market_level/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMarketLevelStatusApi(data) {
  return axios.post({
    url: '/market_level/status',
    params: data
  }).then((res) => {
    return res
  })
}
