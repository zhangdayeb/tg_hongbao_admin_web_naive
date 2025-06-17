import axios from '@/utils/request';

export function  getAgentListApi(data) {
  return axios.post({
    url: '/agent/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function  getAgentAddApi(data) {
  return axios.post({
    url: '/agent/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function  getAgentDelApi(data) {
  return axios.post({
    url: '/agent/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getAgentDetailApi(data) {
  return axios.post({
    url: '/agent/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getAgentEditApi(data) {
  return axios.post({
    url: '/agent/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getAgentStatusApi(data) {
  return axios.post({
    url: '/agent/status',
    data: data
  }).then((res) => {
    return res
  })
}
