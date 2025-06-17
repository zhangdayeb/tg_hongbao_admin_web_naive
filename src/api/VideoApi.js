import axios from '@/utils/request';

export function getVideoListApi(data) {
  return axios.post({
    url: '/video/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getVideoAddApi(data) {
  return axios.post({
    url: '/video/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getVideoDelApi(data) {
  return axios.post({
    url: '/video/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoDetailApi(data) {
  return axios.post({
    url: '/video/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoEditApi(data) {
  return axios.post({
    url: '/video/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getVideoStatusApi(data) {
  return axios.post({
    url: '/video/status',
    params: data
  }).then((res) => {
    return res
  })
}


export function getVideoAuthApi(data) {
  return axios.post({
    url: '/video_vip/auth',
    data: data
  }).then((res) => {
    return res
  })
}