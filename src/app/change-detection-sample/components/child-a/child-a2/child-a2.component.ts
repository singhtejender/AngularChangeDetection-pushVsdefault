import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-child-a2',
  templateUrl: './child-a2.component.html',
  styleUrls: ['./child-a2.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChildA2Component implements OnInit {
  counter = -1;
  get times() {
    this.counter++;
    return this.counter;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
