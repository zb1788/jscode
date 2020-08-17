<template>
        <img :src="headPhotoUrl"  :onerror="errorPhotoUrl"/>
</template>

<script>
import { getUserPhoto } from '@/api/userinfo'
import { mapGetters } from 'vuex'
export default {
    name: 'aa',
    computed: {
        ...mapGetters([
            'teacherNumber'
        ]),
        headPhotoUrl(){
            return "/node/api/user/head_photo/"+this.teacherNumber+"/100";
        }
    },
    mounted(){
        // this.getPhoto()
    },
    watch:{
        teacherNumber(newVal, oldVal){
            if(newVal != ''){
                // getUserPhoto().then((response) => {
                //     this.headPhoto = response
                // })
            }
        }
    },
    data(){
        return {
            headPhoto:'',
            errorPhotoUrl: 'this.src="' + require("@/assets/images/default1.png")+'"',
        }
    },
    methods: {
        getPhoto(){
            // getUserPhoto().then((photo) => {
            //     this.headPhoto = photo
            // })
        }
    }

}
</script>

<style>

</style>
