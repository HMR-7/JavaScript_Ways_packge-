const utils = {
    //判断是否为全面屏手机，实现兼容性匹配
    getPhoneModel() {
        var bottom_phone_line = null;
        let model = uni.getStorageSync('phoneData').model
        if (model.indexOf('iPhone X') != -1 || model.indexOf('iPhone 11') != -1) {
            bottom_phone_line = true;
        } else {
            bottom_phone_line = false
        }
        return bottom_phone_line
    },
    /* 一键复制 */
    setClipboardData(str) {
        uni.setClipboardData({
            data: str,
            success: () => {
                uni.showToast({
                    title: "复制成功",
                    icon: "success",
                    duration: 1000
                });
            }
        });
    },
    /* 动态设置页面标题 */
    setAppTitile: (str) => {
        uni.setNavigationBarTitle({
            title: str
        });
    },
    /* 触底加载的封装 */
    reachBottom(list, page, res) {
        console.log(this, 'this');
        list = [...list, ...res]
        if (list.length == 0 && page == 1) {
            console.log("没有数据");
        }
        if (res.length == 0 && page > 1) {
            console.log(111);
            uni.showToast({
                title: "没有更多了",
                icon: "none",
                duration: 2000,
            });
            page--
        } else {
            // page++
        }
        return {
            list: list,
            page: page
        }
    },
    /* 更换对象键名 */
    changeObjKeys: (objArr, newKeys) => {
        for (let i = 0; i < objArr.length; i++) {
            let objItem = objArr[i];
            for (let key in objItem) {
                let newKey = newKeys[key];
                if (newKey) {
                    objItem[newKey] = objItem[key];
                    delete objItem[key];
                }
            }
        }
        return objArr;
    },
    /* 若对象为null、undefined、''时，转化为空对象或指定某值 */
    replaceNull: function (obj) {
        if (typeof obj === 'object') {
            Object.keys(obj).forEach(element => {
                let value = obj[element];
                if (value === null || value === undefined || value === '') {
                    obj[element] = '-';
                    // delete obj[element];
                } else if (typeof value === 'object') {
                    utils.replaceNull(value);
                }
            });
        }
        return obj;
    },
    /* 洗牌算法 */
    shuffle: (arr) => {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            // -i 从后面
            // 从前面随机取一个数的下标
            // Math.floor(x) 返回小于等于x的最大整数 向下取整
            let idx = Math.floor(Math.random() * (len - i));
            [arr[len - 1 - i], arr[idx]] = [arr[idx], arr[len - 1 - i]];
        }
        return arr;
    },
    /* ajax请求-promise+async、await */
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
    },
    /* 富文本解析 */
    formatRichText: function (html) {
        let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
            match = match.replace(/style=""/gi, '').replace(/style=''+'/gi, '');
            match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
            match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
            match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
            return match;
        });
        newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
            match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
            return match;
        });
        newContent = newContent.replace(/<br[^>]*\/>/gi, '');
        newContent = newContent.replace(/\<img/gi, `<img style="max-width:100%!important;height:auto!important;display:block!important;margin-top:0!important;margin-bottom:0!important;"`);
        return newContent;
    },
    /* 遍历查询数据中是否含有某指定值 */
    mapIndex(arr, key) {
        const idxMap = new Map()
        arr.forEach((v, i) => {
            idxMap.set(v, i)
        })
        return idxMap.has(key) ? idxMap.get(key) : -1
    },
    /* 接口对接时，不加载loading */
    apiCannotLoading: (url) => {
        var flag = false,
            urls = ['phoneCode', 'powerNum'] //此处为不添加Loading的接口名
        let f = utils.mapIndex(urls, url)
        if (f >= 0) {
            flag = true
        }
        return flag
    },
    /* 随机颜色范围 */
    randomNumber(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m);
    },
    /* 生成随机颜色 */
    randomColor() {
        return (
            "rgb(" +
            this.randomNumber(0, 255) +
            "," +
            this.randomNumber(0, 255) +
            "," +
            this.randomNumber(0, 255) +
            ")"
        );
    },
    /* 图片、视频上传 */
    upload(url, filePath, name, formData, vsize = 8, issize = 100) {
        let us = uni.getStorageSync('userInfo') || {},
            userData = {}
        if (us) {
            userData.user_id = us.id
            userData.sign = us.sign
        }
        formData = Object.assign(formData, userData)
        return new Promise((resolve, reject) => {
            const uploadTask = uni.uploadFile({
                url: api.config.url + url,
                filePath: filePath,
                name: name,
                formData: formData,
                header: {
                    "request-header": "fotile-api",
                    "yuyuan-api": "yuyuan-api"
                },
                complete: function (res) {
                    let statusCode = res.statusCode
                    if (statusCode == 200) {
                        let r = JSON.parse(res.data),
                            code = r.uploaded
                        if (code == 1) {
                            resolve(r)
                        } else {
                            reject()
                        }
                    } else {
                        console.log({
                            code: res.statusCode,
                            msg: res.errMsg
                        })
                        reject({
                            code: res.statusCode,
                            msg: res.errMsg
                        })
                    }
                }
            })
            uploadTask.onProgressUpdate((res) => {
                // console.log('上传进度', res.progress)
                // console.log('已经上传的数据长度', res.totalBytesSent)
                // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                if (name == 'files') {
                    let videoLength = (res.totalBytesSent) / 1024 / 1024
                    console.log(videoLength)
                    if (videoLength > vsize) {
                        uploadTask.abort()
                        utils.showToast(`视频大小超过${vsize}0MB，请重新上传`, false)
                    }
                } else if (name == 'upload') {
                    let imgLength = (res.totalBytesSent) / 1024 / 8
                    console.log(imgLength)
                    if (imgLength > issize) {
                        uploadTask.abort()
                        utils.showToast(`图片超过${issize}kb,请重新上传`, false)
                    }
                }
            })
        })
    },
    /* 检查是否登录 */
    checkLogin() {
        let flag = true,
            us = uni.getStorageSync('userInfo')
        if (!us) {
            flag = false
            utils.showToast('您还未登录')
            setTimeout(() => {
                utils.changePage('/pages/common/login')
            }, 600);
        }
        return flag
    }, 
}

export default utils