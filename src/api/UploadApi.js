import axios from '@/utils/request';

export function  getUploadDataApi(data) {
  return axios.post({
    url: '/upload/image',
     data: data,
  }).then((res) => {
    return res
  })
}
export function  getUploadVideoApi(data) {
  return axios.post({
    url: '/upload/video',
     data: data,
  }).then((res) => {
    return res
  })
}
