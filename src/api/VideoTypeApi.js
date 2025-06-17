import axios from '@/utils/request';

export function getVideoTypeListApi(data) {
  return axios.post({
    url: '/video_type/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoTypeApi(data) {
  return axios.post({
    url: '/video_type/type',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getVideoTypeAddApi(data) {
  return axios.post({
    url: '/video_type/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getVideoTypeDelApi(data) {
  return axios.post({
    url: '/video_type/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoTypeDetailApi(data) {
  return axios.post({
    url: '/video_type/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoTypeEditApi(data) {
  return axios.post({
    url: '/video_type/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoTypeStatusApi(data) {
  return axios.post({
    url: '/video_type/status',
    data: data
  }).then((res) => {
    return res
  })
}

export function getVideoTypeIsShowApi(data) {
  return axios.post({
    url: '/video_type/show',
    data: data
  }).then((res) => {
    return res
  })
}
