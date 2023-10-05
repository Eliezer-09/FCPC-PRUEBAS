import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-modal-solicitar-ticket',
  templateUrl: './modal-solicitar-ticket.component.html',
  styleUrls: ['./modal-solicitar-ticket.component.scss']
})
export class ModalSolicitarTicketComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModal: ModalSolicitarTicketComponent,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  formSolicitud = this.fb.group({
    tipoRenta: [""],
    asunto: [""],
    descripcion: [""],
  });

  clickSendSolicitud(){
    
  }

}
