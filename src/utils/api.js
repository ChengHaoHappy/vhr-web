import axios from 'axios'
import {Message} from 'element-ui';  //组件
import router from "../router";


//拦截配置：先对服务器响应信息进行拦截处理
axios.interceptors.response.use(success => {
        if (success.status && success.status == 200 && success.data.status == 500) {  //服务器响应信息为自定义错误
            Message.error({message: success.data.msg})  //弹出自定义错误提示信息
            return;                                     //啥都不返回
        }
        if (success.data.msg) {  //服务器响应的为成功信息，则弹出成功信息
            Message.success({message: success.data.msg})
        }
        return success.data; //服务器响应的为成功信息，则返回该数据
    }, error => {
        if (error.response.status == 504 || error.status == 400) {
            Message.error({message: '服务器被吃了'})
        } else if (error.response.status == 403) {
            Message.error({message: '权限不足，请联系管理员'})
        } else if (error.response.status == 401) {
            Message.error({message: '尚未登录，请登录'})
            router.replace("/");
        } else {
            if (error.response.data.msg) {
                Message.error({message: error.response.data.msg})
            } else {
                Message.error({message: '未知错误'})
            }
        }

    }
)

let base = ''; //预留请求地址前缀

//模块是独立的文件，该文件内部的所有的变量外部都无法获取。如果希望获取某个变量，必须通过export输出
//向服务器发送请求
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,  //直接这样写是以json格式直接传送到服务端，spring security 不支持
        transformRequest: [function (data) {  //对请求数据进行处理
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            // console.log(ret);
            return ret;
        }],
        headers: {
            'Content_Type': 'application/x-www-form-urlencoded'  //设置请求为表单提交
        }
    });
}

export const postRequest = (url, params) => {  //post请求
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
}

export const putRequest = (url, params) => {  //put请求
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
}

export const deleteRequest = (url) => { //delete请求
    return axios({
        method: 'delete',
        url: `${base}${url}`,
    });
}

export const getRequest = (url) => {
    return axios({
        method: 'get',
        url: `${base}${url}`
    });
}


















