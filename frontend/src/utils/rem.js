(function(win, doc) {
    const docEl = doc.documentElement

    function setRem() {
        // 获取根元素宽度，设定 320px ~ 540px 的安全自适应区间
        // 杜绝 PC 宽屏下（如 1920px）字体暴增变形，同时保障各种大屏/小屏手机完美缩放
        const clientWidth = docEl.clientWidth
        const effectiveWidth = Math.min(Math.max(clientWidth, 320), 540)
        docEl.style.fontSize = effectiveWidth / 10 + 'px'
    }

    setRem()
    win.addEventListener('resize', setRem)
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) setRem()
    })

    // 设置 body 基础字号为 16px
    doc.body.style.fontSize = '16px'
})(window, document)