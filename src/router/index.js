import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/store'
// import { Message } from 'element-plus'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: () => import('@/pages/home/MyHome.vue'),
            meta: {
                title: '主页'
            }
        },
        {
            path: '/login',
            component: () => import('@/pages/login/MyLogin.vue'),
            meta: {
                title: '登录/注册'
            }
        }, {
            path: '/info',
            component: () => import('@/pages/info/MyUserInfo.vue'),
            meta: {
                title: '个人'
            },
        }
    ]
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
    let user = userStore();
    if (to.path == '/home' || to.path == '/login') return next();
    console.log(user.userInfo.id);
    if (user.userInfo.id) return next();
    next('/login')
})

// 全局后置路由守卫
router.afterEach((to) => {
    document.title = to.meta.title || 'dome'
})

export default router