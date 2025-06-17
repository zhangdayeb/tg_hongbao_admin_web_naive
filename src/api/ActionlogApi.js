import axios from '@/utils/request';

export function getActionListApi(data) {
  return axios.post({
    url: '/admin/log',
       data: data,
  }).then((res) => {
    return res
  })
}
