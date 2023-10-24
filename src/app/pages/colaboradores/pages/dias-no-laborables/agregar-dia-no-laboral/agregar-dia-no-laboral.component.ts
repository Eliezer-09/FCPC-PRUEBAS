import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from '../../../utils/utils.service';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { VacacionesConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
@Component({
  selector: 'vex-agregar-dia-no-laboral',
  templateUrl: './agregar-dia-no-laboral.component.html',
  styleUrls: ['./agregar-dia-no-laboral.component.scss'],
})
export class AgregarDiaNoLaboralComponent implements OnInit {

  form = this.fb.group({
    nombre: ['',Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
 });
  tableColumns: TableColumn<any>[] = VacacionesConfigure
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarDiaNoLaboralComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilService: UtilsService
  ) { }

  ngOnInit(): void {
    this.data.data.action = "Agregar";
    if (this.data && this.data.data) {
      const { start, end, nombre } = this.data.data;
      const fechaInicioDate = new Date(start);
      const fechaFinalDate =  new Date(end)
      this.form.patchValue({
        nombre: nombre,
        start: fechaInicioDate,
        end: fechaFinalDate
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarFormulario(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      this.utilService.alerta('success', 'Dia no laborable enviado correctamente.');
    } else {
      console.log('Formulario no válido');
    }
  }

}
