import { FormControl } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icFolder from '@iconify/icons-ic/twotone-folder';
import icPhone from '@iconify/icons-ic/twotone-phone';
import icMail from '@iconify/icons-ic/twotone-mail';
import icMap from '@iconify/icons-ic/twotone-map';
import icEye from '@iconify/icons-ic/visibility';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Router } from '@angular/router';
import { ComponentesService } from 'src/app/services/componentes.service';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { TicketsService } from './tickets.service';

@UntilDestroy()
@Component({
  selector: 'vex-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  animations:[
    fadeInUp400ms,
    stagger80ms
  ]
})
export class TicketsComponent implements OnInit {

  layoutCtrl = new FormControl('fullwidth');

  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  subject2$Proceso: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  subject2$Terminado: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  data2Proceso$: Observable<any[]> = this.subject2$Proceso.asObservable();
  data2Terminados$: Observable<any[]> = this.subject2$Terminado.asObservable();
  customers2: any[];
  customers2Proceso: any[];
  customers2Terminados: any[];
  pageSize = 10;
  pageIndex = 2;
  pageSizeOptions: number[] = [5, 10, 20];
  dataFondoSource: MatTableDataSource<any> | null;
  dataFondoSourceProceso: MatTableDataSource<any> | null;
  dataFondoSourceTerminado: MatTableDataSource<any> | null;
  selection = new SelectionModel<any>(true, []);
  searchCtrl = new FormControl();
  searchCtrlProceso = new FormControl();
  searchCtrlTerminado = new FormControl();
  displayedColumns = ["turno", "nombre", "identificacion", "fechaRegistro", "horaRegistro", "Motivo", "Acciones"];
  displayedColumnsAtendido = ["nombre", "identificacion", "fechaRegistro", "horaRegistro", "Tiempo", "Motivo"];

  paginaIndex = 1;
  paginaSize = 20;

  //ICONOS
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  icEye = icEye;

  //aprobadoCompleto:any[];
  tickets:any[];
  ticketsProceso:any[];
  ticketsTerminados:any[];

  isLoading = true;
  usuario;
  tab = 'pendiente';


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorProceso: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortProceso: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorTerminado: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortTerminado: MatSort;

  constructor(    
    private data: DataService,
    private router: Router,
    private dataComponent: ComponentesService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private logger: NGXLogger,
    private ticketService: TicketsService) 
  { }

  ngOnInit() {
    this.dataFondoSource = new MatTableDataSource();
    this.dataFondoSourceProceso = new MatTableDataSource();
    this.dataFondoSourceTerminado = new MatTableDataSource();

    this.tickets = [];
    this.ticketsProceso = [];
    this.ticketsTerminados = [];
    this.ticketService.getTicketsByEstado("Pendiente").subscribe( (response:any) => {
      this.isLoading = false;
      this.tickets = response["result"];
      this.subject2$.next(this.tickets);
    })

    this.data2$.pipe(
      filter<any[]>(Boolean)
    ).subscribe(customers => {
      this.customers2 = customers;
      this.dataFondoSource.data = customers;
    });

    this.ticketService.getTicketsByEstado("Enproceso").subscribe((response: any) => {
      this.ticketsProceso = response["result"];
      this.subject2$Proceso.next(this.ticketsProceso);
      this.logger.log(this.ticketsProceso)
    })

    this.data2Proceso$.pipe(
      filter<any[]>(Boolean)
    ).subscribe(customersProceso => {
      this.logger.log(customersProceso)
      this.customers2Proceso = customersProceso;
      this.dataFondoSourceProceso.data = customersProceso;
    });

    this.ticketService.getTicketsByEstado("Atendido").subscribe((response: any) => {
      this.ticketsTerminados = response["result"];
      this.subject2$Terminado.next(this.ticketsTerminados)
    })

    this.data2Terminados$.pipe(
      filter<any[]>(Boolean)
    ).subscribe(customers => {
      this.customers2Terminados = customers;
      this.dataFondoSourceTerminado.data = customers;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
    
    this.searchCtrlProceso.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChangeProceso(value));
  }

  ngAfterViewInit() {

    this.dataFondoSource.paginator = this.paginator;
    this.dataFondoSource.sort = this.sort;

    this.dataFondoSourceProceso.paginator = this.paginatorProceso;
    this.dataFondoSourceProceso.sort = this.sortProceso;
    
  }

  onFilterChange(value: string) {
    if (!this.dataFondoSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataFondoSource.filter = value;
  }

  onFilterChangeProceso(value: string) {
    if (!this.dataFondoSourceProceso) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataFondoSourceProceso.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  irModalInfo(idTicket, identificacion, horaEmitido, tipo, idTarea) {
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      width: '100%',
      autoFocus: false,
      maxHeight: '90vh',
      data: {idTicket, identificacion, horaEmitido, tipo, idTarea}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  anular(idTicket, tablePosition){
    this.dataComponent.alertaButtons("Esta por anular este ticket. \n¿Desea continuar?").then((result) => {
      if(result.isConfirmed){
        //this.spinner.show();
        this.ticketService.postTicketAnular(idTicket).subscribe(response => {
          if(response["success"] == true){
            this.spinner.hide();
            this.dataFondoSource.data.indexOf(tablePosition);
            this.dataFondoSource.data.splice(tablePosition, 1);
            this.dataFondoSource._updateChangeSubscription();
            this.dataComponent.alerta("success", "Ticket Anulado!");
          }else{
            this.spinner.hide();
            this.dataComponent.alerta("error", "Error al intentar anular el turno!")
          }
        })
      }
    })
  }

  onTabChanged(event){
    if(event["index"] == 0){
      this.tab = 'pendiente';
    }

    if(event["index"] == 1){
      this.tab = 'proceso';
    }

    if(event["index"] == 2){
      this.tab = 'terminado';
    }
  }


}
