class Persion{
    constructor(name,age){
        this.name = name;
        this.age = age;
    }

    say(){
        console.log(`${this.name} say:my age ${this.age}`);
    }
}


new Persion('kobe',32).say();


const Per = {
    name:'',
    age:0,
    say(){
        console.log(`${this.name} say:my age ${this.age}`);
    }
}

Per.name = 'kobe';
Per.age = 32;
Per.say();