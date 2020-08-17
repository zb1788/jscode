<template>
    <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6"><modulesbar/></el-col>
        <el-col :span="6"><chapter/></el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import commonUtils from '@/utils/common'
import modulesbar from './modulesbar'
import chapter from './chapter'
export default {
    name: 'foot',
    components: {
        modulesbar,
        chapter
    },
    computed: {
        ...mapGetters([
            'teacherNumber',
            'trueTeacherName'
        ])
    },
    mounted(){

    }
}
</script>

<style>

</style>
