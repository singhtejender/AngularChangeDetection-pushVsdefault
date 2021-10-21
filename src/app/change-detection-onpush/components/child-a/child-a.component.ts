import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DummyService } from 'src/app/services/dummy.service';

@Component({
  selector: 'app-child-a',
  templateUrl: './child-a.component.html',
  styleUrls: ['./child-a.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildAComponent implements OnInit {
  counter = -1;
  get times() {
    this.counter++;
    return this.counter;
  }
  constructor(private dummyService: DummyService) { }

  ngOnInit(): void {
  }


  doAction() {
    console.log("nothing");
  }

  makeRequest() {
    this.dummyService.makeRequest();
  }
}
