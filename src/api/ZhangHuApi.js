import axios from '@/utils/request';

/**
 * 获取公司收款账户列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码
 * @param {number} data.limit 每页条数
 * @param {string} data.methodCode 支付方式 aba/huiwang/usdt
 * @param {number} data.isActive 账户状态 0-禁用 1-启用
 * @param {string} data.accountName 账户名称
 * @param {string} data.start 创建开始时间
 * @param {string} data.end 创建结束时间
 * @returns {Promise}
 */
export function getDepositAccountListApi(data) {
  return axios.post({
    url: '/zhanghu/list',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取收款账户详情
 * @param {Object} data 
 * @param {number} data.id 账户ID
 * @returns {Promise}
 */
export function getDepositAccountDetailApi(data) {
  return axios.post({
    url: '/zhanghu/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 添加收款账户
 * @param {Object} data 账户信息
 * @param {string} data.methodCode 支付方式 aba/huiwang/usdt
 * @param {string} data.accountName 账户名称
 * @param {string} data.accountNumber 账户号码（ABA/汇旺）
 * @param {string} data.bankName 银行名称（ABA）
 * @param {string} data.phoneNumber 手机号码（汇旺）
 * @param {string} data.walletAddress 钱包地址（USDT）
 * @param {string} data.networkType 网络类型（USDT）TRC20/ERC20/BSC
 * @param {string} data.qrCodeUrl 二维码URL（USDT）
 * @param {number} data.isActive 是否启用 0-禁用 1-启用
 * @param {number} data.dailyLimit 日限额
 * @param {number} data.balanceLimit 余额限制
 * @param {string} data.remark 备注
 * @returns {Promise}
 */
export function addDepositAccountApi(data) {
  return axios.post({
    url: '/zhanghu/add',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 编辑收款账户
 * @param {Object} data 账户信息
 * @param {number} data.id 账户ID
 * @param {string} data.accountName 账户名称
 * @param {string} data.accountNumber 账户号码
 * @param {string} data.bankName 银行名称
 * @param {string} data.phoneNumber 手机号码
 * @param {string} data.walletAddress 钱包地址
 * @param {string} data.networkType 网络类型
 * @param {string} data.qrCodeUrl 二维码URL
 * @param {number} data.isActive 是否启用
 * @param {number} data.dailyLimit 日限额
 * @param {number} data.balanceLimit 余额限制
 * @param {string} data.remark 备注
 * @returns {Promise}
 */
export function updateDepositAccountApi(data) {
  return axios.post({
    url: '/zhanghu/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 删除收款账户
 * @param {Object} data 
 * @param {number} data.id 账户ID
 * @returns {Promise}
 */
export function deleteDepositAccountApi(data) {
  return axios.post({
    url: '/zhanghu/del',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 切换账户状态
 * @param {Object} data 
 * @param {number} data.id 账户ID
 * @param {number} data.isActive 状态 0-禁用 1-启用
 * @returns {Promise}
 */
export function toggleDepositAccountStatusApi(data) {
  return axios.post({
    url: '/zhanghu/status',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 批量操作账户状态
 * @param {Object} data 
 * @param {Array} data.ids 账户ID数组
 * @param {number} data.isActive 状态 0-禁用 1-启用
 * @returns {Promise}
 */
export function batchToggleDepositAccountStatusApi(data) {
  return axios.post({
    url: '/zhanghu/batch_status',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取统计数据
 * @param {Object} data 查询条件
 * @param {string} data.methodCode 支付方式筛选
 * @param {number} data.isActive 状态筛选
 * @param {string} data.start 开始时间
 * @param {string} data.end 结束时间
 * @returns {Promise}
 */
export function getDepositAccountStatisticsApi(data) {
  return axios.post({
    url: '/zhanghu/statistics',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 导出账户列表
 * @param {Object} data 导出条件
 * @param {string} data.methodCode 支付方式筛选
 * @param {number} data.isActive 状态筛选
 * @param {string} data.start 开始时间
 * @param {string} data.end 结束时间
 * @returns {Promise}
 */
export function exportDepositAccountsApi(data) {
  return axios.post({
    url: '/zhanghu/export',
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
 * 获取支付方式配置
 * @returns {Promise}
 */
export function getPaymentMethodsConfigApi() {
  return axios.post({
    url: '/zhanghu/payment_methods',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 更新账户使用统计
 * @param {Object} data 
 * @param {number} data.id 账户ID
 * @returns {Promise}
 */
export function updateAccountUsageApi(data) {
  return axios.post({
    url: '/zhanghu/update_usage',
    data: data,
  }).then((res) => {
    return res
  })
}