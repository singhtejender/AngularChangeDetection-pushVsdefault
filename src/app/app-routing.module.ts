import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "default"
  },
  {
    path: "default",
    loadChildren: () => import("./change-detection-sample/change-detection-sample.module")
      .then(m => m.ChangeDetectionSampleModule)
  },
  {
    path: "onpush",
    loadChildren: () => import("./change-detection-onpush/change-detection-onpush.module")
      .then(m => m.ChangeDetectionOnpushModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
