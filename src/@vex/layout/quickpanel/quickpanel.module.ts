import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickpanelComponent } from './quickpanel.component';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { AngularMaterialModule } from 'src/app/pages/angular-material.module';


@NgModule({
  declarations: [QuickpanelComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatProgressBarModule,
    RouterModule,
    MatRippleModule,
    MatChipsModule,
    AngularMaterialModule
  ],
  exports: [QuickpanelComponent]
})
export class QuickpanelModule {
}
