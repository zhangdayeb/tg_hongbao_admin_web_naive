import axios from '@/utils/request';

export function getMarketRelationListApi(data) {
  return axios.post({
    url: '/market_relation/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function getMarketRelationAddApi(data) {
  return axios.post({
    url: '/market_relation/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getMarketRelationDelApi(data) {
  return axios.post({
    url: '/market_relation/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMarketRelationDetailApi(data) {
  return axios.post({
    url: '/market_relation/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMarketRelationEditApi(data) {
  return axios.post({
    url: '/market_relation/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMarketRelationStatusApi(data) {
  return axios.post({
    url: '/market_relation/status',
    params: data
  }).then((res) => {
    return res
  })
}
