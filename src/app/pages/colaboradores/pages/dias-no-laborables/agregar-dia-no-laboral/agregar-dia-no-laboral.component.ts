import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { VacacionesConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';

@Component({
  selector: 'vex-agregar-dia-no-laboral',
  templateUrl: './agregar-dia-no-laboral.component.html',
  styleUrls: ['./agregar-dia-no-laboral.component.scss'],
})

export class AgregarDiaNoLaboralComponent implements OnInit {
  form = this.fb.group({
    idFestivo: [''],
    descripcion: ['',Validators.required],
    fechaDesde: ['', Validators.required],
    fechaHasta: ['', Validators.required],
 });

  tableColumns: TableColumn<any>[] = VacacionesConfigure

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarDiaNoLaboralComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.data) {
      const { idFestivo, fechaDesde, fechaHasta, descripcion } = this.data.data;
      this.form.patchValue({
        idFestivo: idFestivo,
        descripcion: descripcion,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
      });
    } else {
      const fechaDefault = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
      this.form.patchValue({
        fechaDesde: fechaDefault,
        fechaHasta: fechaDefault
      });
    }
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarFormulario(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      console.log('Formulario no válido');
    }
  }
  
}
