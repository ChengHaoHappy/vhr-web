<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="部门管理" name="first"><DepMana></DepMana></el-tab-pane>
        <el-tab-pane label="职位管理" name="second"><PosMana></PosMana></el-tab-pane>
        <el-tab-pane label="职称管理" name="third"><JobLevelMana></JobLevelMana></el-tab-pane>
        <el-tab-pane label="奖惩规则" name="fourth"><EcMana></EcMana></el-tab-pane>
        <el-tab-pane label="权限组" name="fourth2"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
</template>

<script>
    import DepMana from "../../components/sys/basic/DepMana";
    import PosMana from "../../components/sys/basic/PosMana";
    import JobLevelMana from "../../components/sys/basic/JobLevelMana";
    import EcMana from "../../components/sys/basic/EcMana";
    import PermissMana from "../../components/sys/basic/PermissMana";

    export default {
        name: "SysBasic",
        components: {DepMana, PermissMana, EcMana, PosMana, JobLevelMana},
        data() {
            return {
                activeName: 'first'
            };
        },
        comments:{
            'DemMana':DepMana,
            PosMana,
            JobLevelMana,
            EcMana,
            PermissMana,
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>