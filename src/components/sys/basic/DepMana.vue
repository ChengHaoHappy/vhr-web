<template>
    <div style="width: 500px">
        <el-input
                placeholder="请输入部门名称进行搜索..."
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>

        <el-tree
                style="margin-top: 10px"
                :expand-on-click-node="false"
                :data="deps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree">

         <span style="display: flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }">
             <span>{{ node.label }}</span>
             <span>
               <el-button
                       class="depBtu"
                       type="primary"
                       size="mini"
                       @click="showAddView(data)">
                添加部门
               </el-button>
              <el-button
                      class="depBtu"
                      type="danger"
                      size="mini"
                      @click="delDep(data)">
                删除部门
              </el-button>
             </span>
         </span>
        </el-tree>

        <el-dialog
                title="添加部门"
                width="40%"
                :visible.sync="dialogFormVisible">
            <table>
                <tr>
                    <td>
                        <el-tag>上级部门</el-tag>
                    </td>
                    <td>{{pname}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tag>部门名称</el-tag>
                    </td>
                    <td>
                        <el-input placeholder="请输入部门名称..." v-model="dep.name"></el-input>
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDep()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                filterText: '',
                deps: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogFormVisible: false,
                dep: {
                    name: '',
                    parentId: -1
                },
                pname: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            delDep(data) {
                if (data.parent) {
                    this.$message.error("父部门删除失败");
                } else {
                    this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
                            if (resp) {
                                this.removeDepFromDeps(this.deps, data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            removeDepFromDeps(deps, id) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id == id) {
                        deps.splice(i, 1);
                        return;
                    } else {
                        this.removeDepFromDeps(d.children, id);
                    }
                }
            },
            //递归添加
            addDepToDeps(deps, dep) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id == dep.parentId) {
                        d.children = d.children.concat(dep);
                        return;
                    } else {
                        this.addDepToDeps(d.children, dep);
                    }
                }
            },
            addDep() {
                this.postRequest("/system/basic/department/", this.dep).then(resp => {
                    if (resp) {
                        this.initDep();
                        this.addDepToDeps(this.deps, resp.obj);
                        this.dialogFormVisible = false;
                    }
                })
            },
            showAddView(data) {
                this.dep.parentId = data.id;
                this.pname = data.name;
                this.dialogFormVisible = true;
            },
            initDep() {
                this.dep = {
                    name: '',
                    parentId: -1
                };
                this.pname = '';
            },
            initDeps() {
                this.getRequest("/system/basic/department/").then(resp => {
                    if (resp) {
                        this.deps = resp;
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
        ,
    }
</script>

<style>
    .depBtu {
        padding: 2px;
    }
</style>