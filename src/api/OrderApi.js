import axios from '@/utils/request';

export function  getOrderListApi(data) {
  return axios.post({
    url: '/order/list',
     data: data,
  }).then((res) => {
    return res
  })
}

export function getOrderEditApi(data) {
  return axios.post({
    url: '/order/edit',
    data: data,
  }).then((res) => {
    return res
  })
}
