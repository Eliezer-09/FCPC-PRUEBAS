import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import icVerticalSplit from '@iconify/icons-ic/twotone-vertical-split';
import icVisiblity from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icDescription from '@iconify/icons-ic/twotone-description';

import { stagger80ms } from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { Identificacion, PutSolicitud } from '../../../model/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../../services/data.service';
import { ComponentesService } from '../../../services/componentes.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'vex-participe-correo-actualizar',
  templateUrl: './participe-correo-actualizar.component.html',
  styleUrls: ['./participe-correo-actualizar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ParticipeCorreoActualizarComponent implements OnInit {


  participe: Identificacion = {};
  actualizarDatos: PutSolicitud = {}; 

  // ICONOS
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;

  // FORMGROUP
  datosFormGroup: FormGroup;


  horizontalDatosFormGroup: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dataComponente: ComponentesService
  ) { }

  ngOnInit(): void {

    this.formsGroups();
  
  }

  // INICIALIZACION DE LOS FORMS GROUPS CON SUS CAMPOS
  formsGroups() {
    // DATOS DE CONTACTO
    this.datosFormGroup = this.fb.group({
      identificacion: [''],
      cedula: [''],
      nombres: [''],
      apellidos: [''],
      correo1: [''],
    });
  } 

  traerAlParticipe(identificacion) {
    if(identificacion) {
      if (identificacion.length == 10) {
        this.spinner.show()
        this.dataService.getParticipeByIdentificacion(identificacion).subscribe(res=>{
          this.spinner.hide();
          this.participe = res["result"]
          // MAPEO DE DATOS
          this.actualizarDatos.nombres = this.participe.nombres
          this.actualizarDatos.apellidos = this.participe.apellidos
          this.actualizarDatos.correo1 = this.participe.correo1

        }, (error) => {
          this.spinner.hide()
          this.dataComponente.alerta("error","Ocurrio un error en la busqueda del participe");
        })
      } else {
      }
    } else {

    }
  }

  actualizarCorreo() {
    this.spinner.show();
    const data = {
      cedula: this.participe.identificacion,
      correo: this.actualizarDatos.correo1
    }
    this.authService.actualizarCorreoTemporal(data).subscribe( res => {
      this.spinner.hide();
      this.dataComponente.alerta("success", "Se a actualizado el correo exitosamente!")
    }, (error) => {
      this.spinner.hide();
      this.dataComponente.alerta("error", "El usuario no se encuentra adherido al fondo o ocurrió un error al actualizar.")
    })
  }

}
