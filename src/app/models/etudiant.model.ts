export class Etudiant {

    private id: number;
    private name: string;
    private email: string;
    private age: number;

    constructor(id:number ,name:string,email:string,age:number) {
        this.id=id
        this.name=name
        this.email=email
        this.age=age
    }

    //getters and setters 

    public getId(){
        return this.id
    }
    public getName(){
        return this.name
    }
    public getEmail(){
        return this.email
    }
    public getAge(){
        return this.age
    }

    public setId(id:number){
        this.id=id
    }
    public setName(name:string){
        this.name=name
    }
    public setEmail(email:string){
        this.email=email
    }
    public setAge(age:number){
        this.age=age
    }


}