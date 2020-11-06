const utils = {
    /*1、pc端获取url请求参数 */
    getQueryStringArgs: (http) => {
        let qs = (http.length > 0 ? http.substring(1) : ''),
            args = {},
            items = qs.length ? qs.split("&") : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value
            }
        }
        // console.log(args["id"]);
        return args;
    },
    //获取url路径的传递参数
    /* 示例:获取url栏中的id参数值
        var id = getQueryVariable('id')
    */
    /* 1、简易版 */
    getQueryVariable: (variable) => {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    },
    /* 2、更换对象键名 */
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
    /* 3、若对象为null、undefined、''时，转化为空对象或指定某值 */
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
    /* 4、洗牌算法 */
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
    /* 5、遍历查询数据中是否含有某指定值 */
    mapIndex(arr, key) {
        const idxMap = new Map()
        arr.forEach((v, i) => {
            idxMap.set(v, i)
        })
        return idxMap.has(key) ? idxMap.get(key) : -1
    },
    /* 6、随机颜色范围 */
    randomNumber(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m);
    },
    /* 7、生成随机颜色 */
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
    //8、获取时间，type时间粒度默认为：seconds
    getDate(type = 'seconds') {
        let d = new Date();
        let year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();
        JSON.stringify(month).length == 1 ? month = `${'0' + month}` : month = month
        JSON.stringify(hours).length == 1 ? hours = `${'0' + hours}` : hours = hours
        JSON.stringify(minutes).length == 1 ? minutes = `${'0' + minutes}` : minutes = minutes
        JSON.stringify(seconds).length == 1 ? seconds = `${'0' + seconds}` : seconds = seconds
        switch (type) {
            case "year":
                return `${year}`;
            case "month":
                return `${year}-${month}`
            case "day":
                let end = utils.getAfterNYear(`${year}-${month}-${day}`, 10)
                return {
                    normal: `${year}年${month}月${day}日`, special: `${year}-${month}-${day}`, end: end
                };
            case "hours":
                return `${year}-${month}-${day}-${hours}`
            case "minutes":
                return `${year}-${month}-${day}-${hours}:${minutes}`
            default:
                return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
        }
    },
    /**9、
     * 计算N年后,YYYYMMDD
     * startdate：为开始时间，格式YYYYMMDD
     * nextYear：为间隔年月，如1表示一年后，2表示两年后
     */
    getAfterNYear(startdate, nextYear) {
        let expriedYear = parseInt(startdate.substring(0, 4)) + nextYear;
        let expriedMonth = startdate.substring(5, 7);
        let expriedDay = startdate.substring(8);
        //考虑二月份场景，若N年后的二月份日期大于该年的二月份的最后一天，则取该年二月份最后一天
        if (expriedMonth == '02' || expriedMonth == 2) {
            let monthEndDate = new Date(expriedYear, expriedMonth, 0).getDate();
            if (parseInt(expriedDay) > monthEndDate) { //为月底时间
                //取两年后的二月份最后一天
                expriedDay = monthEndDate;
            }
        }
        return expriedYear + '-' + expriedMonth + '-' + expriedDay;
    },
    /* 10、去除字符串中端所有空格 */
    trim(str) {
        return str.replace(/\s/g, "");
    },
    /* 11、数字从右往左每第3位数，添加逗号 */
    formatMoney = (num) => {
        if (typeof num == 'number') {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } else {
            num = num.replace(/\s/g, ""); //去除空格
            num = num.replace(/^[0]+/, '') //去除首位为0的数字
            num = num.replace(/[`.`]/, '0.') //检测点符号,防止小数点前一位0被去除
            return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
    },
    /* 12、存储 setSessionItem ,name为存储的自定义昵称，content为要存储的数据 */
    setSessionItem = (name, content) => {
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        window.sessionStorage.setItem(name, content);
    },
    /* 13、读取浏览器的setSessionItem  */
    getSessionItem = name => {
        if (!name) return;
        return window.sessionStorage.getItem(name);
    },
    /* 14、删除浏览器的setSessionItem  */
    removeSessionItem = name => {
        if (!name) return;
        window.sessionStorage.removeItem(name);
    },
    /* 15、防抖->可实现模糊搜索，即输入框延迟搜索 */
    blurrSearch = (fn, waitTime) => {
        let timeOutId = 0;
        waitTime = waitTime || 500;
        return function () {
            clearTimeout(timeOutId);
            let t = this;
            let args = arguments;
            timeOutId = setTimeout(function () {
                fn.call(t, args[0])
            }, waitTime)
        }
    },
    /* 16、节流函数 */
    throttle(fn, interval) {
        let enterTime = 0;
        let gapTime = interval || 3000;
        return function () {
            let that = this;
            let args = arguments;
            let backTime = new Date();
            if (backTime - enterTime > gapTime) {
                fn.call(that, args);
                enterTime = backTime
            }
        }
    },
    /* 17、动态添加脚本 */
    loadScript(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    },
    /* 18、获取url后方全部的请求参数 */
    GetRequest() {
        let url = window.location.search; //获取url中"?"符后的字串  
        let theRequest = {};
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]); //对字符串解码
            }
        }
        console.log("所有参数名称", theRequest);
        return theRequest;
    }
}