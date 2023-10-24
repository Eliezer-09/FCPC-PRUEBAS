import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormControl }                         from '@angular/forms';
import { PageEvent }                           from '@angular/material/paginator';
import { MatDialog }                           from '@angular/material/dialog';
import { NgxSpinnerService }                   from 'ngx-spinner';
import {ModalFiltroReportesComponent}          from '../../../pages/reportes/modal-filtro-reportes/modal-filtro-reportes.component';
import { map }                                 from 'rxjs/operators';
import { ComponentesService }                  from 'src/app/services/componentes.service';
import { fadeInUp400ms }                       from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                         from 'src/@vex/animations/stagger.animation';
import { iconify,iconfa }                      from 'src/static-data/icons'
import { OperationResultReporte, ReporteDTO  } from '../../../model/models';
import { ReportesService}                      from '../reportes.service';
import { TableColumn }                         from '../../../../@vex/interfaces/table-column.interface';
import { MatTableDataSource }                  from '@angular/material/table';

const ELEMENT_DATA: any[] = [
  {
    result: ''
  },
]
@Component({
  selector: 'vex-reportes-reporte',
  templateUrl: './reportes-reporte.component.html',
  styleUrls: ['./reportes-reporte.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ],
})

export class ReportesReporteComponent implements OnInit {

  isLoading           = true;
  isCard              = true;
  pageSize            = 12;
  infoMessage         = "No se ha encontrado reportes";
  term ='';
  faFileMedicalAlt    = iconfa.faFileMedicalAlt;
  faGripHorizontal    = iconfa.faGripHorizontal;
  ictwotoneTableChart = iconify.icroundTableChart;
  icroundSearch       = iconify.icroundSearch;
  faFileContract     = iconfa.faFileContract;
  layoutCtrl          = new FormControl('boxed');
  reports             = new MatTableDataSource<OperationResultReporte>(ELEMENT_DATA);
  reportsresult:        OperationResultReporte = {};
  pageSizeOptions:    number[] = [4,12,24,48,96];
  pageEvent:          PageEvent;
  filterValue:        string = null; 
  tableColumns:       TableColumn<ReporteDTO>[] = [
    {
      label: 'Reporte',
      property: 'titulo',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Descripción',
      property: 'descripcion',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: '',
      property: 'vista',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];
  
  constructor(
    private spinner: NgxSpinnerService,
    private dialog : MatDialog,
    private reportesService: ReportesService,
    private changeDetector: ChangeDetectorRef,
    private componentesService : ComponentesService
  ) {}
  
  ngOnInit(): void {
    this.loadReports(1,this.pageSize);
  }
  
  loadReports(page?,size?){
    this.reportesService.getReporteDTO( page,size).pipe(
      map((reports:OperationResultReporte) => {
        this.isLoading = false
        this.reportsresult = reports;
        this.reports.data = reports.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  onChangeStyleReports(status: boolean){
    this.isCard = status;
  }

  loadReportsByTerm(page,pageSize){
    this.reportesService.getReporteDTOByTerm(this.term,page,pageSize).pipe(
      map((reports:OperationResultReporte) => {
        this.isLoading = false
        this.reportsresult = reports;
        this.reports.data = reports.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term=term || ''
    if (this.term.length > 0) {
      this.loadReportsByTerm(1,this.pageSize);
    }else {
      this.loadReports(1,this.pageSize);
    }
  }


  openViewFilterReport(report? : ReporteDTO) {
    const idReportes = report["data"] || report["idReporte"]
    this.reportesService.getReporteDTOLight(idReportes).pipe(
        map((reporte: any) =>{
          report = reporte.result;
          const dialogRef = this.dialog.open(ModalFiltroReportesComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            panelClass: 'full-screen-modal',
            data: report || null
          })
          
          dialogRef
              .beforeClosed()
              .subscribe(result => {
                  if(result){
                    this.generateReport(result) 
                  }
                 
          });
      })
    ).subscribe();
  }

  generateReport(data) {
    this.spinner.show();
    const idReporte= data["idReporte"];
    const format =data["format"];
    let formData =data["formData"];
    formData = this.parseform(formData);
    this.reportesService.postReporteReports(idReporte, format, formData ).subscribe(response => {
      this.downloadreport(response);
      this.spinner.hide();
    }, error => {
        this.componentesService.alerta("error", "Ocurrió un error al intentar generar el reporte.")
        this.spinner.hide();
    }); 
  }

  parseform(formData) {
    for (let data in formData) {
        let valor = formData[data]
        if (typeof valor !== 'string') {
            formData[data] = "" + valor;
        }
    } 

    return formData;
  }

  transformDataType(type: string){
    type = type.toLowerCase();
    if (type==='varchar'|| type==='char' ) {
      return 'text';
    }else if (type === "date" || type === 'datetime' || type ==='smalldatetime') {
      return 'date';
    }
    return 'number';
  }

  downloadreport(file : any) {
    let report = URL.createObjectURL(file);
    window.open(report, '_blank');
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.loadReportsByTerm(page,size);
  }

}
