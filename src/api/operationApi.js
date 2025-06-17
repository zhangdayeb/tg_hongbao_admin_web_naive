import request from '@/utils/request';

export function getOperationApi(params) {
  return request.get({
    url: '/sysOperationRecord/getSysOperationRecordList',
    data: params
  }).then((res) => {
    return res
  })
}