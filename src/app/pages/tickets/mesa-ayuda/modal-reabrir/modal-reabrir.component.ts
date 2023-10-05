import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsService } from '../../tickets.service';

@Component({
  selector: 'vex-modal-reabrir',
  templateUrl: './modal-reabrir.component.html',
  styleUrls: ['./modal-reabrir.component.scss']
})
export class ModalReabrirComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModal: ModalReabrirComponent,
    private fb: FormBuilder,
    private ticketService: TicketsService,
  ) { }

  datosTicket: FormGroup;

  ngOnInit(): void {
    this.datosTicket = this.fb.group({
      motivo: ['', [Validators.required]],
    });
  }

  reabrirTicket(){
    /* this.ticketService.postReabrirTicket(dataModal["ticket"]["idTicket"]).subscribe(response => {
      this.asunto = response["result"]["titulo"];
      this.descripcion = response["result"]["descripcion"];
    }); */
  }

}
