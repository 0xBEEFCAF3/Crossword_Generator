import {element} from './element';
import {cherrio} from 'cheerio';
import $ from "jquery";

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


export class solve{

    private grid : element[][];
    private mode : boolean; //true for solving horizontally, false for solving vertically

    constructor(grid){
        this.grid = grid;
        this.mode = true;//initially solve horizontally
        //this.generateWord("ne?p");
        this.solve();
    }

    public peepGrid(){
        return this.grid;
    }

    private isValidWord(str:string) : boolean{
        return !/[~.'`!#$%\^&*+=\-\[\]\\;,/{}|\\":<>\?]/g.test(str);
       }

    public checkEmptyWord(word : string) : boolean{
        for (const c of word) {
            if(c != "?"){
                return false;
            }
        }
        return true;
    }

    private getRandomChar() :string {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";
        return possible.charAt(Math.floor(Math.random() * possible.length));
      }

    public generateWord(word :string) {
        console.log("generating");
        const wordSize = word.length;
        //https://onelook.com/?w=ne*p&ls=a
        let promise = new Promise((resolve, reject) =>{
            let _this = this;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://onelook.com/?w="+ word+"&ssbp=1&ls=a",
                "method": "GET",
                "headers": {
                "cache-control": "no-cache",
                }
            }
            
          $.ajax(settings).done(function (response) {
            resolve(_this.getTopWord(response, wordSize));
          });
        })
        return promise;
    }

    private getTopWord(htmlDoc : string, wordSize : number, recursiveIdx = 1) : string{
        if(recursiveIdx > 100){
            alert("Please add more black squares to complete this puzzle!");
            throw "Overflow scraping";
        }
        let searchIdx : number = recursiveIdx;
        
        let query = String(searchIdx) + ". <a href";
        let querySize = query.length;
        let idx = htmlDoc.search(query);

        let nextSearchIdx = searchIdx+1;
        let nextQuery = String(nextSearchIdx) + ". <a href";
        let nextIdx = htmlDoc.search(nextQuery);

        let queryStringResult : string = htmlDoc.slice(idx, nextIdx).split("</a>")[0].split(">")[1];
        if(queryStringResult == undefined || this.isValidWord(queryStringResult) == false){
            return this.getTopWord(htmlDoc, wordSize, recursiveIdx + 1)
        }
        return queryStringResult;
    }

    private fillGridHor(row : number, col : number, word : string) : void{
        const wordSize : number = word.length;
        //console.error(col, wordSize);

        let initCol : number  = col - wordSize;
        let wordIdx : number = 0;
        for(let i = initCol;i<col;i++,wordIdx++){
            this.grid[row][i].setVal(word[wordIdx])
        }
    }

    public async solve()  {
        const m = this.grid.length;
        const n = this.grid[0].length;
        
        let currentWordSize : number;
        let currentWord : string;
        if(this.mode == true){
            //SOLVING HORIZONTALLY
            currentWordSize = 0;
            currentWord = "";
            for(let i=0;i<m;i++){
                for(let j=0;j<=n;j++){
                    console.log({i,j,currentWord,n,m})
                    if (j == n || this.grid[i][j].getBlacknd() == true ){ //if last iteration of row or black square
                        //check for empty string conditions
                        if(currentWord.length == 0) continue;
                        else if(this.checkEmptyWord(currentWord) == true){
                            currentWord = currentWord.replaceAt(0,this.getRandomChar());
                        }
                        console.warn("CURRENT WORD::: ", currentWord);
                        //get the word from the size
                        let generatedWord = await this.generateWord(currentWord);
                        console.warn("THE WORD WE GOT:::: ", generatedWord);
                        //fill in the grid
                        this.fillGridHor(i,j,generatedWord);
                        //reset word and word size keep going
                        currentWord = "";
                    }else{
                        //if not a empty space add to word, else add '?'
                        if(this.grid[i][j].getVal() != ""){
                            currentWord += this.grid[i][j].getVal();
                        }else{
                            currentWord += "?";
                        }
                    }

                }
            }
        }else{

        }
    }

}