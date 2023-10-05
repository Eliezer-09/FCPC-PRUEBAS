import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';

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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Quill from 'quill';
import { ComponentesService } from '../../../../../services/componentes.service';

@Component({
  selector: 'vex-modal-correo',
  templateUrl: './modal-correo.component.html',
  styleUrls: ['./modal-correo.component.scss']
})
export class ModalCorreoComponent implements OnInit {

  @ViewChild('editor') editor: ElementRef;
  public QuillElement: Quill;

  //Variables
  dataParticipe;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentes: ComponentesService
  ) { }

  ngOnInit() {
    this.dataParticipe = this.data['data'];
    this.QuillElement = new Quill(this.editor.nativeElement, {
      modules: {},
      syntax: true,
      theme: 'snow',
    });
  }

  toggleDropdown() {

  }

  enviarCorreo() {
    this.componentes.alertaButtons("Desea enviar este correo").then( (result) => {
      if (result.isConfirmed) {
        this.componentes.alerta("success", "Correo enviado exitosamente")
      } else if (result.isDenied) {
        
      }
    })
  }
}
