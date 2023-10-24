import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment, { Moment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { ComponentesService } from 'src/app/services/componentes.service';
import { CesantesService } from '../../cesantes.service';
import { TipoCesante } from '../../models/tipo-censante.interface';

@Component({
  selector: 'vex-datos-cesante',
  templateUrl: './datos-cesante.component.html',
  styleUrls: ['./datos-cesante.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatosCesanteComponent implements OnInit {

  @Input() tiposCesantes: TipoCesante[] = [];
  @Input() idParticipe: number;
  cesanteFormGroup: FormGroup;
  esFallecido: boolean = false;

  motivosTerminacion = []

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private cesanteService: CesantesService,
    private componentesService: ComponentesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formGroup()
    if (this.esFallecido) {
      this.motivosTerminacion = ["Voluntaria", "Fallecimiento", "Pasivo", "Baja", "Jubilacion"]
    } else {
      this.motivosTerminacion = ["Voluntaria", "Pasivo", "Baja", "Jubilacion"]
    }
  }

  formGroup() {
    this.cesanteFormGroup = this.fb.group({
      idEntidad: [''],
      fechaSalida: ['', Validators.required],
      fechaFallecimiento: [''],
      motivoSalida: ['', Validators.required],
      motivoTerminacion: ['', Validators.required],
      comentarios: ['', Validators.required]
    });
  }

  seleccionarTipoCesante(event) {
    if (event) {
      this.cesanteFormGroup.patchValue({
        motivoTerminacion: "Fallecimiento"
      })
      this.cesanteFormGroup.controls['motivoTerminacion'].disable();
    } else {
      this.esFallecido = false
      this.cesanteFormGroup.controls['motivoTerminacion'].enable();
    }
  }

  currentDate = new Date();
  myDateFilter = (d: Date | null): boolean => {
    const diaActual = (d || new Date());
    return diaActual <= this.currentDate;
  }

  guardar() {
    this.spinner.show()
    this.cesanteFormGroup.patchValue({
      idEntidad: this.idParticipe,
      aplicaDesgravamen: this.esFallecido ? true : false
    })
    if (this.esFallecido) {
      this.cesanteFormGroup.patchValue({
        fechaFallecimiento: this.cesanteFormGroup.value.fechaSalida,
      })
      this.registrarCesante()
    } else {
      this.cesanteFormGroup.patchValue({
        fechaFallecimiento: null
      })
      this.registrarCesante()
    }
  }

  registrarCesante() {
    this.cesanteService.postRegistrarCesante(this.cesanteFormGroup.value).subscribe(cesante => {
      this.spinner.hide()
      this.componentesService.alerta("success", "Se ha registrado el Cesante").then(res => {
        if (res.isConfirmed) {
          this.router.navigateByUrl(`tickets/detalle-ticket/${cesante.idTicket}`)
        }
      })
    }, response => {
      this.spinner.hide()
      this.componentesService.alerta("error", response.error.message)
    })
  }

}
