import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Prestamo } from 'src/app/model/models';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import { CreditosService } from '../../creditos.service';

@Component({
  selector: 'vex-actividad-credito',
  templateUrl: './actividad-credito.component.html',
  styleUrls: ['./actividad-credito.component.scss']
})
export class ActividadCreditoComponent implements OnInit {
  lastComentId: number;
  @Input() prestamo: Prestamo;
  @Input() actividadPrestamo: any[] = [];
  observaciones = ""

  constructor(
    private dataService: DataService, 
    private authService: AuthService,
    private componentService: ComponentesService,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private changeDetector: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    this.cargarComentarios()
  }


  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges()
  }

  cargarComentarios() {
    this.dataService.getComentarios(this.prestamo.idPrestamo).subscribe(
      (actividad) => {
        this.actividadPrestamo = actividad["result"];
        this.lastComentId=this.actividadPrestamo[this.actividadPrestamo.length-1].idComentario
        this.authService.getFotoFuncionario();
      },
      (error) => {
        this.componentService.alerta(
          "error",
          "Ocurrió un error al cargar los comentarios"
        );
      }
    );
  }

  comentar() {
    this.spinner.show()
    const data = {
      "fecha": this.dataService.date,
      "comentario": this.observaciones,
      "titulo": "",
      "funcionario": this.authService.getFuncionario(),
      "idTipoTarea": 1,
      "idEntidad": this.prestamo.idParticipe,
      "idComentario": this.lastComentId
    }
    if (this.observaciones != "") {
      this.creditoService.postComentario(this.prestamo.idPrestamo, data).subscribe(res=>{
        this.spinner.hide()
        this.cargarComentarios()
        this.componentService.alerta("success", "Se ha agregado exitosamente el comentario").then(res=>{
          // this.changeDetectorRefs.markForCheck()
        })
      }, error=>{
        this.spinner.hide()
        this.componentService.alerta("error", "Hubo un error al agregar comentario")
      })
    } else {
      this.spinner.hide()
      this.componentService.alerta("info", "Debes agregar un comentario")
    }
  }

}
