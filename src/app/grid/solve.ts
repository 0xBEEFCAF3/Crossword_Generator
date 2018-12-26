import {element} from './element';
import {cherrio} from 'cheerio';
import $ from "jquery";


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

    private isGridFilled() : boolean{
        const m :number = this.grid.length;
        const n :number = this.grid[0].length;
        for(let i=0;i<m;i++){
            for(let j=0;j<n;j++){
                if(this.grid[i][j].getBlacknd() == true)continue;
                if(this.grid[i][j].getVal() == "") return false;
            }
        }
        return true;
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
        var possible = "abcdefghijklmnoprst";
        return possible.charAt(Math.floor(Math.random() * possible.length));
      }

    public generateWord(word :string) {
        console.warn(word);
        const wordSize = word.length;
        let promise = new Promise((resolve, reject) =>{
            if(word.includes("?")==false) resolve(word);
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
        let initCol : number  = col - wordSize;
        let wordIdx : number = 0;
        for(let i = initCol;i<col;i++,wordIdx++){
            this.grid[row][i].setVal(word[wordIdx])
        }
    }

    private fillGridVert(row : number, col : number, word : string) : void{
        const wordSize : number = word.length;
        let initRow : number  = row - wordSize;
        let wordIdx : number = 0;
        console.log({row, col, word});
        for(let i = initRow;i<row;i++,wordIdx++){
            this.grid[i][col].setVal(word[wordIdx])
        }
    }

    public async solve()  {
        const m = this.grid.length;
        const n = this.grid[0].length;
        
        let currentWordSize : number;
        let currentWord : string;
        let top = 0, bottom = m-1, left = 0, right = m-1;
        
        while(this.isGridFilled() == false){
            //SOLVING HORIZONTALLY
            currentWord = "";
            if( top <= Math.floor(m/2)-1 && bottom >= Math.floor(m/2) ){
                console.log({top,bottom}, Math.floor(m/2) , Math.floor(m/2)+1 )
                 /************  TOP ***********/
                for(let j=0;j<=n;j++){
                    if (j == n || this.grid[top][j].getBlacknd() == true ){ //if last iteration of row or black square then we need to fill in some tiles
                        //check for empty string conditions
                        if(currentWord.length == 0) continue;
                        else if(this.checkEmptyWord(currentWord) == true) currentWord =  currentWord.substr(0, 0) + this.getRandomChar()+ currentWord.substr(0 + this.getRandomChar().length);
                        //get the word from the size
                        let generatedWord = await this.generateWord(currentWord);
                        //fill in the grid
                        this.fillGridHor(top,j,generatedWord);
                        //reset word and word size keep going
                        currentWord = "";
                    }else{
                        //if not a empty space add to word, else add '?'
                        if(this.grid[top][j].getVal() != ""){
                            currentWord += this.grid[top][j].getVal();
                        }else{
                            currentWord += "?";
                        }
                    }
                }
                 /********* BOTTOM **********/
                 for(let j=0;j<=n;j++){
                    if (j == n || this.grid[bottom][j].getBlacknd() == true ){ //if last iteration of row or black square then we need to fill in some tiles
                        //check for empty string conditions
                        if(currentWord.length == 0) continue;
                        else if(this.checkEmptyWord(currentWord) == true) currentWord =  currentWord.substr(0, 0) + this.getRandomChar()+ currentWord.substr(0 + this.getRandomChar().length);
                        //get the word from the size
                        let generatedWord = await this.generateWord(currentWord);
                        //fill in the grid
                        this.fillGridHor(bottom,j,generatedWord);
                        //reset word and word size keep going
                        currentWord = "";
                    }else{
                        //if not a empty space add to word, else add '?'
                        if(this.grid[bottom][j].getVal() != ""){
                            currentWord += this.grid[bottom][j].getVal();
                        }else{
                            currentWord += "?";
                        }
                    }
                }
                //Increment loops 
                top++;
                bottom--;
            }//end of horizontal
            console.warn("doing verticals");
            //SOLVING VERTICALLY
            currentWord = "";
            if( left <= Math.floor(m/2)-1 && right >= Math.floor(m/2) ){
                 /************  left ***********/
                for(let j=0;j<=n;j++){
                    if (j == n || this.grid[j][left].getBlacknd() == true ){ //if last iteration of row or black square then we need to fill in some tiles
                        //check for empty string conditions
                        if(currentWord.length == 0) continue;
                        else if(this.checkEmptyWord(currentWord) == true) currentWord =  currentWord.substr(0, 0) + this.getRandomChar()+ currentWord.substr(0 + this.getRandomChar().length);
                        //get the word from the size
                        let generatedWord = await this.generateWord(currentWord);
                        //fill in the grid
                        this.fillGridVert(j,left,generatedWord);
                        //reset word and word size keep going
                        currentWord = "";
                    }else{
                        //if not a empty space add to word, else add '?'
                        if(this.grid[j][left].getVal() != ""){
                            currentWord += this.grid[j][left].getVal();
                        }else{
                            currentWord += "?";
                        }
                    }
                }
                 /********* right **********/
                 for(let j=0;j<=n;j++){
                    if (j == n || this.grid[j][right].getBlacknd() == true ){ //if last iteration of row or black square then we need to fill in some tiles
                        //check for empty string conditions
                        if(currentWord.length == 0) continue;
                        else if(this.checkEmptyWord(currentWord) == true) currentWord =  currentWord.substr(0, 0) + this.getRandomChar()+ currentWord.substr(0 + this.getRandomChar().length);
                        //get the word from the size
                        let generatedWord = await this.generateWord(currentWord);
                        console.log("generated word VERT ::;" , generatedWord);
                        //fill in the grid
                        this.fillGridVert(j,right,generatedWord);
                        //reset word and word size keep going
                        currentWord = "";
                    }else{
                        //if not a empty space add to word, else add '?'
                        if(this.grid[j][right].getVal() != ""){
                            currentWord += this.grid[j][right].getVal();
                        }else{
                            currentWord += "?";
                        }
                    }
                }
                //Increment loops 
                left++;
                right--;
            }//end of vertical
        }
    }

}