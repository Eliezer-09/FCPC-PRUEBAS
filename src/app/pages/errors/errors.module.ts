import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './error404/error404.component';
import { BrowserModule } from '@angular/platform-browser';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    IconModule,
  ]
})
export class ErrorsModule { }
