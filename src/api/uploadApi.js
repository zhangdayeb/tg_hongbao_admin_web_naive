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


/**
 * 上传二维码图片
 * @param {FormData} formData 包含图片文件的FormData
 * @returns {Promise}
 */
export function uploadQRCodeApi(formData) {
  return axios.post({
    url: '/upload/qrcode',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    return res
  })
}

/**
 * 获取二维码列表
 * @returns {Promise}
 */
export function getQRCodeListApi() {
  return axios.post({
    url: '/upload/qrcode_list',
    data: {}
  }).then((res) => {
    return res
  })
}

/**
 * 通用图片上传
 * @param {FormData} formData 包含图片文件的FormData
 * @returns {Promise}
 */
export function uploadImageApi(formData) {
  return axios.post({
    url: '/upload/image',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    return res
  })
}

/**
 * 视频上传
 * @param {FormData} formData 包含视频文件的FormData
 * @returns {Promise}
 */
export function uploadVideoApi(formData) {
  return axios.post({
    url: '/upload/video',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    return res
  })
}




