<template>
    <div class="title">
        <p class="sign iconfont" @click="goToLogin" v-show="!user.userInfo.id">
            &#xe646;
        </p>
        <div class="nav" v-show="user.userInfo.id">
            <p class="message iconfont">&#xe60e;</p>
            <div class="personal" @click="gotoInfo">
                <img :src="user.userInfo.user_pic" />
                <div class="user-name">
                    <span>{{ user.userInfo.name }}</span>
                    <span>{{ user.userInfo.autograph }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import { userStore } from "@/store";
import { onMounted } from "vue";
import xhr from "@/utils/request";

export default {
    name: "MyNav",
    setup() {
        const user = userStore();

        const router = useRouter();
        const goToLogin = () => {
            router.push({
                path: "/login",
            });
        };
        function gotoInfo() {
            router.push({
                path: "/info",
            });
        }
        onMounted(async () => {
            let res = await xhr.get("/info/userInfo");
            if (res.status == 3) {
                user.upDataUserInfo(res.data);
            }
        });
        return { user, goToLogin, gotoInfo };
    },
};
</script>

<style lang="less" scoped>
.title {
    width: 100vw;
    height: 2.0833vw;
    padding-top: 1.875vw;
    margin-bottom: 1.25vw;
    .sign {
        width: 100%;
        margin-left: -6.5vw;
        text-align: right;
        font-size: 1.875vw;
    }
    .nav {
        width: 90%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .message {
            font-size: 1.875vw;
            margin-right: 2.5vw;
        }
        .personal {
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            img {
                border-radius: 50%;
                width: 2.5vw;
                height: 2.5vw;
            }
            .user-name {
                display: flex;
                flex-direction: column;
                align-items: center;
                span {
                    width: 8.75vw;
                    height: 1.25vw;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                span:first-child {
                    font-weight: 600;
                    font-size: 0.8333vw;
                }
                span:last-child {
                    text-align: left;
                    font-size: 0.625vw;
                    transform: scale(0.8);
                }
            }
        }
    }
}
</style>