

// 验证码
export const getCode = (str) => {
    let canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff';
    ctx.font = 'small-caps 24px sans-serif';
    ctx.textAlign = "center";
    str = str.split("");
    for (let i = 0; i < str.length; i++) {
        ctx.fillText(str[i], (canvas.width / 4) * i + 10, (Math.random() * 20) + canvas.height / 1.8)
    }
}

