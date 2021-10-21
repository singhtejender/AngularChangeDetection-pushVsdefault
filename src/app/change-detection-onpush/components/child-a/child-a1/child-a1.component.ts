import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-child-a1',
  templateUrl: './child-a1.component.html',
  styleUrls: ['./child-a1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildA1Component implements OnInit {
  counter = -1;
  get times() {
    this.counter++;
    return this.counter;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
