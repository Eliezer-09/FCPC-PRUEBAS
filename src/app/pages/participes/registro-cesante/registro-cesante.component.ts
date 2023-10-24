import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { Participe } from 'src/app/model/models';
import { DataService } from 'src/app/services/data.service';
import { CesantesService } from '../cesantes.service';
import { stagger80ms } from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { TipoCesante } from '../models/tipo-censante.interface';
import { ComponentesService } from 'src/app/services/componentes.service';

@Component({
  selector: 'vex-registro-cesante',
  templateUrl: './registro-cesante.component.html',
  styleUrls: ['./registro-cesante.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class RegistroCesanteComponent implements OnInit {

  icDoneAll = icDoneAll;
  participe: Participe;
  stepActualizar: FormGroup;
  stepDatos: FormGroup;
  tiposCesantes: TipoCesante[] = [];
  idParticipe: number;
  estado: string;
  esRegistro = true;
  selectedIndex: number = 0;

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private cesanteService: CesantesService,
    private componentService: ComponentesService
  ) { }

  ngOnInit(): void {
    this.cargarTiposCesantes();
  }

  getIdParticipe(event) {
    this.idParticipe = event;
  } 

  getEstado(event) {
    this.estado = event;
  }

  cargarTiposCesantes() {
    this.cesanteService.getTiposCesantes().subscribe((res: any) => {
      this.tiposCesantes = res;
    }, response => {
      this.componentService.alerta("error", response.error.message)
    })
  }

  setIndex(event) {
    this.selectedIndex = event.selectedIndex;
  }

}
