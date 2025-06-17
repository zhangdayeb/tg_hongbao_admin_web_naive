import axios from '@/utils/request';

export function loginApi(params) {
  return axios.post({
    url: '/login/index',
    data: params
  }).then((res) => {
    return res
  })
}

export function getCaptchaApi(params) {
  return axios.post({
    url: '/login/captcha',
    data: params
  }).then((res) => {
    return res
  })
}
export function AgentloginApi(params) {
  return axios.post({
    url: '/login/agent',
    data: params
  }).then((res) => {
    return res
  })
}

export function AgentloginNotice(params) {
  return axios.post({
    url: '/config/info',
    data: params
  }).then((res) => {
    return res
  })
}