<template>
    <!-- 背景图 -->
    <div id="lognbg"></div>

    <!-- 登录注册框 -->
    <div id="sign">
        <div class="switch-box">
            <div class="switch">
                <p :class="active ? '' : 'active-bg'"></p>
                <span :class="active ? 'active' : ''" @click="activeClass(true)"
                    >登录</span
                >
                <span
                    :class="!active ? 'active' : ''"
                    @click="activeClass(false)"
                    >注册</span
                >
            </div>
        </div>

        <transition
            name="animate__animated animate__bounce"
            enter-active-class="animate__jello"
            leave-active-class="animate__backOutDown"
            appear
            mode="out-in"
        >
            <!-- 登录 -->
            <div id="signin" key="t-1" v-if="active">
                <form id="formuser">
                    <label
                        >账号：<input
                            type="text"
                            placeholder="请输入账号"
                            v-model="username"
                        />
                    </label>
                    <label
                        >密码：<input
                            type="password"
                            autocomplete="off"
                            placeholder="请输入密码"
                            v-model="password"
                    /></label>
                </form>
                <div class="release">
                    <input
                        type="text"
                        v-model="code"
                        placeholder="输入验证码"
                    />
                    <canvas id="canvas" width="70" height="40"></canvas>
                    <span class="txt" @click="getCodes"
                        ><p class="iconfont">&#xe782;</p>
                        <span>刷新 <br />一下</span></span
                    >
                </div>
                <!-- 记住密码 -->
                <label class="pass">
                    <input type="checkbox" v-model="memory" />
                    <span>记住密码</span>
                </label>
                <button @click="signIn">登录</button>
            </div>
            <!-- 注册 -->
            <div id="register" key="t-2" v-else>
                <form id="formuser">
                    <div class="code">
                        <label>
                            邮箱：<input
                                type="text"
                                placeholder="请输入注册邮箱"
                                v-model="email"
                            />
                        </label>
                        <span @click="sendCode">{{ time }}</span>
                    </div>
                    <div class="code-box">
                        <input
                            type="text"
                            placeholder="输入验证码"
                            v-model="emailCode"
                        />
                    </div>
                    <label
                        >账号：<input
                            type="text"
                            placeholder="字母和数字组成(8位)"
                            class="username"
                            v-model="username"
                        />
                    </label>
                    <label
                        >密码：<input
                            type="password"
                            autocomplete="off"
                            placeholder="至少一个特殊字符、大、小写字母和数字组成(8位)"
                            class="password"
                            v-model="password"
                    /></label>
                    <label
                        >确认密码：<input
                            type="password"
                            autocomplete="off"
                            placeholder="请再次输入密码"
                            class="put-w"
                            v-model="newPassword"
                    /></label>
                </form>
                <button @click="signUp">注册</button>
            </div>
        </transition>
    </div>
</template>

<script>
import { reactive, toRefs, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getCode } from "@/canvas";
import { userStore } from "@/store";
import { throttling } from "@/utils";
import xhr from "@/utils/request";
const Base64 = require("js-base64").Base64;

export default {
    name: "MyLogin",
    setup() {
        const router = useRouter();
        const user = userStore();
        let state = reactive({
            username: null,
            password: null,
            newPassword: null,
            code: null,
            active: true,
            time: "发送验证码",
            email: null,
            emailCode: null,
            memory: true,
        });
        // 随机验证码
        let str = Math.random().toString().slice(2, 6);

        // 点击登录按钮
        const signIn = throttling(async () => {
            if (state.code == str) {
                let res = await xhr.post("/login/signIn", {
                    username: state.username,
                    password: state.password,
                });
                if (res.status == 0) {
                    // 登录成功后判断是否勾选记住密码
                    if (state.memory) {
                        let pass = {
                            username: Base64.encode(state.username),
                            password: Base64.encode(state.password),
                        };
                        localStorage.setItem("user", JSON.stringify(pass));
                    }
                    // 登录成功保存token
                    user.upDataToken(res.token);
                    localStorage.setItem("token", res.token);
                    router.replace({
                        path: "/home",
                    });
                }
            } else {
                ElMessage({
                    type: "error",
                    message: "验证码错误",
                });
                // 验证码错误重新调用
                str = Math.random().toString().slice(2, 6);
                getCode(str);
            }
        }, 3000);
        // 点击注册按钮
        const signUp = throttling(async () => {
            if (state.newPassword == state.password) {
                let res = await xhr.post("/login/signUp", {
                    username: state.username,
                    password: state.password,
                    email: state.email,
                    code: state.emailCode,
                });
                if (res.status == 0) {
                    localStorage.clear();
                    setTimeout(() => {
                        state.active = true;
                    }, 2000);
                }
            } else {
                ElMessage({
                    type: "error",
                    message: "二次密码错误",
                });
            }
        }, 3000);
        // 注册登录的切换
        function activeClass(b) {
            state.active = b;
            // 如果注册就把密码和用户名清空
            if (!b) {
                state.username = "";
                state.password = "";
            }
        }
        // 如果从注册切换到登录刷新验证码
        watchEffect(() => {
            if (state.active) {
                // 读取本地存储转换为对象
                if (localStorage.getItem("user")) {
                    let { username, password } = JSON.parse(
                        localStorage.getItem("user")
                    );
                    // 用来解密密码和用户名
                    if (username && password) {
                        state.username = Base64.decode(username);
                        state.password = Base64.decode(password);
                    }
                }
                setTimeout(() => {
                    str = Math.random().toString().slice(2, 6);
                    getCode(str);
                }, 1020);
            }
        });
        // 点击刷新验证码
        function getCodes() {
            str = Math.random().toString().slice(2, 6);
            getCode(str);
        }
        // 注册页发送验证码
        const sendCode = throttling(async () => {
            let res = await xhr.post("/login/sendCode", {
                email: state.email,
            });
            if (res.status == 0) {
                if (state.time !== "发送验证码") return;
                state.time = 10;
                let timer = setInterval(() => {
                    state.time--;
                    if (state.time <= 0) {
                        clearInterval(timer);
                        state.time = "发送验证码";
                    }
                }, 1000);
            }
        }, 3000);

        return {
            activeClass,
            ...toRefs(state),
            getCodes,
            signIn,
            signUp,
            sendCode,
        };
    },
};
</script>

<style lang="less" scoped>
input {
    background: none;
    border-bottom: 1px solid rgb(226, 217, 202);
    color: rgb(226, 217, 202);
}
input::-webkit-input-placeholder {
    color: rgb(226, 217, 202) !important;
    font-size: 0.625vw;
}
// 背景图
#lognbg {
    width: 100%;
    height: 100vh;
    position: absolute;
    right: 0;
    bottom: 0;
    background: url("../../assets/img/signBg.webp") no-repeat left bottom;
    background-size: 34.375vw;
}
// 登录
#sign {
    width: 30%;
    transform: translate(50vw, 10vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    .switch-box {
        width: 100%;
        margin-bottom: 0.625vw;
        .switch {
            width: 24%;
            margin: auto;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-radius: 1.25vw;
            padding: 0.1042vw;
            position: relative;
            span {
                width: 50%;
                text-align: center;
                padding: 0.3125vw;
                color: #fff;
                cursor: pointer;
            }
            p {
                width: 50%;
                height: 100%;
                transition: all 1s;
                z-index: -1;
                background-color: #fff;
                border-radius: 1.25vw;
                position: absolute;
                left: 0;
                right: 100%;
            }

            .active-bg {
                transform: translateX(-100%);
                left: 100%;
                right: 0;
            }
            .active {
                color: rgb(226, 217, 202);
            }
        }
    }
    #signin {
        width: 100%;
        height: 20vw;
        display: flex;
        flex-direction: column;
        background: url("../../assets/img/lognin.png") no-repeat bottom right;
        background-size: 20%;
        background-color: #fff;
        border-radius: 1.875vw;
        padding-top: 2.5vw;
        form {
            height: 8vw;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            label {
                width: 100%;
                color: rgb(226, 217, 202);
                font-size: 1.1458vw;
                padding-left: 1.875vw;
                input {
                    width: 60%;
                    padding-left: 1.25vw;
                    font-size: 0.9375vw;
                }
            }
        }

        .release {
            display: flex;
            padding-left: 6.6667vw;
            margin-bottom: 1.875vw;
            input {
                width: 30%;
                margin-right: 1.25vw;
                padding-left: 1.25vw;
            }
            canvas {
                // width: 4.1667vw;
                // height: 3.125vw;
                margin-right: 0.625vw;
                background-color: rgb(226, 217, 202);
            }
            .txt {
                display: flex;
                color: rgb(226, 217, 202);
                cursor: pointer;
                p {
                    line-height: 3.125vw;
                }
                span {
                    display: flex;
                    align-items: center;
                    font-size: 0.625vw;
                }
            }
        }
        .pass {
            padding-left: 2.5vw;
            display: flex;
            align-items: center;
            cursor: pointer;
            input[type="checkbox"] {
                width: 0.8433vw;
                height: 0.8533vw;
                border: 0.0521vw solid rgb(226, 217, 202);
                position: relative;
                cursor: pointer;
            }
            input[type="checkbox"]:checked::before {
                content: "\2714";
                background-color: #fff;
                position: absolute;
                top: -0.03vw;
                left: -0.03vw;
                border: 0.0521vw solid rgb(226, 217, 202);
                width: 0.8333vw;
                height: 0.8333vw;
                color: rgb(226, 217, 202);
                font-size: 0.625vw;
                line-height: 0.8333vw;
                text-align: center;
                border-radius: 0.1563vw;
            }
            span {
                font-size: 0.625vw;
                color: rgb(226, 217, 202);
            }
        }
        button {
            width: 20%;
            border: none;
            color: #fff;
            font-family: PageFont;
            border-radius: 0.625vw;
            background-color: rgb(226, 217, 202);
            margin: auto;
            cursor: pointer;
            padding: 0.625vw 0;
        }
    }
    #register {
        width: 100%;
        height: 26vw;
        display: flex;
        flex-direction: column;
        background: url("../../assets/img/loginup.png") no-repeat bottom left;
        background-size: 50%;
        background-color: #fff;
        border-radius: 1.875vw;
        padding-top: 2.5vw;
        form {
            height: 18vw;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .code {
                width: 100%;
                display: flex;
                label {
                    width: 65%;
                }
                span {
                    width: 35%;
                    font-size: 12px;
                    color: rgb(226, 217, 202);
                    cursor: pointer;
                }
            }
            .code-box {
                width: 100%;
                display: flex;
                justify-content: space-evenly;
                input {
                    height: 1.875vw;
                    border: 1px solid rgb(226, 217, 202);
                    border-radius: 0.625vw;
                    text-align: center;
                    font-size: 0.9375vw;
                }
            }
            label {
                width: 100%;
                color: rgb(226, 217, 202);
                font-size: 1.1458vw;
                padding-left: 1.875vw;
                input {
                    width: 70%;
                    padding-left: 1.25vw;
                    font-size: 0.9375vw;
                }
                .put-w {
                    width: 60%;
                }
            }
        }
        button {
            width: 20%;
            border: none;
            color: #fff;
            font-family: PageFont;
            border-radius: 0.625vw;
            background-color: rgb(226, 217, 202);
            margin: auto;
            cursor: pointer;
            padding: 0.625vw 0;
        }
    }
}
</style>