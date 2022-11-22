<template>
    <div id="box">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    setup() {},
};
</script>

<style lang="less">
@import "@/assets/font.less";
body,
.iconfont {
    margin: 0;
    padding: 0;
    color: #fff;
}
input {
    font-family: PageFont;
    outline: none;
    border: none;
}
p,
span,
input,
label {
    font-size: 1.25vw;
    user-select: none;
}
body {
    font-family: PageFont !important;
    background-color: rgb(226, 217, 202);
}
#box {
    width: 100vw;
    height: 100vh;
    min-width: 900px;
    overflow: hidden;
}
</style>
