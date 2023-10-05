import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconify } from 'src/static-data/icons';

@Component({
  selector: 'vex-modal-validacion-solicitud',
  templateUrl: './modal-validacion-solicitud.component.html',
  styleUrls: ['./modal-validacion-solicitud.component.scss']
})
export class ModalValidacionSolicitudComponent implements OnInit {
  displayedColumns: string[] = ['result', 'description'];
  icroundClose = iconify.icroundClose;

  dataGarantes;
  validaciones;
  contador = 0;

  aprobado = true;
  idProducto: number;
  validation={
    valido:false,
    garante:false
  }

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalValidacionSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentService: ComponentesService,
  ) { }

  ngOnInit() {
    this.validaciones = this.data["data"];
    this.idProducto = this.data["idProducto"]
    this.validaciones.forEach((item:any) => {
      if (item ) {
      if ( !item["valido"]) {
        this.aprobado = false
        return;
      } }
    });

  }

  cerrar() {
    this.dialogRef.close();
  }
  
  validar(){
    this.validation.valido=this.aprobado;
    if( !this.aprobado ){
      this.componentService.alerta("warning", "Debes cumplir todos los requerimientos.");
    }
    this.dialogRef.close(this.validation);
  }

  agregarGarante(item) {
    if(this.idProducto != 7 && item.descripcion == 'Debe contar con saldo disponible en su cuenta individual' && item.valido == false){
      this.validation.garante=true;
      return true;
    }

  }
}
