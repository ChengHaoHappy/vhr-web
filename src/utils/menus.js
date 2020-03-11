import {getRequest} from "./api";


export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {  //如果有菜单数据,(正常跳转）
        return;
    }
    //（length==0,刷新跳转）
    console.log("length = 0");
    getRequest("/system/config/menu").then(data => {  //data 请求返回该用户角色具有的菜单
        if (data) {
            let fmtRoutes = formatRoutes(data);   //把菜单的json字符串进行格式化处理
            router.addRoutes(fmtRoutes);          //
            store.commit('initRoutes', fmtRoutes);  //store.commit 方法触发状态变更，存储菜单内组件的状态
            store.dispatch('connect');//初始化stomp
        }
    })
}

/**
 * 菜单请求工具类封装
 *格式化菜单数据
 * @param routes
 */
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,           //let path = router.path
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {  //递归格式化
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {   //导入菜单组件
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Per')) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sal')) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sta')) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }


            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}

