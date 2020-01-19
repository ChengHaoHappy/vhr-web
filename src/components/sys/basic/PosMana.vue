<template>
    <div>
        <div>
            <el-input
                    size="small"
                    style="width: 300px"
                    placeholder="添加职位..."
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
            </el-input>
            <el-button icon="el-icon-plus" size="small" style="margin-left: 10px;background-color: #8eebff"
                       type="primary"
                       @click="addPosition">
                添加
            </el-button>
        </div>
        <div class="posTable">
            <el-table
                    size="small"
                    :data="positions"
                    stripe
                    border
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位职称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="editPosition(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDeletePosition(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 10px"
                       :disabled="multipleSelection.length==0">批量删除
            </el-button>
        </div>
        <!-- 对话框 -->
        <el-dialog
                title="修改职位职称"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <div>
                <div>
                    <span style="color: #25aeff">职位职称</span>
                    <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
                </div>
                <div>
                    <span style="color: #25aeff; margin-right: 20px">是否禁用</span>
                    <el-switch
                            size="small"
                            v-model="updatePos.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </div>

            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="doUpdatePosition">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                pos: {
                    name: ''
                },
                dialogVisible: false,
                positions: [],
                updatePos: {
                    name: '',
                    enabled: false
                },
                multipleSelection: []
            }
        },
        mounted() {  //组件初始化时，调用mounted方法
            this.initPositions();
        },
        methods: {
            deleteMany() {
                this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    })
                    this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            this.initPositions();//刷新表格
                            this.pos.name = '';
                        }
                    })
                } else {
                    this.$message.error('职位名称不能为空！');
                }
            },
            editPosition(index, row) {
                // this.updatePos = row;
                Object.assign(this.updatePos, row);  //把行数据拷贝到updatePos
                this.dialogVisible = true;
            },
            doUpdatePosition() {
                this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                    if (resp) {
                        this.initPositions();//刷新表格
                        // this.updatePos = '';
                        this.dialogVisible = false;
                    }
                })
            },
            handleDeletePosition(index, row) {
                this.$confirm('此操作将永久删除[' + row.name + ']职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + row.id).then(resp => {
                        if (resp) {
                            this.initPositions();//刷新表格
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            initPositions() {
                this.getRequest("/system/basic/pos/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .posTable {
        margin-top: 10px;
    }

    .updatePosInput {
        width: 200px;
        margin-left: 20px;
    }
</style>