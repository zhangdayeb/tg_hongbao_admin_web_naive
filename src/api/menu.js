import axios from '@/utils/request';

export function getMenuListApi() {
  return axios.post({
    url: '/menu/list'
  }).then((res) => {
    return res
  })
}
