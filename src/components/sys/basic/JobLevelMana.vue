<template>
    <div>
        <div>
            <el-input
                    size="small"
                    style="width:250px; margin-right: 10px"
                    placeholder="添加职称"
                    prefix-icon="el-icon-plus"
                    v-model="job.name">
            </el-input>
            <el-select size="small" v-model="job.titleLevel" placeholder="职称等级">
                <el-option
                        v-for="item in titleLevel"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" size="small" style="margin-left: 10px;background-color: #8eebff"
                       type="primary"
                       @click="addJob">
                添加
            </el-button>
        </div>
        <div class="jobTable">
            <el-table
                    :data="jobLevel"
                    stripe
                    border
                    size="small"
                    style="width: 80%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称等级"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="150">
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
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteJobs" type="danger"
                       size="small" style="margin-top: 10px"
                       :disabled="multipleSelection.length==0">
                批量删除
            </el-button>
        </div>
        <el-dialog title="修改职称" :visible.sync="dialogFormVisible" width="40%">
            <el-form :model="updateForm">
                <el-form-item label="职称名称" :label-width="formLabelWidth">
                    <el-input size="small" v-model="updateForm.name" style="width: 40%"></el-input>
                </el-form-item>
                <el-form-item label="职称等级" :label-width="formLabelWidth" >
                    <el-select size="small"v-model="updateForm.titleLevel" style="width: 40%">
                        <el-option
                                v-for="item in titleLevel"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth">
                    <el-switch
                            size="small"
                            v-model="updateForm.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="doUpdateJob">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data() {
            return {
                job: {
                    name: '',
                    titleLevel: ''
                },
                titleLevel: ['正高级', '副高级', '中级', '初级', '员级'],
                jobLevel: [],
                dialogFormVisible: false,
                updateForm: {
                    name: '',
                    titleLevel: '',
                    enabled:false
                },
                multipleSelection: [],
                formLabelWidth: '120px'
            }
        },
        mounted() {
            this.initLevels();
        },
        methods: {
            addJob() {
                if (this.job.name && this.job.titleLevel) {
                    this.postRequest("/system/basic/jobLevel/", this.job).then(resp => {
                        if (resp) {
                            this.initLevels();
                            this.job.name = '';
                            this.job.titleLevel = '';
                        }
                    })
                } else if (this.job.name && this.job.titleLevel == '') {
                    this.$message.error("职称等级不能为空！");
                } else {
                    this.$message.error("职称名称不能为空！");
                }
            },
            handleEdit(index, row) {
                Object.assign(this.updateForm, row);
                this.dialogFormVisible = true;
            },
            doUpdateJob() {
                this.putRequest("/system/basic/jobLevel/", this.updateForm).then(resp => {
                    if (resp) {
                        this.initLevels();
                        this.dialogFormVisible = false;
                    }
                })
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除[' + row.name + ']职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/jobLevel/" + row.id).then(resp => {
                        if (resp) {
                            this.initLevels();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteJobs(){
                this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids+="ids="+item.id+"&";
                    });
                    this.deleteRequest("/system/basic/jobLevel/" + ids).then(resp => {
                        if (resp) {
                            this.initLevels();
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
            initLevels() {
                this.getRequest("/system/basic/jobLevel/").then(resp => {
                    if (resp) {
                        this.jobLevel = resp;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .jobTable {
        margin-top: 10px;
    }
</style>