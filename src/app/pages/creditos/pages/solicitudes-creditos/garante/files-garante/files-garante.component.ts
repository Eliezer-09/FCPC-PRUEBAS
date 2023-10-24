import { Component,  Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TiposAdjunto } from 'src/@vex/interfaces/enums';
import { AdjuntosGenerales, AdjuntosList, DataSave } from 'src/app/components/adjuntos-general/ajuntos-general';
import { Identificacion } from 'src/app/model/models';
@Component({
  selector: 'vex-files-garante',
  templateUrl: './files-garante.component.html',
  styleUrls: ['./files-garante.component.scss'],
})
export class FilesGaranteComponent implements OnInit {
  @Input() participe: Identificacion = {};
  adjuntosGenerales: AdjuntosGenerales = {
    nombreSeccion: "",
    adjuntosList: [],
  };

  adjuntoGarante = this.fb.group({
    adjuntoFrontal: ["",[Validators.required]],
    adjuntoPosterior: ["",[Validators.required]],
    adjuntoRol:["",[Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
  ) { 

  }

  ngOnInit(): void {
  this.cargarAdjuntos()
  }
  clearFrom(){
    this.adjuntoGarante.controls["adjuntoFrontal"].setValue(null)
    this.adjuntoGarante.controls["adjuntoPosterior"].setValue(null)
    this.adjuntoGarante.controls["adjuntoRol"].setValue(null)
  }

  cargarAdjuntos() {
    const dataSaveList: DataSave[] = [
      {
        tipoAdjunto: TiposAdjunto.cedulaFrontal,
        observaciones: "Cédula frontal del Garante",
      },
      {
        tipoAdjunto: TiposAdjunto.cedulaPosterior,
        observaciones: "Cédula posterior del Garante",
      },
      {
        tipoAdjunto: TiposAdjunto.rolGarante,
        observaciones: "Rol del Garante",
      },
    ];

    const adjuntosList: AdjuntosList[] = dataSaveList.map((dataSave) => ({
      dataSave,
      nombreAdjunto: dataSave.observaciones,
      esRequerido: true,
      multiple: false,
      visualizationMode: false,
      idTipoAdjunto: dataSave.tipoAdjunto,
      adjuntos:[]
    }));
    this.adjuntosGenerales = {
      nombreSeccion: null,
      adjuntosList,
    };
  }

  adjuntosGarante(adjuntoResponse){
    let idTipoAdjunto=adjuntoResponse.idTipoAdjunto

    if(idTipoAdjunto==TiposAdjunto.cedulaFrontal){
      this.adjuntoGarante.controls["adjuntoFrontal"].setValue(adjuntoResponse.data)
    }
    if(idTipoAdjunto==TiposAdjunto.cedulaPosterior){
      this.adjuntoGarante.controls["adjuntoPosterior"].setValue(adjuntoResponse.data)
    }
    if(idTipoAdjunto==TiposAdjunto.rolGarante){
      this.adjuntoGarante.controls["adjuntoRol"].setValue(adjuntoResponse.data)
    }

  }

}
