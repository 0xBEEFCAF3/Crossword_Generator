import {element} from './element';
import {cherrio} from 'cheerio';
import $ from "jquery";



export class solve{

    private grid : element[][];
    
    constructor(grid){
        this.grid = grid;
        this.generateWord("ne?p");
    }

    async generateWord(word :string) {
        console.log("generating");
        const wordSize = word.length;
        //https://onelook.com/?w=ne*p&ls=a
        let promise = new Promise((resolve, reject) =>{
            let _this = this;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://onelook.com/?w="+ word,
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

    private getTopWord(htmlDoc : string, wordSize : number) : string{
        let searchIdx : number = 1;
        
        let query = String(searchIdx) + ". <a href";
        let querySize = query.length;
        let idx = htmlDoc.search(query);

        let nextSearchIdx = searchIdx+1;
        let nextQuery = String(nextSearchIdx) + ". <a href";
        let nextIdx = htmlDoc.search(nextQuery);

        let queryStringResult = htmlDoc.slice(idx, nextIdx).split("</a>")[0].split(">")[1];
        console.log(wordSize,idx,queryStringResult);
        return "";
    }
}