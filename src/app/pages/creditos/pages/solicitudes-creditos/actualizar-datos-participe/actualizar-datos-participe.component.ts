import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iconify } from 'src/static-data/icons';
import { Participe } from '../../../../participes/models/models-participes';
import { AdjuntosGenerales, AdjuntosList, DataSave } from 'src/app/components/adjuntos-general/ajuntos-general';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';

@Component({
  selector: 'vex-actualizar-datos-participe',
  templateUrl: './actualizar-datos-participe.component.html',
  styleUrls: ['./actualizar-datos-participe.component.scss'],
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class ActualizarDatosParticipeComponent implements OnInit {

  icroundClose = iconify.icroundClose;
  Tab1 = "Datos del partícipe";
  Tab2 = "Adjuntos del partícipe";
  Tab3 = "Perfil económico";
  Tab4 = "Datos Bancarios";
  participe: Participe = {};


  adjuntosGenerales: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };
  constructor(    public dialogRef: MatDialogRef<ActualizarDatosParticipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {  this.participe=this.data["participe"] }

  ngOnInit(): void {
  this.cargarAdjuntos()
  }


  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  cargarAdjuntos() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: 1,
        observaciones: "Cédula frontal",
      },
      {
        tipoAdjunto: 2,
        observaciones: "Cédula posterior",
      },
      {
        tipoAdjunto: 8,
        observaciones: "Contrato",
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: false,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
    }));
    this.adjuntosGenerales = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

/*   verificarActualizacion(){
    this.dialogRef.close(true);
  } */
}
