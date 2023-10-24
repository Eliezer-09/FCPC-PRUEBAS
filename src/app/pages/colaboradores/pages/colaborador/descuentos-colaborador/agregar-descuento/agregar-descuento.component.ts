import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-agregar-descuento',
  templateUrl: './agregar-descuento.component.html',
  styleUrls: ['./agregar-descuento.component.scss']
})
export class AgregarDescuentoComponent implements OnInit {
  tipo: string[] = ['Salario', 'Prestación', 'Otros'];
  utilsService: any;
  form = this.fb.group({
    
    tipo: ['', Validators.required],
    valor: ['', Validators.required, Validators.min(0)],
    fechaRegistro: ['', Validators.required],
    observacio: ['']
    
 });
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgregarDescuentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.form.controls.fechaRegistro.setValue(new Date(this.data.data.fechaRegistro));
    this.form.patchValue(this.data.data);
    console.log(this.form.value)
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  enviarFormulario(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      this.utilsService.alerta('success', 'Descuento enviado correctamente.');
    } else {
      console.log('Formulario no válido');
    }
  }
}
