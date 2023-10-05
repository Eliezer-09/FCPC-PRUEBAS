import { Component, OnInit, Input } from '@angular/core';

//Iconos
import icDescription from '@iconify/icons-ic/twotone-description';
import icSearch from '@iconify/icons-ic/twotone-search';
import icEmail from '@iconify/icons-ic/email';
import icAssignment from '@iconify/icons-ic/assignment-ind';
import icPhone from '@iconify/icons-ic/phone';
import icLocationCity from '@iconify/icons-ic/location-city';
import icPerson from '@iconify/icons-ic/person';
import icCreditCard from '@iconify/icons-ic/credit-card';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFavorite from '@iconify/icons-ic/twotone-favorite';
import icComment from '@iconify/icons-ic/twotone-comment';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icKeyboardArrowRight from '@iconify/icons-ic/twotone-keyboard-arrow-right';
import icCheck from '@iconify/icons-ic/sharp-check';
import { ParticipesService } from '../../../participes.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComentarComponent } from '../modal-comentar/modal-comentar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';


@Component({
  selector: 'vex-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss']
})
export class ActividadesComponent implements OnInit {

  //Variables
  @Input() dataActividad?: any;

  //Arreglos
  historialDeCambios = [];
  dataActividad2 = {
    data: {},
    photo: undefined,
  }

  //Iconos
  icSearch = icSearch;
  icDescription = icDescription;
  icEmail =  icEmail;
  icPhone = icPhone;
  icAssignment = icAssignment;
  icLocationCity = icLocationCity
  icPerson = icPerson
  icCreditCard = icCreditCard
  icAdd = icAdd;
  icFavorite = icFavorite;
  icComment = icComment;
  icAttachFile = icAttachFile;
  icKeyboardArrowRight = icKeyboardArrowRight;
  icCheck = icCheck;

  constructor(
    private dataParticipes: ParticipesService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private logger: NGXLogger,) { }

  ngOnInit() {
    
    try {
      this.logger.log(this.dataActividad);
      this.dataActividad2.photo = this.dataActividad.foto;
      
      // this.dataParticipes.getPhotoFuncionario(this.dataActividad.correo).subscribe( res => {
      //   this.logger.log("SEGURO URL", res)
      //   this.dataActividad2.data = this.dataActividad2;
      //   this.dataActividad2.photo = res;
      //   this.logger.log("FOTO",this.dataActividad2);
      // });
    } catch (error) {
      
    }
  }

  comentar(accion, item?) {

    this.logger.log(item);
    if (accion == "nuevo") {
      //Crear nueva actividad
      this.dataParticipes.getTiposTareas().subscribe( res => {
        const tareas = res["result"];
        const dialogRef = this.dialog.open(ModalComentarComponent, {
          width: '600px',
          data: {
            data: "nuevo",
            tareas: tareas
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
        });
      });
    } 
    
    if (accion == "responder") {
      //Comentar una actividad
      if (item["origen"] == "CONTRATO") {
        this.spinner.show();
        this.dataParticipes.getComentariosByActividad(item["idEntidad"], item["origen"]).subscribe((res:any) => {
          this.spinner.hide();
          var comentarios = res["result"];
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "responder",
              item: comentarios,
              itemTransaccion: item
            }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      } 
      
      if (item["origen"] == "CREDITO") {
        this.spinner.show();
        this.dataParticipes.getComentariosByActividad(item["idTransaccion"], item["origen"]).subscribe((res:any) => {
          this.spinner.hide();
          var comentarios = res["result"];
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "responder",
              item: comentarios,
              itemTransaccion: item
            }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      }

      if (item["origen"] == "TAREA") {
        this.spinner.show();
        this.dataParticipes.getComentariosByActividad(item["idTransaccion"], item["origen"]).subscribe((res:any) => {
          this.spinner.hide();
          var comentarios = res["result"];
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "responder",
              item: comentarios,
              itemTransaccion: item
            }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      }
    } 
    
    if (accion == "historial") {
      //Historial de actividades
      if (item["origen"] == "CONTRATO") {
        this.spinner.show();
        this.dataParticipes.getHistorialCambiosContrato(item["idEntidad"]).subscribe( res => {
          this.spinner.hide();
          this.historialDeCambios = res["result"];
          this.logger.log(this.historialDeCambios);
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "contrato",
              actividad: item,
              item: this.historialDeCambios
            }
          });
    
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      } 

      if (item["origen"] == "CREDITO") {
        this.dataParticipes.getHistorialCambiosPrestamo(item["idTransaccion"]).subscribe( res => {
          this.historialDeCambios = res["result"];
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "credito",
              actividad: item,
              item: this.historialDeCambios
            }
          });
    
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      }

      if (item["origen"] == "TAREA") {
        this.dataParticipes.getHistorialNotificaciones(item["idEntidad"]).subscribe( res => {
          this.historialDeCambios = res["result"];
          const dialogRef = this.dialog.open(ModalComentarComponent, {
            width: '600px',
            data: {
              data: "tarea",
              actividad: item,
              item: this.historialDeCambios
            }
          });
    
          dialogRef.afterClosed().subscribe(result => {
          });
        });
      }
    }
  }
}
