// src/api/notificationApi.js
import axios from '@/utils/request'

/**
 * 获取最新的充值/提现记录
 * @param {Object} data 查询参数
 * @param {string} data.lastCheckTime 最后检查时间戳
 * @param {number} data.limit 获取记录数量限制
 * @returns {Promise} API响应
 */
export function getLatestRecords(data = {}) {
  return axios.post({
    url: '/api/notification/latest-records',
    data: {
      lastCheckTime: data.lastCheckTime || null,
      limit: data.limit || 10,
      types: 'recharge,withdraw' // 获取充值和提现记录
    }
  })
}

/**
 * 获取最新充值记录
 * @param {Object} data 查询参数
 * @returns {Promise} API响应
 */
export function getLatestRecharges(data = {}) {
  return axios.post({
    url: '/api/notification/latest-recharges',
    data: {
      lastCheckTime: data.lastCheckTime || null,
      limit: data.limit || 5
    }
  })
}

/**
 * 获取最新提现记录
 * @param {Object} data 查询参数
 * @returns {Promise} API响应
 */
export function getLatestWithdraws(data = {}) {
  return axios.post({
    url: '/api/notification/latest-withdraws',
    data: {
      lastCheckTime: data.lastCheckTime || null,
      limit: data.limit || 5
    }
  })
}

/**
 * 标记通知已读
 * @param {Object} data 请求数据
 * @param {Array} data.recordIds 记录ID数组
 * @returns {Promise} API响应
 */
export function markNotificationsRead(data) {
  return axios.post({
    url: '/api/notification/mark-read',
    data: {
      recordIds: data.recordIds || []
    }
  })
}

/**
 * 测试接口
 * @returns {Promise} API响应
 */
export function testNotificationApi() {
  return axios.post({
    url: '/api/notification/test',
    data: {} // POST请求需要data对象，token会自动添加
  })
}

/**
 * 手动触发通知 (测试用)
 * @param {Object} data 请求数据
 * @param {string} data.type 通知类型 recharge/withdraw
 * @returns {Promise} API响应
 */
export function triggerNotification(data) {
  return axios.post({
    url: '/api/notification/trigger',
    data: {
      type: data.type || 'recharge'
    }
  })
}