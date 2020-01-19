<template>
    <div>
        <div class="permissMannTool">
            <el-input size="small" placeholder="请输入英文名称" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入中文名称" v-model="role.nameZh"
                      @keydown.native.enter="addRole"></el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加</el-button>
        </div>
        <div class="permissionManaMain">
            <el-collapse accordion @change="change" v-model="activeName">
                <el-collapse-item v-for="(r,index) in roles" :title="r.nameZh" :name="r.id" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff1013;" icon="el-icon-delete"
                                       type="text" @click="delRole(r.id,r.nameZh)"></el-button>
                        </div>
                        <div>
                            <el-tree
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="allmenus"
                                    :props="defaultProps"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>

                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>

    export default {
        name: "PermissMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allmenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus: [],
                activeName: '-1'

            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            delRole(rid, rnameZh) {
                this.$confirm('此操作将永久删除【' + rnameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permission/role/" + rid).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addRole() {
                if (this.role.name && this.role.nameZh) {
                    this.postRequest("/system/basic/permission/role/", this.role).then(resp => {
                        if (resp) {
                            this.role.nameZh = '';
                            this.role.name = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error("数据不能为空");
                }

            },
            cancelUpdate() {
                this.activeName = -1;
            },
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);
                let url = '/system/basic/permission/?rid=' + rid;
                selectedKeys.forEach(key => {
                    url += '&mids=' + key;
                })
                this.putRequest(url).then(resp => {
                    this.activeName = -1;
                })
            },
            change(rid) {
                if (rid) {
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permission/mids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                })
            },
            initAllMenus() {
                this.getRequest("/system/basic/permission/menus").then(resp => {
                    if (resp) {
                        this.allmenus = resp;
                    }
                })
            },
            initRoles() {
                this.getRequest("/system/basic/permission/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .permissMannTool .el-input {
        width: 300px;
        margin-right: 6px;
    }

    .permissionManaMain {
        margin-top: 10px;
        width: 800px;
    }
</style>