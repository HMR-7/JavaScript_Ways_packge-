/* ajax请求 */
ajax: async (url, method, data, res) => {
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
                    "HMR": "HMR",
                    "content-type": "application/x-www-form-urlencoded",
                    "request-header": "HMR"
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

/* ajax请求-promise */
ajax: async (url, method, data, res) => {
    const promise = new Promise((resolve, reject) => {
        let userInfo = uni.getStorageSync('storaguserInfoe_key');
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
                "HMR": "HMR",
                "content-type": "application/x-www-form-urlencoded",
                "request-header": "HMR"
            },
            success: (res) => {
                if (res.statusCode == 200) {
                    let result = res.data,
                        code = result.code,
                        msg = result.msg;
                    // console.log(url + '-->' + '请求接口返回值--->', res)
                    // console.log(url + '-->' + "接口code码返回值--->", code);
                    switch (key) {
                        case 1:
                            result = utils.replaceNull(result)
                            resolve({
                                data: result,
                                code: code,
                                msg: msg
                            })
                            break;
                        default:
                            result = utils.replaceNull(result)
                            reject({
                                data: result,
                                code: code,
                                msg: msg
                            })
                            break;
                    }
                } else {
                    reject({
                        code: res.statusCode,
                        msg: res.errMsg
                    });

                }
            },
            fail: err => {
                reject(err)
            }
        });
    })
    res(promise)
}