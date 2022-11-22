
// 防抖（最后一次调用）
export function debounce(fn, time = 1000) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn()
        }, time);
    }
}
// 节流（规定时间内调用）
export function throttling(fn, time = 1000) {
    let timer = 0;
    return function () {
        let times = new Date().getTime();
        if (times - timer > time) {
            fn();
            timer = times;
        }
    }
}