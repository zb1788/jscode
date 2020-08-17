<template>
    <ul v-show="isShow">
        <li style="float: left;font-size:20px;"  @click="chose(item)" v-for="(item,index) in EmojiList" :key="index">{{item}}</li>
    </ul>
</template>

<script>
export default {
    props: ["isShow"],
    data(){
        return {
            Elist:['U+1f600','U+1f601','U+1f602','U+1f603','U+1f604','U+1f605','U+1f606','U+1f609','U+1f60a','U+1f60b','U+1f60e','U+1f60d','U+1f618','U+1f619','U+1f642','U+1f917','U+1f914','U+1f610','U+1f611','U+1f636','U+1f644','U+1f60f','U+1f623','U+1f625','U+1f910','U+1f62a','U+1f62b','U+1f634','U+1f61b','U+1f61c','U+1f61d','U+1f613','U+1f614','U+1f911','U+1f632','U+1f616','U+1f624','U+1f622','U+1f62d','U+1f628','U+1f629','U+1f62c','U+1f630','U+1f631','U+1f633','U+1f635','U+1f621','U+1f620','U+1f637','U+1f912','U+1f915','U+1f913'],
        }
    },
    computed:{
        EmojiList(){
            let Earr = []
            for(let item of this.Elist){
                let a = item.replace('U+','0x')
                let arr = this.findSurrogatePair(a)
                let bq = String.fromCharCode('0x'+arr[0],'0x'+arr[1])
                Earr.push(bq)
            }
            return Earr
        }
    },    
    methods:{
        chose(item){
            this.$emit('choseEmoji',item)
        },
        findSurrogatePair(point) {
            var offset = point - 0x10000,
            lead = 0xd800 + (offset >> 10),
            trail = 0xdc00 + (offset & 0x3ff);
            return [lead.toString(16), trail.toString(16)];
        }
    }
}
</script>

<style>

</style>
