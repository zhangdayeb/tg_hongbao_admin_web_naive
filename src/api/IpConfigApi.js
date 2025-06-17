import axios from '@/utils/request';

export function getIpConfigListApi(data) {
  return axios.post({
    url: '/ipconfig/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getIpConfigAddApi(data) {
  return axios.post({
    url: '/ipconfig/add',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getIpStatusApi(data) {
  return axios.post({
    url: '/ipconfig/status',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getIpConfigDelApi(data) {
  return axios.post({
    url: '/ipconfig/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getIpConfigDetailApi(data) {
  return axios.post({
    url: '/ipconfig/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getIpConfigEditApi(data) {
  return axios.post({
    url: '/ipconfig/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getIpConfigStatusApi(data) {
  return axios.post({
    url: '/ipconfig/status',
    params: data
  }).then((res) => {
    return res
  })
}
