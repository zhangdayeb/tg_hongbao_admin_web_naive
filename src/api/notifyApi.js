import axios from '@/utils/request';

export function getNotifyListApi(data) {
  return axios.post({
    url: '/notify/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getNotifyAddApi(data) {
  return axios.post({
    url: '/notify/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getNotifyDelApi(data) {
  return axios.post({
    url: '/notify/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNotifyDetailApi(data) {
  return axios.post({
    url: '/notify/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNotifyEditApi(data) {
  return axios.post({
    url: '/notify/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNotifyStatusApi(data) {
  return axios.post({
    url: '/notify/status',
    data: data
  }).then((res) => {
    return res
  })
}
