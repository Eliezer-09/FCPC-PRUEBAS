import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { TicketsService } from '../../tickets.service';

@Component({
  selector: 'vex-modal-ayuda',
  templateUrl: './modal-ayuda.component.html',
  styleUrls: ['./modal-ayuda.component.scss'],
  animations: [
    fadeInRight400ms,
    scaleIn400ms,
    fadeInUp400ms,
  ],
  providers: [DatePipe]
})
export class ModalAyudaComponent implements OnInit {

  asunto;
  descripcion;
  horaEmision;
  tareas = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModal: ModalAyudaComponent,
    private datePipe: DatePipe,
    private ticketService: TicketsService,
  ) { }

  ngOnInit(): void {
    this.horaEmision = this.datePipe.transform(this.dataModal["ticket"]["fecha"], "h:mm a");
    this.cargarTarea(this.dataModal["ticket"]["idTarea"]);
    this.cargarComentarios(this.dataModal["ticket"]["idTarea"]);
  }

  cargarComentarios(IdTarea){
    this.ticketService.getComentariosByIdTarea(IdTarea).subscribe(response => {
      this.tareas = response["result"];
    });
  }

  cargarTarea(IdTarea){
    this.ticketService.getTareaById(IdTarea).subscribe(response => {
      this.asunto = response["result"]["titulo"];
      this.descripcion = response["result"]["descripcion"];
    });
  }

}
