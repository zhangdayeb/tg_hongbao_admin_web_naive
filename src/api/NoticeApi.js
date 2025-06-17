import axios from '@/utils/request';

export function getNoticeListApi(data) {
  return axios.post({
    url: '/notice/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function getNoticeAddApi(data) {
  return axios.post({
    url: '/notice/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getNoticeDelApi(data) {
  return axios.post({
    url: '/notice/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNoticeDetailApi(data) {
  return axios.post({
    url: '/notice/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNoticeEditApi(data) {
  return axios.post({
    url: '/notice/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getNoticeStatusApi(data) {
  return axios.post({
    url: '/notice/status',
    data: data
  }).then((res) => {
    return res
  })
}

export function getNoticePositionApi(data) {
  return axios.post({
    url: '/notice/position',
    params: data
  }).then((res) => {
    return res
  })
}
