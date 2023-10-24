import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { ToolbarNotificationsModule } from './toolbar-notifications/toolbar-notifications.module';
import { ToolbarUserModule } from './toolbar-user/toolbar-user.module';
import { ToolbarSearchModule } from './toolbar-search/toolbar-search.module';
import { IconModule } from '@visurel/iconify-angular';
import { NavigationModule } from '../navigation/navigation.module';
import { RouterModule } from '@angular/router';
import { NavigationItemModule } from '../../components/navigation-item/navigation-item.module';
import { MegaMenuModule } from '../../components/mega-menu/mega-menu.module';
import { ContainerModule } from '../../directives/container/container.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToolbarCrearTicketComponent } from '../toolbar/toolbar-crear-ticket/toolbar-crear-ticket.component';
import { AngularMaterialModule } from '../../../app/pages/angular-material.module';
import { ToolbarInfoTicketComponent } from './toolbar-info-ticket/toolbar-info-ticket.component';
import { QuickpanelModule } from '../quickpanel/quickpanel.module';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    ToolbarComponent,
    ToolbarCrearTicketComponent,
    ToolbarInfoTicketComponent
  ],
  imports: [
    QuickpanelModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    ToolbarNotificationsModule,
    ToolbarUserModule,
    ToolbarSearchModule,
    IconModule,
    NavigationModule,
    RouterModule,
    NavigationItemModule,
    MegaMenuModule,
    ContainerModule,
    MatTooltipModule,
    AngularMaterialModule,
    CardModule,
    MatCardModule,
  ],
  exports: [
    ToolbarComponent,
    ToolbarCrearTicketComponent,
    ToolbarInfoTicketComponent
  ],
  providers: [
    QuickpanelModule
  ],
  entryComponents: [ToolbarCrearTicketComponent, ToolbarInfoTicketComponent]
})
export class ToolbarModule {
}
