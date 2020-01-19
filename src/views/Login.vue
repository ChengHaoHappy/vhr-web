<template>
    <div>
        <el-form :rules="rules" :model="loginForm" ref="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off"
                          aria-placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" auto-complete="off" aria-placeholder="请输入密码"
                    @keydown.enter.native="submitLogin"></el-input>  <!-- @keydown.enter.native 回车登录-->
            </el-form-item>
            <el-checkbox class="loginRemember" v-model="checked"></el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin()">登录</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123'
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                }
            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        // alert('submit!');
                        this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => { //服务端返回的参数，respBean的json字符串
                            if (resp) {  //登录成功
                                // alert(JSON.stringify(resp));
                                window.sessionStorage.setItem("user",JSON.stringify(resp.obj)); //把用户数据存储到session
                                let path = this.$route.query.redirect;
                                this.$router.replace((path =='/' || path == undefined)?'/home':path);
                            }
                        })
                    } else { //登录失败
                        this.$message.error('请输入所有字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #edc6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>