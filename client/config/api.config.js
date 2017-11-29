
const isPro = Object.is(process.env.NOOE_ENV,'production')

module.exports = {
    baseUrl: isPro ? 'http://qiao.yangxiong.cc/api' : 'api/'
}