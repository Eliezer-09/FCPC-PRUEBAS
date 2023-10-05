import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import icMail from '@iconify/icons-ic/twotone-mail';
import ickey from '@iconify/icons-ic/vpn-key';

import { NgxSpinnerService } from 'ngx-spinner';
import { PasswordStrengthValidator } from '../../participes/participe-correo-actualizar/password-strenght';
import { DataService } from 'src/app/services/data.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss'],
  animations: [fadeInUp400ms]
})
export class CambiarClaveComponent implements OnInit {

  ickey = ickey
  datosFormGroupClave: FormGroup;
  clave
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private dataComponente: ComponentesService
  ) { }

  ngOnInit() {
    // FORMULARIO PARA ACTUALIZAR CLAVE
    this.datosFormGroupClave = this.fb.group({
      password: ['', Validators.compose([
        Validators.required, Validators.minLength(8), PasswordStrengthValidator])]
    });
  }

  actualizarClave(){
    this.spinner.show();
    const data = {
      clave: this.clave
    }
    this.authService.actualizarClave(data).subscribe( res => {
      this.spinner.hide();
      this.dataComponente.alerta("success", res["message"])
      this.authService.logout();
    }, (error) => {
      this.spinner.hide();
      this.dataComponente.alerta("error", "Ocurrió un error al actualizar la clave")
    })
  }
}
