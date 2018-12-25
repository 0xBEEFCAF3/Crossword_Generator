import { Component } from '@angular/core';
import {StartButtonComponent} from './start-button/start-button.component'
import {GridComponent} from './grid/grid.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  startButton = StartButtonComponent;
  grid = new GridComponent();
}
