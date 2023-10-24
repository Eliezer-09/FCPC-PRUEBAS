import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
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
import icRenew from '@iconify/icons-ic/autorenew';
import { MatTableDataSource } from '@angular/material/table';
import { TicketsService } from '../tickets.service';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { ModalAyudaComponent } from './modal-ayuda/modal-ayuda.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalReabrirComponent } from './modal-reabrir/modal-reabrir.component';

@UntilDestroy()
@Component({
  selector: 'vex-mesa-ayuda',
  templateUrl: './mesa-ayuda.component.html',
  styleUrls: ['./mesa-ayuda.component.scss'],
  animations: [
    stagger80ms,
  ]
})
export class MesaAyudaComponent implements OnInit {

  layoutCtrl = new FormControl('fullwidth');
  selection = new SelectionModel<any>(true, []);
  dataTicketsSource: MatTableDataSource<any>;
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  customers2: any[];
  isLoading = true;
  searchCtrl = new FormControl();
  tickets = [];

  //ICONS
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icRenew = icRenew;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  icEye = icEye;
  //ICONS

  paginaIndex = 1;
  paginaSize = 20;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns = ["turno", "nombre", "fechaRegistro", "horaRegistro", "Estado", "Prioridad", "Acciones"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private spinner: NgxSpinnerService,
    private ticketService: TicketsService,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit(){
    this.dataTicketsSource = new MatTableDataSource();
    this.cargarTickets();
  }

  ngAfterViewInit() {
    this.dataTicketsSource.paginator = this.paginator;
    this.dataTicketsSource.sort = this.sort;
  }

  cargarTickets(){
    this.ticketService.getTicketsInternos().subscribe(response => {
      this.dataTicketsSource.data = response["result"];
      this.isLoading = false;
    });
  }

  infoTicket(ticket){
    const dialogRef = this.dialog.open(ModalAyudaComponent, {
      width: '100%',
      autoFocus: false,
      maxHeight: '90vh',
      data: {ticket}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  infoReabrir(ticket){
    const dialogRef = this.dialog.open(ModalReabrirComponent, {
      width: '60%',
      autoFocus: false,
      maxHeight: '90vh',
      data: {ticket}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
