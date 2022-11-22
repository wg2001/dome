// ?封装压缩图片并转为为base64的方法
// 传入值必须是通过file获取的对象
export default function (file) {
    return new Promise((resolve) => {

        let fileReader = new FileReader()
        fileReader.onload = () => {
            // 这就是我们这一步需要的base64
            let base64 = fileReader.result

            let img = new Image()
            // img.crossOrigin = '*'
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                // 图片原始尺寸
                var originWidth = this.width;
                var originHeight = this.height;
                // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                var maxWidth = 500;
                var maxHeight = 500;
                // 目标尺寸
                var targetWidth = originWidth, targetHeight = originHeight;
                // 图片尺寸超过最大值的限制
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                //压缩后的图片转base64 url  ，第2个参数为还原度
                var base64Url = canvas.toDataURL('image/jpeg', 0.92)
                //比较两次图片的大小，选择小的图片
                resolve(base64Url.length / 1024 < base64.length / 1024 ? base64Url : base64)
                canvas = null
            }
            img.onError = function () {
                alert('图片加载失败')
            }
            img.src = base64

        }
        //把file对象转成fileReader对象
        fileReader.readAsDataURL(file)

    })
}