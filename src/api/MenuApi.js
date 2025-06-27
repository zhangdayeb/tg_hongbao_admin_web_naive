import axios from '@/utils/request';

export function getMenuListApi(data) {
  return axios.post({
    url: '/menu/column',
    data: data,
  }).then((res) => {
    return res
  })
}
export function getMenuAddApi(data) {
  return axios.post({
    url: '/menu/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getMenuDelApi(data) {
  return axios.post({
    url: '/menu/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMenuDetailApi(data) {
  return axios.post({
    url: '/menu/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMenuEditApi(data) {
  return axios.post({
    url: '/menu/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getMenuStatusApi(data) {
  return axios.post({
    url: '/menu/status',
    data: data
  }).then((res) => {
    return res
  })
}
