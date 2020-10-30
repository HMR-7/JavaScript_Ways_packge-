const dom_utils = {
    /* 1、动态添加脚本、兼容IE浏览器 */
    loadScript(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    },
    /* 2、动态创建样式 */
    loadStyles(url) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        let head = document.getElementsByTagName("head")[0];
        head.appendChild(link);
    },
}