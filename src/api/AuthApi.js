import axios from '@/utils/request';

export function  getAuthActionListApi(data) {
  return axios.post({
    url: '/auth/action',
     data: data,
  }).then((res) => {
    return res
  })
}
export function  getAuthActionEditApi(data) {
  return axios.post({
    url: '/auth/action_edit',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getAuthMenuListApi(data) {
  return axios.post({
    url: '/auth/menu',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getAuthMenuEditApi(data) {
  return axios.post({
    url: '/auth/menu_edit',
     data: data,
  }).then((res) => {
    return res
  })
}
