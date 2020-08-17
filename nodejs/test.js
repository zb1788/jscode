
let arr = [1,2,3,4,5,6]
for(let i=0,len=arr.length;i<len;i++){
    console.log(arr[i])
}

arr.forEach((item,index)=>(index>=3||2>1)&&console.log(item,index))