import axios from '@/utils/request';

// ================== 红包管理接口 ==================

/**
 * 获取红包列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.packet_id 红包ID搜索，可选
 * @param {string} data.title 红包标题搜索，可选
 * @param {string} data.sender_tg_id 发送者TG_ID搜索，可选
 * @param {string} data.chat_id 群组ID筛选，可选
 * @param {string} data.status 红包状态：1进行中 2已抢完 3已过期 4已撤回 5已取消，可选
 * @param {string} data.packet_type 红包类型：1拼手气 2平均分配，可选
 * @param {string} data.is_system 是否系统红包：1是 0否，可选
 * @param {string} data.min_amount 最小金额，可选
 * @param {string} data.max_amount 最大金额，可选
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getRedPacketListApi(data) {
  return axios.post({
    url: '/telegram/redpacket/list',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取红包详情
 * @param {Object} data
 * @param {number} data.id 红包ID，必填
 * @returns {Promise}
 */
export function getRedPacketDetailApi(data) {
  return axios.post({
    url: '/telegram/redpacket/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

// ================== 红包领取记录管理接口 ==================

/**
 * 获取领取记录列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.packet_id 红包ID搜索，可选
 * @param {string} data.user_tg_id 用户TG_ID搜索，可选
 * @param {string} data.username 用户名搜索，可选
 * @param {string} data.chat_id 群组ID筛选，可选
 * @param {string} data.min_amount 最小金额，可选
 * @param {string} data.max_amount 最大金额，可选
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getRedPacketRecordsApi(data) {
  return axios.post({
    url: '/telegram/redpacket/records',
    data: data,
  }).then((res) => {
    return res
  })
}

// ================== 广告管理接口 ==================

/**
 * 获取广告列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.title 广告标题搜索，可选
 * @param {string} data.send_mode 发送模式：immediate立即 scheduled定时 recurring循环，可选
 * @param {string} data.status 状态：draft草稿 active活跃 completed完成 cancelled取消，可选
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getAdvertisementListApi(data) {
  return axios.post({
    url: '/telegram/advertisements',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取广告详情
 * @param {Object} data
 * @param {number} data.id 广告ID，必填
 * @returns {Promise}
 */
export function getAdvertisementDetailApi(data) {
  return axios.post({
    url: '/telegram/advertisement/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 创建广告
 * @param {Object} data 广告信息
 * @param {string} data.title 广告标题，必填
 * @param {string} data.content 广告内容，必填
 * @param {string} data.send_mode 发送模式：immediate立即 scheduled定时 recurring循环，必填
 * @param {Array} data.target_groups 目标群组ID数组，必填
 * @param {string} data.send_time 发送时间 YYYY-MM-DD HH:mm:ss，定时发送时必填
 * @param {string} data.recurrence_pattern 循环模式：daily每日 weekly每周 monthly每月，循环发送时必填
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，循环发送时必填
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，循环发送时可选
 * @returns {Promise}
 */
export function createAdvertisementApi(data) {
  return axios.post({
    url: '/telegram/advertisement/create',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 更新广告
 * @param {Object} data 广告信息
 * @param {number} data.id 广告ID，必填
 * @param {string} data.title 广告标题，可选
 * @param {string} data.content 广告内容，可选
 * @param {string} data.send_mode 发送模式，可选
 * @param {Array} data.target_groups 目标群组ID数组，可选
 * @param {string} data.send_time 发送时间，可选
 * @param {string} data.recurrence_pattern 循环模式，可选
 * @param {string} data.start_date 开始日期，可选
 * @param {string} data.end_date 结束日期，可选
 * @returns {Promise}
 */
export function updateAdvertisementApi(data) {
  return axios.post({
    url: '/telegram/advertisement/update',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 删除广告
 * @param {Object} data
 * @param {number} data.id 广告ID，必填
 * @returns {Promise}
 */
export function deleteAdvertisementApi(data) {
  return axios.post({
    url: '/telegram/advertisement/delete',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 发送广告
 * @param {Object} data
 * @param {number} data.id 广告ID，必填
 * @returns {Promise}
 */
export function sendAdvertisementApi(data) {
  return axios.post({
    url: '/telegram/advertisement/send',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取广告统计
 * @param {Object} data 查询参数
 * @param {string} data.period 统计周期：today今日 week本周 month本月，可选，默认today
 * @returns {Promise}
 */
export function getAdvertisementStatisticsApi(data) {
  return axios.post({
    url: '/telegram/advertisements/statistics',
    data: data,
  }).then((res) => {
    return res
  })
}


// ================== 机器人配置管理接口 ==================

/**
 * 获取机器人配置
 * @returns {Promise}
 */
export function getBotConfigApi() {
  return axios.post({
    url: '/telegram/bot/config',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 更新机器人配置
 * @param {Object} data 配置信息
 * @param {string} data.welcome 欢迎消息，必填
 * @param {string} data.button1_name 按钮1名称，可选
 * @param {string} data.button1_url 按钮1链接，可选
 * @param {string} data.button2_name 按钮2名称，可选
 * @param {string} data.button2_url 按钮2链接，可选
 * @param {string} data.button3_name 按钮3名称，可选
 * @param {string} data.button3_url 按钮3链接，可选
 * @param {string} data.button4_name 按钮4名称，可选
 * @param {string} data.button4_url 按钮4链接，可选
 * @param {string} data.button5_name 按钮5名称，可选
 * @param {string} data.button5_url 按钮5链接，可选
 * @param {string} data.button6_name 按钮6名称，可选
 * @param {string} data.button6_url 按钮6链接，可选
 * @returns {Promise}
 */
export function updateBotConfigApi(data) {
  return axios.post({
    url: '/telegram/bot/config/update',
    data: data,
  }).then((res) => {
    return res
  })
}
