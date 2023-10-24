import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ColaboradorPersona } from 'src/app/pages/colaboradores/models/colaboradores';
import { TTHHColaboradorService } from 'src/app/pages/colaboradores/services/tthh-colaborador.service';
import { UtilsService } from 'src/app/pages/colaboradores/utils/utils.service';
import { iconify } from 'src/static-data/icons';
@Component({
  selector: 'vex-datos-colaborador',
  templateUrl: './datos-colaborador.component.html',
  styleUrls: ['./datos-colaborador.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class DatosColaboradorComponent implements OnInit {
  icroundPerson=iconify.icroundPerson;
  icroundCalendarToday = iconify.icroundCalendarToday;
  constructor( private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
       private tthhColaboradorService: TTHHColaboradorService) { }

  tiposJornada: any[] = [];
  modalidadesTrabajo: any[] = [];
  datosPersonales: FormGroup = this._formBuilder.group({
    identificacion: [],
    nombres:[],
    apellidos: [],
    correoEmpresa: [],
    idEntidad: [],
    idColaborador: [],
    codigoBiometrico:[],
    fechaInicioContrato:[],
    idTipoJornada:[],
    tipoJornada:[],
    sueldoNominal:[],
    valorAnticipo:[],
    idModalidad: [],
    modalidad:[],
    porcentajeAnticipo: [],
  });


  templateDatos = [
    { label: "Fecha Ingreso Empresa", value: "fechaInicioContrato" ,type:'date'},
    { label: "Sueldo Nominal", value: "sueldoNominal",type:'decimal' },
    { label: "Anticipo", value: "valorAnticipo",type:'decimal' },
    { label: "Porcentaje Anticipo", value: "porcentajeAnticipo",type:'porcent' },
    { label: "Modalidad", value: "modalidad" },
    { label: "Tipo de Jornada", value: "tipoJornada" },
    { label: "Código Biometrico", value: "codigoBiometrico" },
    { label: "Correo Electrónico", value: "correoEmpresa"}
  ];


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
     this.buscarEntidad(params["id"])
     
    });
    this.cargarSelects();
  }
  
  filterContrato(data){
    console.log(data)
    let modalidadesTrabajo =  this.modalidadesTrabajo.filter(
      (x) => x.id == data.idModalidad
    );
    let tiposJornada =  this.tiposJornada.filter(
      (x) => x.id == data.idTipoJornada
    );
    this.datosPersonales.controls['modalidad'].setValue(modalidadesTrabajo[0].descripcion)
    this.datosPersonales.controls['tipoJornada'].setValue(tiposJornada[0].descripcion)
  }

  buscarEntidad(identificacion){
    this.tthhColaboradorService
      .getDatosPersonales(identificacion)
      .subscribe(
        (data) => {
          let colaborador: ColaboradorPersona = data.result;
          if (data.result) {
  
            this.datosPersonales.patchValue({
              idEntidad: colaborador.idEntidad,
              nombres: this.utilsService.capitalize(colaborador.nombres),
              apellidos: this.utilsService.capitalize(colaborador.apellidos),
              identificacion: colaborador.identificacion,
            });

           this.obtenerInformacionColaborador(colaborador.idEntidad);
        
          }

       
        },
        (error) => {
          
          this.utilsService.alerta(
            "error",
            "Error al obtener los datos de la persona"
          );
        }
      );
  }
   
  obtenerInformacionColaborador(idEntidad) {

    this.tthhColaboradorService.loadColaboradorId(idEntidad).subscribe(
      (data) => {
        if (data["result"].length>0) {
        const colaborador=data["result"][0]
        this.datosPersonales.patchValue({
          idColaborador: colaborador.idColaborador,
          correoEmpresa: colaborador.correoEmpresa,
          codigoBiometrico:colaborador.codigoBiometrico
        });
        this.obtenerDatosContrato(colaborador.idColaborador);
      }
      })
    }


  obtenerDatosContrato(idColaborador) {
    this.tthhColaboradorService.getDatosContrato(idColaborador).subscribe(
      (data) => {
        if (data.result) {

          const colaborador=data["result"]
          this.datosPersonales.patchValue({
            fechaInicioContrato: colaborador.fechaInicioContrato == "0001-01-01T00:00:00"?null:colaborador.fechaInicioContrato,
            sueldoNominal: colaborador.sueldoNominal,
            impuestos: colaborador.impuestos ? colaborador.impuestos : 0,
            valorAnticipo: colaborador.valorAnticipo,
            porcentajeAnticipo: colaborador.porcentajeAnticipo,
            idTipoContrato:colaborador.idTipoContrato
          });

         this.filterContrato({idModalidad: colaborador.idModalidad,
        idTipoJornada:colaborador.idTipoJornada})
        } 
      },

      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al obtener datos del contrato"
        );
      }
    );
  }

  cargarSelects() {

    this.tthhColaboradorService.getTipoJornada().subscribe(
      (data) => {
        this.tiposJornada = data.result;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al obtener tipos de jornada");
      }
    );

    this.tthhColaboradorService.getModalidad().subscribe(
      (data) => {
        this.modalidadesTrabajo = data.result;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al obtener modalidades de trabajo"
        );
      }
    );

  }

}
