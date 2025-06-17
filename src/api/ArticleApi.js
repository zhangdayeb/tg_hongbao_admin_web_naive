import axios from '@/utils/request';

export function getArticleListApi(data) {
  return axios.post({
    url: '/article/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function getArticleAddApi(data) {
  return axios.post({
    url: '/article/add',
    data: data,
  }).then((res) => {
    return res
  })
}


export function getArticleDelApi(data) {
  return axios.post({
    url: '/article/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getArticleDetailApi(data) {
  return axios.post({
    url: '/article/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getArticleEditApi(data) {
  return axios.post({
    url: '/article/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function getArticleStatusApi(data) {
  return axios.post({
    url: '/article/status',
    params: data
  }).then((res) => {
    return res
  })
}
