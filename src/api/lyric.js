import axios from 'axios'
import { commonParams } from './config'

export function getLyric(mid) {
  const url = '/lyric'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    var ret = res.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    // res.json(ret)
    return Promise.resolve(ret)
  })
}