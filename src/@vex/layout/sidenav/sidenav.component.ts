import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trackByRoute } from '../../utils/track-by';
import { NavigationService } from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import { DataService } from '../../../app/services/data.service';
import { NavigationDropdown, NavigationLink } from 'src/@vex/interfaces/navigation-item.interface';
import { ComponentesService } from 'src/app/services/componentes.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

// ICONOS
import icArchive from '@iconify/icons-ic/archive';
import icCreditCard from '@iconify/icons-ic/credit-card';
import icPerson from '@iconify/icons-ic/person';
import icDashboard from '@iconify/icons-ic/dashboard';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));

  items = this.navigationService.items;
  trackByRoute = trackByRoute;
  icRadioButtonChecked = icRadioButtonChecked;
  icRadioButtonUnchecked = icRadioButtonUnchecked;
  icPerson = icPerson;

  accesos = [];
  data: any

  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private dataService: DataService,
              private dataComponent: ComponentesService) { }

  ngOnInit() {
    this.dataService.menu();  
  }

  onMouseEnter() {
    this.layoutService.collapseOpenSidenav();
  }

  onMouseLeave() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }

  isDevelopment(){ 
    return environment.serviceUrl.indexOf("/api.") < 0;
  }
}
