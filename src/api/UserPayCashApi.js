import axios from '@/utils/request';

/**
 * 获取会员提现记录列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页条数
 * @param {string} data.username 用户名
 * @param {number} data.userId 用户ID
 * @param {string} data.phone 手机号
 * @param {number} data.status 提现状态 0-待审核 1-已通过 2-已拒绝
 * @param {string} data.payType 支付方式 usdt/huiwang/aba
 * @param {string} data.start 开始时间
 * @param {string} data.end 结束时间
 * @param {number} data.minAmount 最小金额
 * @param {number} data.maxAmount 最大金额
 * @param {string} data.adminName 审核员
 * @returns {Promise}
 */
export function getUserPayCashListApi(data) {
  return axios.post({
    url: '/user-pay-cash/list',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取提现记录详情
 * @param {Object} data 
 * @param {number} data.id 提现记录ID
 * @returns {Promise}
 */
export function getUserPayCashDetailApi(data) {
  return axios.post({
    url: '/user-pay-cash/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 审核提现申请（单个）
 * @param {Object} data 审核参数
 * @param {number} data.id 提现记录ID
 * @param {string} data.action 操作类型 approve-通过 reject-拒绝
 * @param {string} data.remark 审核意见
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashApproveApi(data) {
  return axios.post({
    url: '/user-pay-cash/approve',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 批量审核提现申请
 * @param {Object} data 批量审核参数
 * @param {Array} data.ids 提现记录ID数组
 * @param {string} data.action 操作类型 approve-通过 reject-拒绝
 * @param {string} data.remark 审核意见
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashBatchApproveApi(data) {
  return axios.post({
    url: '/user-pay-cash/batch-approve',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取提现统计数据
 * @param {Object} data 统计查询参数（可选）
 * @param {string} data.start 开始时间
 * @param {string} data.end 结束时间
 * @param {number} data.status 状态筛选
 * @returns {Promise}
 */
export function getUserPayCashStatisticsApi(data) {
  return axios.post({
    url: '/user-pay-cash/statistics',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 导出提现记录
 * @param {Object} data 导出参数
 * @param {string} data.start 开始时间
 * @param {string} data.end 结束时间
 * @param {number} data.status 状态筛选
 * @param {string} data.username 用户名筛选
 * @returns {Promise}
 */
export function getUserPayCashExportApi(data) {
  return axios.post({
    url: '/user-pay-cash/export',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取用户提现账户列表
 * @param {Object} data 
 * @param {number} data.userId 用户ID
 * @returns {Promise}
 */
export function getUserWithdrawalAccountsApi(data) {
  return axios.post({
    url: '/user-pay-cash/user-accounts',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取支付方式配置
 * @returns {Promise}
 */
export function getPaymentMethodsApi() {
  return axios.post({
    url: '/user-pay-cash/payment-methods',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 获取管理员列表
 * @returns {Promise}
 */
export function getAdminUsersApi() {
  return axios.post({
    url: '/user-pay-cash/admin-users',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 拒绝提现申请（专用方法）
 * @param {Object} data 
 * @param {number} data.id 提现记录ID
 * @param {string} data.reason 拒绝原因
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashRejectApi(data) {
  return axios.post({
    url: '/user-pay-cash/approve',
    data: {
      id: data.id,
      action: 'reject',
      remark: data.reason,
      password: data.password
    },
  }).then((res) => {
    return res
  })
}

/**
 * 通过提现申请（专用方法）
 * @param {Object} data 
 * @param {number} data.id 提现记录ID
 * @param {string} data.remark 审核意见（可选）
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashPassApi(data) {
  return axios.post({
    url: '/user-pay-cash/approve',
    data: {
      id: data.id,
      action: 'approve',
      remark: data.remark,
      password: data.password
    },
  }).then((res) => {
    return res
  })
}

/**
 * 批量通过提现申请
 * @param {Object} data 
 * @param {Array} data.ids 提现记录ID数组
 * @param {string} data.remark 审核意见（可选）
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashBatchPassApi(data) {
  return axios.post({
    url: '/user-pay-cash/batch-approve',
    data: {
      ids: data.ids,
      action: 'approve',
      remark: data.remark,
      password: data.password
    },
  }).then((res) => {
    return res
  })
}

/**
 * 批量拒绝提现申请
 * @param {Object} data 
 * @param {Array} data.ids 提现记录ID数组
 * @param {string} data.reason 拒绝原因
 * @param {string} data.password 操作密码（可选）
 * @returns {Promise}
 */
export function getUserPayCashBatchRejectApi(data) {
  return axios.post({
    url: '/user-pay-cash/batch-approve',
    data: {
      ids: data.ids,
      action: 'reject',
      remark: data.reason,
      password: data.password
    },
  }).then((res) => {
    return res
  })
}