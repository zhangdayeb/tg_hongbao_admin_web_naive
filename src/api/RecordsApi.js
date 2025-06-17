import axios from '@/utils/request';

export function  getRecordsListApi(data) {
  return axios.post({
    url: '/records/list',
     data: data,
  }).then((res) => {
    return res
  })
}