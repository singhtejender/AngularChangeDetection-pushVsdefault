import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildAComponent } from './components/child-a/child-a.component';
import { ChildBComponent } from './components/child-b/child-b.component';
import { ChildA1Component } from './components/child-a/child-a1/child-a1.component';
import { ChildA2Component } from './components/child-a/child-a2/child-a2.component';
import { RootComponent } from './components/root.component';
import { ChangeDetectionSampleRoutingModule } from './change-detection-sample-routing.module';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ChildAComponent,
    ChildBComponent,
    ChildA1Component,
    ChildA2Component,
    RootComponent],
  imports: [
    CommonModule,
    ChangeDetectionSampleRoutingModule,
    HttpClientModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule
  ]
})
export class ChangeDetectionSampleModule { }
