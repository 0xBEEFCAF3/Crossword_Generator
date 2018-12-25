

export class element{

    public x : number;
    public y : number;
    private val : string;
    private isBlacknd : boolean;

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.val = "";
        this.isBlacknd = false;

    }

    setVal(val: string){
        this.val = val;
    }

    getVal(){
        return this.val;
    }

    setBlacknd(val : boolean){
        this.isBlacknd = true;
    }

    getBlacknd():boolean {
        return this.isBlacknd;
     }

    toString() : string{
        return this.val;
    }

}