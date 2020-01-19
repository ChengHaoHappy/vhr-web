import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
import {postKeyValueRequest, postRequest, putRequest, deleteRequest, getRequest} from "./utils/api";
import {initMenu} from "./utils/menus";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;   //之后可以直接通过this.postKeyValueRequest 调用
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.config.productionTip = false

Vue.use(ElementUI);

//导航守卫===>全局前置守卫,类似于拦截器
router.beforeEach((to, from, next) => {
    if (to.path == '/') { //去登陆页面 next(): 进行管道中的下一个钩子
        next();
    } else { //其他页面，去初始化
        if(window.sessionStorage.getItem("user")){ //登录了
            initMenu(router,store);
            next();
        }else {  //没登陆，去登陆页面。如果再导航栏输入目的地址，登陆后直接重定向到该目地址
           next('/?redirect='+to.path) ;
        }

    }
})

new Vue({
    router,
    store,
    render: h => h(App)   // App组件
}).$mount('#app')  //挂在到 id=app 的标签上
