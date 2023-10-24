import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { isThisSecond } from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { AppComponent } from 'src/app/app.component';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],
})
export class DashboardComponent implements OnInit {
  dashboardUrl: SafeUrl;
  url = "https://app.powerbi.com/view?r=eyJrIjoiNTJiMzUwYzYtMzMxMy00MTRmLTlkNTQtZGZiNjgwYmUxMGNkIiwidCI6ImQzODY2NzQzLTk2NmQtNGM1MS1hZWNkLWFjOTFkODZlZGY2NiJ9";
  dataDashboard: any[] = [];
  icMoreHoriz = icMoreHoriz;

  constructor(
    private dataService: DataService, 
    private dom: DomSanitizer,
    private appComponent: AppComponent,    
    private spinner: NgxSpinnerService,
    private component: ComponentesService,
    private changeDetector: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.dashboardUrl = this.dom.bypassSecurityTrustResourceUrl(this.url);
    //this.tarjetas()
  }

  tarjetas(){
    this.dataService.getDataDashboard().subscribe(res=>{
      this.dataDashboard = res["result"];
    })
  }


} 