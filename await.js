/* ajax请求 */
ajax: async function (url, method, data, res) {
    const promise = new Promise((resolve, reject) => {
        if (true) {
            // let userInfo = uni.getStorageSync('storaguserInfoe_key');
            if (!data) data = {};
            if (data) {
                data.user_id = userInfo.id
                data.sign = userInfo.sign
                data.openid = userInfo.openid
            }
            console.log(url + '-->' + '请求数据data--->', data)
            uni.request({
                url: api.config.url + url, //仅为示例，并非真实接口地址。
                method: method,
                data: data,
                header: {
                    "Yuyuan-Api": "Yuyuan-api",
                    "content-type": "application/x-www-form-urlencoded",
                    "request-header": "YuYuanApi"
                },
                success: (res) => {
                    let result = res.data,
                        code = result.code,
                        msg = result.msg;
                    console.log(url + '-->' + '请求接口返回值--->', res)
                    console.log(url + '-->' + "接口code码返回值--->", code);
                    if (code == 40001 || code == 0) {
                        utils.showToast(msg, false)
                        return
                    }
                    result = utils.replaceNull(result)
                    return resolve(result)
                },
            });
        } else {
            return reject('Promise异步执行失败')
        }
    })
    res(await promise)
}