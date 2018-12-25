import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {element} from './element'
import {solve} from './solve';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {

  private m : number;
  private n : number;
  public grid: element[][];

  constructor() {
    this.m  = 10;
    this.n = 10;
    this.initGrid();
   }

  initGrid(){
    this.grid = new Array();
    for(let ms = 0; ms<this.m;ms++){
      console.log(ms);
      this.grid[ms] = (new Array());
      for(let ns = 0; ns< this.n;ns++){
        this.grid[ms][ns] = new element(ms,ns);
      }
    }
    console.log("created grid");
    console.log(this.grid);
  }

  setBlackBox(x : number, y : number){
    let axis : number = this.m/2;
    let symX : number = ((axis - x)*2)-1+x;
    let symY : number = ((axis - y)*2)-1+y;
    this.grid[x][y].setBlacknd(true);

    console.log({axis,symX, symY});
    this.grid[(symX)][(symY)].setBlacknd(true);
    
    ChangeDetectorRef.markforCheck();
    ChangeDetectorRef.detectChanges() 

  }

  solve(){
    let ctrl = new solve(this.grid);
   
  }

  ngOnInit() {

  }

}
