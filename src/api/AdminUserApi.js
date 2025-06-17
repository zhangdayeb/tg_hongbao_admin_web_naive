import axios from '@/utils/request';

export function getAdminUserListApi(data) {
  return axios.post({
    url: '/admin/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function getAdminUserAddApi(data) {
  return axios.post({
    url: '/admin/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getAdminUserDelApi(data) {
  return axios.post({
    url: '/admin/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getAdminUserDetailApi(data) {
  return axios.post({
    url: '/admin/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getAdminUserEditApi(data) {
  return axios.post({
    url: '/admin/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getAdminUserStatusApi(data) {
  return axios.post({
    url: '/user/status',
    params: data
  }).then((res) => {
    return res
  })
}
