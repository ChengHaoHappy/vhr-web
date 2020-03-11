<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事</div>
                <div>
                    <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000;" size="normal" @click="goChat"></el-button>
                    <el-dropdown class="userInfo" @command="commandHandler">  <!-- Dropdown 下拉菜单  -->
                        <span class="el-dropdown-link">
                     {{user.name}}
                        <i><img v-if="user.userface!=''" :src="user.userface"
                                style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
                        <i class="el-icon-arrow-down el-icon--right"></i>  <!-- 用户头像 -->
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </el-header>
            <el-container>
                <el-aside width="200px">            <!-- NavMenu 导航栏菜单 -->
                    <el-menu @select="menuClick" unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i style="color: aqua;margin-right: 5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="(child,indexj) in item.children" :index="child.path" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path=='/home'">
                        <div class="homeWelcome">
                            欢迎来到微人事！
                        </div>
                    </el-breadcrumb>
                    <router-view class="homeView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user")), //取出用户信息
            }
        },
        computed:{
            routes(){
                return this.$store.state.routes;
            }
        },
        methods: {
            goChat() {
                this.$router.push("/chat");
            },
            menuClick(index) {
                console.log(index);     // <el-menu-item/> 的index 属性
                this.$router.push(index);    //跳转到index所值组件
            },
            commandHandler(cmd) {    //点击下拉菜单的回调方法
                if(cmd=='logout'){
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {  //MessageBox 弹框
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/logout");  //注销请求
                        window.sessionStorage.removeItem("user");  //
                        this.$store.commit('initRoutes',[]);  //初始化菜单
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
        }
    }
</script>

<style>
    .homeView{
        margin-top: 10px;
    }
    .homeWelcome{
        font-family: 华文行楷;
        font-size: 50px;
        text-align: center;
        margin-top: 100px;
        color: #8eebff;
    }
    .homeHeader {
        background-color: #8eebff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

</style>