import axios from '@/utils/request';

export function getRoleListApi(data) {
  return axios.post({
    url: '/role/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function getRoleAddApi(data) {
  return axios.post({
    url: '/role/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getRoleDelApi(data) {
  return axios.post({
    url: '/role/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getRoleDetailApi(data) {
  return axios.post({
    url: '/role/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getRoleEditApi(data) {
  return axios.post({
    url: '/role/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getRoleStatusApi(data) {
  return axios.post({
    url: '/role/status',
    data: data
  }).then((res) => {
    return res
  })
}
