import { Component, OnInit, Inject } from '@angular/core';

//Librerias
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ParticipesService } from '../../../participes.service';
import moment from 'moment';
import { ComponentesService } from '../../../../../services/componentes.service';

//ICONOS
import icEmail from '@iconify/icons-ic/email';
import icPhone from '@iconify/icons-ic/phone';
import icSMS from '@iconify/icons-ic/sms';
import icClose from '@iconify/icons-ic/close';
import icPictureAsPdf from '@iconify/icons-ic/picture-as-pdf';
import icImage from '@iconify/icons-ic/image';
import icDelete from '@iconify/icons-ic/delete';
import icAttachFile from '@iconify/icons-ic/attach-file';
import icSend from '@iconify/icons-ic/send';



import { ModalCorreoComponent } from '../modal-correo/modal-correo.component';
import { fadeInUp400ms } from '../../../../../../@vex/animations/fade-in-up.animation';
import { stagger80ms } from '../../../../../../@vex/animations/stagger.animation';
import { scaleIn400ms } from '../../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../../@vex/animations/fade-in-right.animation';
import { NGXLogger } from 'ngx-logger';




export interface Origen {
  name: string;
  icono: string;
  path: string;
}

@Component({
  selector: 'vex-modal-comentar',
  templateUrl: './modal-comentar.component.html',
  styleUrls: ['./modal-comentar.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ModalComentarComponent implements OnInit {

  //Variables
  accion = "";
  item;
  tipoTarea = "";
  sms = false;
  telefono = false;
  correo = false;


  historialCambiosContrato: any = [];
  historialCambiosPrestamo: any = [];
  historialCambiosNotificaciones: any = [];

  comentarios = [];
  participe;
  idTransaccion;
  tipoActividad;
  tarea = "Nuevo Credito";
  tiposTareas;
  titulo = "";
  comentario = "";
  date = moment().format();
  nombreActividad;
  numero = "whatsapp:+593968717835"
  celular = 0;
  origenes = [
    {
      nombre: "PRESTAMOS",
    },
    {
      nombre: "CREDITOS",
    },
    {
      nombre: "TAREA",
    }
  ]

  //Iconos
  icEmail = icEmail;
  icPhone = icPhone;
  icSMS = icSMS;
  icPictureAsPdf= icPictureAsPdf;
  icClose = icClose;
  icImage = icImage
  icDelete = icDelete;
  icAttachFile = icAttachFile;
  icSend = icSend;
  
  //Interfaces
  origen: Origen[] = [
    {
      name: 'SMS/WHATSAPP',
      icono: 'icSMS',
      path: 'M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z'
    },
    {
      name: 'CORREO',
      icono: 'icEmail',
      path: 'M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.313l6.709 3.933L8 8.928l1.291.717L16 5.715V5.4a2 2 0 0 0-1.059-1.765l-6-3.2zM16 6.873l-5.693 3.337L16 13.372v-6.5zm-.059 7.611L8 10.072.059 14.484A2 2 0 0 0 2 16h12a2 2 0 0 0 1.941-1.516zM0 13.373l5.693-3.163L0 6.873v6.5z'
    },
    {
      name: 'TELEFONO',
      icono: 'icPhone',
      path: 'M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z'
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private dataParticipe: ParticipesService,
    private dataComponent: ComponentesService,
    public dialog: MatDialog,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    switch (this.data["data"]) {
      case "nuevo":
        this.accion = "nuevo";
        this.tiposTareas = this.data["tareas"]
        this.participe = this.data["dataParticipe"];
        this.celular = this.participe.celular.replace("0", "");
        break;
    
      case "responder":
        this.accion = "responder";
        this.comentarios = this.data["item"]
        this.idTransaccion = this.data["itemTransaccion"]["idTransaccion"];
        this.tipoActividad = this.data["itemTransaccion"]["origen"];
        this.logger.log("Comentarios de actividad", this.comentarios);

        break;

      case "historial":
        this.accion = "historial";
        this.logger.log(this.data["item"]);
        this.historialCambiosContrato = this.data["item"]["listEstadoContrato"];
        this.historialCambiosPrestamo = this.data["item"]["listEstadoPrestamo"];
        break;

      case "credito":
        this.accion = "historial";
        this.historialCambiosPrestamo = this.data["item"];
      
      case "contrato":
        this.accion = "historial";
        this.historialCambiosContrato = this.data["item"];


      case "tarea":
        this.accion = "historial";
        this.historialCambiosNotificaciones = this.data["item"];


    }
  }

  comentar() {
    if (this.tipoActividad) {
      if (this.comentario) {
        const data = {
          "fecha": this.date,
          "titulo": this.titulo,
          "comentario": this.comentario
        }
        this.logger.log("Datos", this.idTransaccion , this.tipoActividad, data);
        this.dataParticipe.postComentarioByActividad(this.idTransaccion, this.tipoActividad, data).subscribe( res => {
          this.logger.log(res);
          this.dialogRef.close();
        }, error => {
          this.dialogRef.close();
        });
      } else {
        this.dataComponent.alerta("info", "Ingrese un comentario");
      }
    } else {
      this.dataComponent.alerta("info", "Ingrese tipo de actividad");
    }
  }

  seleccionarTarea(event) {
    this.logger.log(event);
    this.comentar()
  }

  seleccionarOrigen(tarea) {
    switch (tarea) {
      case "SMS/WhatsApp":
        this.tipoTarea = tarea
        this.sms = true;
        this.telefono = false;
        this.correo = false;
        break;
      case "Telefono":
        // this.sms = false;
        // this.telefono = true;
        // this.correo = false;
        break;
      case "Correo":
        this.sms = false;
        this.telefono = false;
        this.correo = true;
        break;
    }
  }

  seleccionarOrigenResponder(tarea) {
    switch (tarea) {
      case "SMS/WhatsApp":
        this.tipoTarea = tarea
        this.sms = true;
        this.telefono = false;
        this.correo = false;
        break;
      case "Telefono":
        this.sms = false;
        this.telefono = true;
        this.correo = false;
        break;
      case "Correo":
        this.sms = false;
        this.telefono = false;
        this.correo = true;
        break;
    }
  }

  enviarMensaje() {
    const data = {
      "to": this.celular,
      "body": this.comentario
    }

    this.logger.log(data);
    this.dataParticipe.postSMS(data).subscribe( response => {
      this.dialogRef.close();
      this.dataComponent.alerta("success", "Guardado correctamente");
      this.logger.log(response["result"]);
    })
  }

  //Enviar Correo
  enviarCorreo() {
    const dialogRef = this.dialog.open(ModalCorreoComponent, {
      width: '700px',
      data: {
        data: this.data["dataParticipe"],
        // actividad: item,
        // item: this.historialDeCambios
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  crearActividad() {
    switch (this.tipoTarea) {
      case "SMS/WhatsApp":
        this.enviarMensaje();
        break;
      case "Telefono":

        break;
      case "Correo":
        break;
    }
  }

  cambio(events) {
    
  }
}
