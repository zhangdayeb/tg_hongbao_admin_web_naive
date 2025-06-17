import axios from '@/utils/request';
export function  getActionAddApi(data) {
  return axios.post({
    url: '/action/add',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getActionListApi(data) {
  return axios.post({
    url: '/action/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getActionDelApi(data) {
  return axios.post({
    url: '/action/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getActionDetailApi(data) {
  return axios.post({
    url: '/action/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getActionEditApi(data) {
  return axios.post({
    url: '/action/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getActionStatusApi(data) {
  return axios.post({
    url: '/action/status',
    data: data
  }).then((res) => {
    return res
  })
}
