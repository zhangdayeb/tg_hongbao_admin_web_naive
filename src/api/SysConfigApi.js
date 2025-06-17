import axios from '@/utils/request';

export function getConfigListApi(data) {
  return axios.post({
    url: '/config/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getConfigAddApi(data) {
  return axios.post({
    url: '/config/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getConfigDelApi(data) {
  return axios.post({
    url: '/config/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getConfigDetailApi(data) {
  return axios.post({
    url: '/config/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getConfigEditApi(data) {
  return axios.post({
    url: '/config/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getConfigStatusApi(data) {
  return axios.post({
    url: '/config/status',
    params: data
  }).then((res) => {
    return res
  })
}
