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
    url: '/telegram/redpackets',
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

/**
 * 创建红包
 * @param {Object} data 红包信息
 * @param {string} data.title 红包标题，可选，默认值
 * @param {number} data.total_amount 红包总金额，必填
 * @param {number} data.total_count 红包总个数，必填
 * @param {number} data.packet_type 红包类型：1拼手气 2平均分配，必填
 * @param {string} data.chat_id 群组ID，必填
 * @param {number} data.expire_hours 过期时间（小时），可选，默认24
 * @returns {Promise}
 */
export function createRedPacketApi(data) {
  return axios.post({
    url: '/telegram/redpacket/create',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 抢红包
 * @param {Object} data
 * @param {string} data.packet_id 红包ID，必填
 * @returns {Promise}
 */
export function grabRedPacketApi(data) {
  return axios.post({
    url: '/telegram/redpacket/grab',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 撤回红包
 * @param {Object} data
 * @param {number} data.id 红包ID，必填
 * @returns {Promise}
 */
export function cancelRedPacketApi(data) {
  return axios.post({
    url: '/telegram/redpacket/cancel',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取红包统计数据
 * @param {Object} data 查询参数
 * @param {string} data.period 统计周期：today今日 week本周 month本月，可选，默认today
 * @returns {Promise}
 */
export function getRedPacketStatisticsApi(data) {
  return axios.post({
    url: '/telegram/redpackets/statistics',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取用户红包记录（发包/抢包）
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.type 记录类型：grabbed已抢 sent已发，可选，默认grabbed
 * @returns {Promise}
 */
export function getUserRedPacketRecordsApi(data) {
  return axios.post({
    url: '/telegram/user/redpacket/records',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取红包每日趋势
 * @param {Object} data 查询参数
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getRedPacketDailyTrendApi(data) {
  return axios.post({
    url: '/telegram/redpackets/daily-trend',
    data: data,
  }).then((res) => {
    return res
  })
}

// ================== 群组管理接口 ==================

/**
 * 获取群组列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.title 群名称搜索，可选
 * @param {string} data.crowd_id 群ID搜索，可选
 * @param {string} data.is_active 活跃状态：1活跃 0不活跃，可选
 * @param {string} data.broadcast_enabled 广播状态：1启用 0禁用，可选
 * @param {string} data.bot_status 机器人状态，可选
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getTelegramGroupListApi(data) {
  return axios.post({
    url: '/telegram/groups',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取群组详情
 * @param {Object} data
 * @param {number} data.id 群组ID，必填
 * @returns {Promise}
 */
export function getTelegramGroupDetailApi(data) {
  return axios.post({
    url: '/telegram/group/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取活跃群组列表
 * @returns {Promise}
 */
export function getActiveGroupsApi() {
  return axios.post({
    url: '/telegram/groups/active',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 获取群组统计数据
 * @returns {Promise}
 */
export function getGroupStatisticsApi() {
  return axios.post({
    url: '/telegram/groups/statistics',
    data: {},
  }).then((res) => {
    return res
  })
}

/**
 * 更新群组状态
 * @param {Object} data
 * @param {number} data.id 群组ID，必填
 * @param {number} data.is_active 活跃状态：1活跃 0不活跃，必填
 * @returns {Promise}
 */
export function updateGroupStatusApi(data) {
  return axios.post({
    url: '/telegram/group/update-status',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 更新群组广播设置
 * @param {Object} data
 * @param {number} data.id 群组ID，必填
 * @param {number} data.broadcast_enabled 广播状态：1启用 0禁用，必填
 * @returns {Promise}
 */
export function updateGroupBroadcastApi(data) {
  return axios.post({
    url: '/telegram/group/update-broadcast',
    data: data,
  }).then((res) => {
    return res
  })
}

// ================== 领取记录接口 ==================

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

/**
 * 获取领取记录详情
 * @param {Object} data
 * @param {number} data.id 记录ID，必填
 * @returns {Promise}
 */
export function getRecordDetailApi(data) {
  return axios.post({
    url: '/telegram/redpacket/record/detail',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 导出领取记录
 * @param {Object} data 导出条件
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
export function exportRecordsApi(data) {
  return axios.post({
    url: '/telegram/redpacket/records/export',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 获取领取记录统计
 * @param {Object} data 查询参数
 * @param {string} data.period 统计周期：today今日 week本周 month本月，可选，默认today
 * @returns {Promise}
 */
export function getRecordStatisticsApi(data) {
  return axios.post({
    url: '/telegram/redpacket/records/statistics',
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

// ================== 消息管理接口 ==================

/**
 * 获取消息列表
 * @param {Object} data 查询参数
 * @param {number} data.page 页码，默认1
 * @param {number} data.limit 每页数量，默认20
 * @param {string} data.chat_id 群组ID搜索，可选
 * @param {string} data.user_id 用户ID搜索，可选
 * @param {string} data.tg_user_id 用户TG_ID搜索，可选
 * @param {string} data.message_type 消息类型，可选
 * @param {string} data.start_date 开始日期 YYYY-MM-DD，可选
 * @param {string} data.end_date 结束日期 YYYY-MM-DD，可选
 * @returns {Promise}
 */
export function getTelegramMessagesApi(data) {
  return axios.post({
    url: '/telegram/messages',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 发送消息到群组
 * @param {Object} data 消息信息
 * @param {string} data.chat_id 群组ID，必填
 * @param {string} data.message 消息内容，必填
 * @param {string} data.message_type 消息类型：text文本 photo图片 video视频，可选，默认text
 * @param {string} data.media_url 媒体文件URL，发送图片/视频时必填
 * @returns {Promise}
 */
export function sendMessageToGroupApi(data) {
  return axios.post({
    url: '/telegram/send-message',
    data: data,
  }).then((res) => {
    return res
  })
}

/**
 * 群发消息
 * @param {Object} data 群发信息
 * @param {Array} data.chat_ids 群组ID数组，必填
 * @param {string} data.message 消息内容，必填
 * @param {string} data.message_type 消息类型：text文本 photo图片 video视频，可选，默认text
 * @param {string} data.media_url 媒体文件URL，发送图片/视频时必填
 * @returns {Promise}
 */
export function sendBroadcastMessageApi(data) {
  return axios.post({
    url: '/telegram/broadcast-message',
    data: data,
  }).then((res) => {
    return res
  })
}
