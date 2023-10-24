import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-agregar-vacaciones',
  templateUrl: './agregar-vacaciones.component.html',
  styleUrls: ['./agregar-vacaciones.component.scss']
})
export class AgregarVacacionesComponent implements OnInit {
  form = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaFinal: ['', [Validators.required]],
    duracion: [{value: '', disabled: true}],
    periodo: ['', Validators.required],
    observacionesVacaciones: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form.get('fechaInicio').valueChanges.subscribe(val => {
      this.calcularDuracion();
    });
    this.form.get('fechaFinal').valueChanges.subscribe(val => {
      this.calcularDuracion();
    });
    this.form.patchValue(this.data.data);
    console.log(this.data.data)
    console.log(this.form)
    this.form.controls.fechaFinal.setValue(new Date(this.data.data.fechaFinal));
    this.form.controls.fechaInicio.setValue(new Date(this.data.data.fechaInicio));
  }

  calcularDuracion() {
    const fechaInicio = new Date(this.form.get('fechaInicio').value);
    const fechaFinal = new Date(this.form.get('fechaFinal').value);
  
    if (fechaInicio && fechaFinal) {
      const diff = Math.abs(fechaFinal.getTime() - fechaInicio.getTime());
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

      this.form.get('duracion').setValue(diffDays + ' días');
  
      if (fechaFinal < fechaInicio || diffDays < 6) {
        this.form.get('fechaFinal').setErrors({ 'invalid': true });
      }
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
