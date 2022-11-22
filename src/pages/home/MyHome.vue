<template>
    <MyNav></MyNav>
    <div class="search-box">
        <input type="text" class="search" placeholder="请输入关键词" />
        <p class="iconfont">&#xe694;</p>
    </div>
</template>

<script>
import MyNav from "@/components/nav/MyNav";
export default {
    name: "MyHome",
    setup() {
        return {};
    },
    components: {
        MyNav,
    },
};
</script>

<style lang="less" scoped>
@import "@/assets/font.less";

.search-box {
    width: 80%;
    height: 3.125vw;
    display: flex;
    position: relative;
    margin: 0 auto;
    .search {
        width: 100%;
        border-radius: 1.875vw;
        padding-left: 1.25vw;
    }
    p {
        font-size: 2.1875vw;
        color: #909090;
        position: absolute;
        top: 0.3125vw;
        right: 0.625vw;
    }
}
</style>