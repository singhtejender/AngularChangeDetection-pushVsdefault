import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DummyService } from 'src/app/services/dummy.service';


@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit {
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
