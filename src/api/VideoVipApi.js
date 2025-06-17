import axios from '@/utils/request';

export function getVideoVipListApi(data) {
  return axios.post({
    url: '/video_vip/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getVideoVipAddApi(data) {
  return axios.post({
    url: '/video_vip/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getVideoVipDelApi(data) {
  return axios.post({
    url: '/video_vip/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoVipDetailApi(data) {
  return axios.post({
    url: '/video_vip/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoVipEditApi(data) {
  return axios.post({
    url: '/video_vip/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoVipStatusApi(data) {
  return axios.post({
    url: '/video_vip/status',
    data: data
  }).then((res) => {
    return res
  })
}

export function getVideoVipFastApi(data) {
  return axios.post({
    url: '/video_vip/fast',
    data: data
  }).then((res) => {
    return res
  })
}
export function getVideoVipEndApi(data) {
  return axios.post({
    url: '/video_vip/end',
    data: data
  }).then((res) => {
    return res
  })
}

export function getVideoVipNameListApi(data) {
  return axios.post({
    url: '/video_vip/name',
    data: data
  }).then((res) => {
    return res
  })
}
