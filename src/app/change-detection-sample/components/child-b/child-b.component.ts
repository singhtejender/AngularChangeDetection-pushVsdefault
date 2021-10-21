import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-child-b',
  templateUrl: './child-b.component.html',
  styleUrls: ['./child-b.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChildBComponent implements OnInit {
  counter = -1;
  get times() {
    this.counter++;
    return this.counter;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
