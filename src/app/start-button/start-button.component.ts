import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-button',
  templateUrl: './start-button.component.html',
  styleUrls: ['./start-button.component.scss']
})


export class StartButtonComponent implements OnInit {


  private m : number;
  private n : number;

  constructor() { }

  ngOnInit() {
    console.log("we started");
  }

  createPuzzle(): void{
    console.log("creating puzzle", this.m, this.n);
  }

}
