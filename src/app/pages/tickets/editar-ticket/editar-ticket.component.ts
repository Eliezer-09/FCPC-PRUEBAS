import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarCrearTicketComponent } from 'src/@vex/layout/toolbar/toolbar-crear-ticket/toolbar-crear-ticket.component';
import { Emisor, TicketInterno } from 'src/app/model/models';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../auth/auth.service';
import { TicketsService } from '../tickets.service';
import icDocument from '@iconify/icons-ic/file-upload';
import icDriveFile from '@iconify/icons-ic/insert-drive-file';
import icRemoveCircle from '@iconify/icons-ic/remove-circle';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { Areas, TipoTarea } from '../ticket.interface';

@Component({
  selector: 'vex-editar-ticket',
  templateUrl: './editar-ticket.component.html',
  styleUrls: ['./editar-ticket.component.scss']
})
export class EditarTicketComponent implements OnInit, AfterViewChecked
 {

  datosTicket: FormGroup;
  areas;
  funcionario;
  clickCrear = false;
  adjunto;
  nombreArchivo: string;
  fileBase64: string;
  mostrarAdjuntos = false;
  existeSubTarea = false;

  //Variables
  tiposTareas: TipoTarea[] = [];
  tags = [];
  tagsSeleccionados = [];
  tagsId = [];
  prioridades = [{ "valor": 1, "nombre": "Urgente" }, { "valor": 2, "nombre": "Alta" }, { "valor": 3, "nombre": "Media" }, { "valor": 4, "nombre": "Baja" }]

  //Iconos
  icDocument = icDocument;
  icDriveFile = icDriveFile;
  icRemoveCircle = icRemoveCircle;
  prioridad: number;
  idTicket: number;
  idDepartamento: number;
  descripcionDepartamento: string;
  area: Areas;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  public filteredTipoTarea: ReplaySubject<TipoTarea[]> = new ReplaySubject<TipoTarea[]>(1);
  public tipoTareaFilterCtrl: FormControl = new FormControl();

  constructor(
    private dataServices: DataService,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private authService: AuthService,
    private componentService: ComponentesService,
    private dialogRef: MatDialogRef<EditarTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public ticket: TicketInterno,
  ) { }

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }
  ngOnInit(): void {
    this.datosTicket = this.fb.group({
      identificacion: [''],
      nombre: [''],
      area: ['', [Validators.required]],
      idTipoTarea: [0, [Validators.required]],
      asunto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      tags: [[]],
    });
    this.idTicket = this.ticket.idTicket;
    if(this.ticket.idTicketPadre == null){
      this.cargarTipoTareas()
    }else{
      this.cargarSubtareas(this.ticket.idTipoTareaPadre);
    }
    this.tagsSeleccionados = this.ticket.tags;
    this.cargarDepartamentos()
    this.cargarPrioridades()
    this.obtenerTaresByArea()
    this.cargarAreaByIdTipoTarea()
  }

  cargarPrioridades() {
    switch (this.ticket.prioridad) {
      case "Urgente":
        this.prioridad = 1;
        break;
      case "Alta":
        this.prioridad = 2;
        break;
      case "Media":
        this.prioridad = 3;
        break;
      case "Baja":
        this.prioridad = 4;
        break;
      default:
        break;
    }
  }

  cargarTipoTareas(){
    this.ticketService.getTiposTarea().subscribe((res:TipoTarea[])=>{
      this.tiposTareas = res;
      this.filteredTipoTarea.next(this.tiposTareas.slice());

      // listen for search field value changes
      this.tipoTareaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterTipoTarea();
        });
    })
  }

  cargarSubtareas(idTipoTarea) {
    this.ticketService.getSubTareas(idTipoTarea).subscribe((res: TipoTarea[]) => {

      this.tiposTareas = res;
      this.filteredTipoTarea.next(this.tiposTareas.slice());
      // listen for search field value changes
      this.tipoTareaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterTipoTarea();
        });
    }, error => {
    })
  }

  cargarAreaByIdTipoTarea(idTipoTarea?){
    const id = idTipoTarea ? idTipoTarea : this.ticket.idTipoTarea
    this.ticketService.getAreaByIdTiposTarea(id).subscribe( (area: Areas) => {
      this.area = area;
      this.idDepartamento = this.area.idDepartamento;
      this.descripcionDepartamento = this.area.descripcion
    }, error => {

    })
  }

  cargarDepartamentos() {
    this.dataServices.getDepartamentos().subscribe(area => {
      this.areas = area["result"];
    });
  }

  seleccionarArea(event) {
    this.tagsSeleccionados = [];
    this.tagsId = [];
    this.tags = [];
    this.obtenerTaresByArea(event);
  }

  seleccionarPrioridad(event) {
    this.ticket.prioridad = event
  }

  seleccionarTarea(idTipoTarea?) {
    this.tags = []
    this.tagsSeleccionados = [];
    this.tagsId = [];

    if (idTipoTarea != null || idTipoTarea != undefined) {
      this.ticket.idTipoTarea = idTipoTarea;
    }
    this.dataServices.getTagsByTipoTarea(this.ticket.idTipoTarea).subscribe((tags: any) => {
      this.tags = tags["result"];
    })
    this.cargarAreaByIdTipoTarea(idTipoTarea);
  }

  seleccionarTags(tipoTag) {
    if (this.tagsSeleccionados.length != 0) {
      var existeEtiqueta = this.tagsSeleccionados.find(res=>res["idTag"] == tipoTag["idTag"])
      if (!existeEtiqueta) {
        this.tagsId.push(tipoTag["idTag"]);
        this.tagsSeleccionados.push(tipoTag);
      }
    } else {
      this.tagsId.push(tipoTag["idTag"]);
      this.tagsSeleccionados.push(tipoTag);
    }

  }

  //FIXME: NO BORRAR 
  eliminarTag(tag) {
    this.tagsId = []
    if(this.tagsSeleccionados.length != 0){
      const index = this.tagsSeleccionados.findIndex( res => res.idTag == tag.idTag);
      this.tagsSeleccionados.splice(index, 1);
    } else {
      const index = this.ticket.tags.findIndex( id => id == tag.idTag);
      this.ticket.tags.splice(index, 1);
    }
    this.tagsSeleccionados.forEach(tag=>{
      this.tagsId.push(tag["idTag"]);
    })
  }


  obtenerTaresByArea(idArea?) {
    if (idArea != null || idArea != undefined) {
      this.ticket.idDepartamento = idArea;
    }
    this.dataServices.getTiposTareasByArea(this.ticket.idDepartamento).subscribe(tarea => {
      this.tiposTareas = tarea["result"];
    });
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
   protected setInitialValue() {
    this.filteredTipoTarea
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: TipoTarea, b: TipoTarea) => a && b && a.idTipoTarea === b.idTipoTarea;
      });
  }

  protected filterTipoTarea() {
    if (!this.tiposTareas) {
      return;
    }
    // get the search keyword
    let search = this.tipoTareaFilterCtrl.value;
    if (!search) {
      this.filteredTipoTarea.next(this.tiposTareas.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the emisor
    const data = this.tiposTareas.filter(tipoTarea => tipoTarea.descripcion.toLowerCase().indexOf(search) > -1)
    this.filteredTipoTarea.next(
      this.tiposTareas.filter(tipoTarea => tipoTarea.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  confirmar() {
    this.spinner.show();
    const dataTicket = {
      codigo: this.ticket.codigo,
      fecha: this.ticket.fecha,
      identificacion: this.ticket.identificacion,
      nombre: this.ticket.nombre,
      idEntidad: this.ticket.idEntidad,
      idTipoTarea: this.ticket.idTipoTarea,
      idDepartamento: this.ticket.idDepartamento,
      asunto: this.ticket.asunto,
      descripcion: this.ticket.descripcion,
      prioridad: this.prioridad,
      tags: this.tagsId,
      fechaTentativa: this.ticket.fechaTentativa,
    }
    this.ticketService.putTicket(this.idTicket, dataTicket).subscribe(res => {
      this.spinner.hide();
      this.componentService.alerta("success", "Se ha editado el ticket").then(res => {
        if (res.isConfirmed) {
          this.dialogRef.close()
        }
      })
    }, error => {
      this.spinner.hide();
      this.componentService.alerta("Error", error.error.message)
    })
  }

}
