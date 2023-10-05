import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../../../../services/data.service';
import { ComponentesService } from '../../../../../services/componentes.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'vex-modal-acreditacion',
  templateUrl: './modal-acreditacion.component.html',
  styleUrls: ['./modal-acreditacion.component.scss']
})
export class ModalAcreditacionComponent implements OnInit {

  postTransferir = {
    comentarios: "",
    funcionario: this.authService.getFuncionario(),
    fecha: this.dataService.date,
    idReferenciaBancaria: "",
    monto: "",
  }

  dataPrestamo;
  referenciasBancarias = [];

  constructor(
    public dialogRef: MatDialogRef<ModalAcreditacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef,
    private component: ComponentesService,
    private logger: NGXLogger
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.dataPrestamo = this.data["data"];
    this.postTransferir.monto = this.dataPrestamo["montoSolicitado"];

    this.dataService.getParticipeById(this.dataPrestamo["idParticipe"]).subscribe( res => {
      this.spinner.hide();
      this.referenciasBancarias = res["result"]["referenciasBancarias"];
      this.detectarCambios();
    }, error => {
      this.spinner.hide();
    })

    this.detectarCambios();
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  // TRANSFERIR 
  transferir() {
    this.logger.log(this.postTransferir)
    this.logger.log("Data acreditar", this.postTransferir)
  }

}
