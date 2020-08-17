<template>
    <div class="address"><H3 class="jieduan">{{ curModule }} &gt; {{ ksName }}<font v-if="curModule == '课堂教学'"> &gt; {{ classHourName }}</font></H3></div>    
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'curModule',
            'ksName',
            'classHourName',
            'isShowClassHour'
        ])
    },
}
</script>

<style>
</style>
