import axios from '@/utils/request';

export function getLoginListApi(data) {
  return axios.post({
    url: '/login/log',
       data: data,
  }).then((res) => {
    return res
  })
}
