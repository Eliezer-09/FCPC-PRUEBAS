import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrestamosEstados } from 'src/app/model/models';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconify } from 'src/static-data/icons';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { CreditosService } from '../../../creditos.service';

@Component({
  selector: 'vex-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'],
  animations: [fadeInUp400ms, stagger80ms],
})
export class PrestamosComponent implements OnInit {
  
  selection = new SelectionModel<PrestamosEstados>(true, []);
  prestamosParticipe: PrestamosEstados[] = [];
  idPrestamos: any[] = [];
  buscar:boolean=false;
  infoMessage:string="Busca prestamos activos";
  infoMessage2:string="No tiene prestamos activos";
  valorPrestamo :number=0;
  totalSaldoCancelacion: number=0;
  @Output() totalsEmit: EventEmitter<any> = new EventEmitter();
  totalInteres:number=0;
  @Input() hasOnePrestamo:boolean=false;
  @Input() hasDiasVencidos:boolean=false;
  icroundCreditCard=iconify.roundCreditCard
  columnasPrestamo = [
    "checkbox",
    'idPrestamo',
    "montoSolicitado",
    "capitalOtorgado",
    "tipoPrestamo",
    "fecha",
    "calificacion",
  ];
  constructor(   private creditoService: CreditosService,
                  private changeDetectorRefs: ChangeDetectorRef,
                  private spinner: NgxSpinnerService,
                  private dataComponente: ComponentesService) { }

  ngOnInit(): void {
  }
  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  changeHasDiasVencidos(){
    this.hasDiasVencidos=true;
    this.columnasPrestamo = [
      "checkbox",
      'idPrestamo',
      "montoSolicitado",
      "capitalOtorgado",
      "diasVencido",
      "tipoPrestamo",
      "fecha",
      "calificacion",
    ];
  }

  getPrestamos(idParticipe,tipoSolicitud) {
    this.buscar=true;
    this.spinner.show();
    this.clearToggle()
    if(tipoSolicitud=="Restructuracion")  this.changeHasDiasVencidos()
        this.creditoService
          .getPrestamoSimulacion(idParticipe, tipoSolicitud)
          .subscribe(
            (res: any) => {
              this.prestamosParticipe = res["result"];
              if( this.prestamosParticipe.length==0) this.dataComponente.alerta("info","El partícipe no cuenta con préstamos activos.");
              this.spinner.hide();
            },
            (error) => {
              this.spinner.hide();
              this.dataComponente.alerta("error", error["error"]["message"]);
            }
          );

  }
clearToggle(){
  this.idPrestamos = [];
  this.valorPrestamo = 0;
  this.totalInteres=0;
  this.totalSaldoCancelacion=0;
  this.selection.clear();
  this.hasDiasVencidos=false;
  this. columnasPrestamo = [
    "checkbox",
    'idPrestamo',
    "montoSolicitado",
    "capitalOtorgado",
    "tipoPrestamo",
    "fecha",
    "calificacion",
  ];
  this.totalsEmit.emit({interes:this.totalInteres,capital:this.valorPrestamo, totalSaldoCancelacion:this.totalSaldoCancelacion})
  this. detectarCambios() 
}

clearPrestamos(){
 this.clearToggle()
  this.prestamosParticipe=[]
  this. detectarCambios() 
}

  masterToggle() {
    this.idPrestamos = [];
    this.valorPrestamo = 0;
    this.totalSaldoCancelacion=0;
     this.totalInteres=0;
    if (this.isAllSelected()) {
      this.selection.clear();
      this.emitirTotal()
      return;
    }

    this.prestamosParticipe.forEach((row) => {
      this.selection.select(row);
      this.idPrestamos.push(row.idPrestamo);
      this.valorPrestamo += row.saldoCapital;
      this.totalSaldoCancelacion+=row.totalSaldoCancelacion;
    });
    this.emitirTotal()
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.prestamosParticipe.length;
    return numSelected === numRows;
  }

  seleccionado($event, row) {
    if (!$event) return;
    this.selection.toggle(row); 

    if (this.selection.isSelected(row)) {
      if(this.idPrestamos.length==1 && this.hasOnePrestamo){
        this.dataComponente.alerta("info",  "Solo puedes elegir un préstamo").then((res) =>{
          this.selection.deselect(row);
          this.deshacerSeleccion(row)
        } );
        return;
      }
      this. agregarSeleccion(row)
    } else {
      this.deshacerSeleccion(row)
    }
  }

  agregarSeleccion(row){
    var data = this.idPrestamos.find((id) => id == row.idPrestamo);
    if (data != row.idPrestamo) {
      this.valorPrestamo += row.saldoCapital;
      this.totalSaldoCancelacion+=row.totalSaldoCancelacion;
      this.idPrestamos.push(row.idPrestamo);
      if(this.hasOnePrestamo){
        this.totalInteres=row.totalInteres;
        this.valorPrestamo=row.saldoCapital;
        this.totalSaldoCancelacion=row.totalSaldoCancelacion;
        this.emitirTotal()
        return;
      }
     this.emitirTotal()
    }
  }

  emitirTotal(){
    this.totalsEmit.emit({interes:this.totalInteres,capital:this.valorPrestamo, totalSaldoCancelacion:this.totalSaldoCancelacion})
  }
  deshacerSeleccion(row){
    var index = this.idPrestamos.indexOf(row.idPrestamo);
    if (index > -1) {
      this.valorPrestamo -= row.saldoCapital;
      this.totalSaldoCancelacion-=row.totalSaldoCancelacion;
      this.idPrestamos.splice(index, 1);
      this.emitirTotal()
    }
    this.detectarCambios()
  }

}
