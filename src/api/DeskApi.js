import axios from '@/utils/request';

export function  getDeskListApi(data) {
  return axios.post({
    url: '/desktop/list',
     data: data,
  }).then((res) => {
    return res
  })
}
export function  getIsTableXianHongApi(data) {
  return axios.post({
    url: '/desktop/isxh',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getDesktopTableApi(data) {
  return axios.post({
    url: '/desktop/table',
     data: data,
  }).then((res) => {
    return res
  })
}

export function getPrintListApi(data) {
  return axios.post({
    url: '/print/list',
     data: data,
  }).then((res) => {
    return res
  })
}


export function  getDeskAddApi(data) {
  return axios.post({
    url: '/desktop/add',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getDeskEditApi(data) {
  return axios.post({
    url: '/desktop/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getDeskDelApi(data) {
  return axios.post({
    url: '/desktop/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getDeskStatusApi(data) {
  return axios.post({
    url: '/desktop/status',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getDeskGameApi(data) {
  return axios.post({
    url: '/desktop/game',
    data: data,
  }).then((res) => {
    return res
  })
}
// 下注列表
export function  getRecordsListApi(data) {
  return axios.post({
    url: '/records/list',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getRecordsDelApi(data) {
  return axios.post({
    url: '/records/del',
     data: data,
  }).then((res) => {
    return res
  })
}
export function  getRecordsRetreatApi(data) {
  return axios.post({
    url: '/records/retreat',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getRecordsEditApi(data) {
  return axios.post({
    url: '/records/edit',
     data: data,
  }).then((res) => {
    return res
  })
}


// 露珠列表
export function  getluZzhuListApi(data) {
  return axios.post({
    url: '/luzhu/list',
     data: data,
  }).then((res) => {
    return res
  })
}
// 露珠列表
export function  getRetreatApi(data) {
  return axios.post({
    url: '/luzhu/retreat',
    data: data,
  }).then((res) => {
    return res
  })
}

// 作废露珠列表
export function  getVoidListApi(data) {
  return axios.post({
    url: '/vold/list',
    data: data,
  }).then((res) => {
    return res
  })
}

// 作废露珠列表
export function  getVoidRetreatApi(data) {
  return axios.post({
    url: '/vold/retreat',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getluZzhuAddApi(data) {
  return axios.post({
    url: '/luzhu/add',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getluZzhuEditApi(data) {
  return axios.post({
    url: '/luzhu/edit',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getluZzhuStatusApi(data) {
  return axios.post({
    url: '/luzhu/status',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getluZzhuDelApi(data) {
  return axios.post({
    url: '/luzhu/del',
     data: data,
  }).then((res) => {
    return res
  })
}


// 游戏列表
export function  getGameNameListApi(data) {
  return axios.post({
    url: '/gamename/list',
     data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameNameStatusApi(data) {
  return axios.post({
    url: '/gamename/status',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameNameAddApi(data) {
  return axios.post({
    url: '/gamename/add',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameNameEditApi(data) {
  return axios.post({
    url: '/gamename/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameNameDelApi(data) {
  return axios.post({
    url: '/gamename/del',
    data: data,
  }).then((res) => {
    return res
  })
}
// 结束
// 赔率列表
export function  getGameOddsListApi(data) {
  return axios.post({
    url: '/gameodds/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function  getGameOddsAddApi(data) {
  return axios.post({
    url: '/gameodds/add',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameOddsEditApi(data) {
  return axios.post({
    url: '/gameodds/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameOddsDelApi(data) {
  return axios.post({
    url: '/gameodds/del',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getGameOddsGameApi(data) {
  return axios.post({
    url: '/gameodds/game',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getPrintLuzhuListApi(data) {
  return axios.post({
    url: '/print/list',
    data: data,
  }).then((res) => {
    return res
  })
}


// 赔率结束


//查询游戏语言是否存在
export function  getGameLangListListApi(data) {
  return axios.post({
    url: '/gamelang/list',
    data: data,
  }).then((res) => {
    return res
  })
}
export function  getGameLangEditApi(data) {
  return axios.post({
    url: '/gamelang/edit',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getTableLangListApi(data) {
  return axios.post({
    url: '/tablelang/list',
    data: data,
  }).then((res) => {
    return res
  })
}

export function  getTableLangEditApi(data) {
  return axios.post({
    url: '/tablelang/edit',
    data: data,
  }).then((res) => {
    return res
  })
}
