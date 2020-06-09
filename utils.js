const utils = {
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
    pullRefresh(list, page, res) {
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
        } else {}
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
    /* ajax请求 */
    ajax: function (url, method, data, res) {
        const promise = new Promise((resolve, reject) => {
            if (true) {
                // data.is_mobile = 0
                // data.device_info = 'wxapp'
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
                        "Yuyuan-Api": "HMR-7", //仅为实例
                        "content-type": "HMR-7", //仅为实例
                        "request-header": "HMR-7" //仅为实例
                    },
                    success: (res) => {
                        let result = res.data,
                            code = result.code,
                            msg = result.msg;
                        // console.log(url + '-->' + '请求接口返回值--->', res)
                        // console.log(url + '-->' + "接口code码返回值--->", code);
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
        res(promise)
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
    }
}

export default utils