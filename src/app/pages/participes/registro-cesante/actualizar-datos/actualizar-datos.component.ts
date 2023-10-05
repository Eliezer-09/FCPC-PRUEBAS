import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Direccion, Participe } from 'src/app/model/models';
import { ComponentesService } from 'src/app/services/componentes.service';
import { DataService } from 'src/app/services/data.service';
import moment from 'moment';

@Component({
  selector: 'vex-actualizar-datos',
  templateUrl: './actualizar-datos.component.html',
  styleUrls: ['./actualizar-datos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ActualizarDatosComponent implements OnInit {

  date = moment().format("MMM Do YY");

  formCesanteActualizar: FormGroup;
  tiposDireccion = [
    "Casa", "Trabajo", "Otro"
  ];

  @Input() esRegistro: boolean;
  @Output() emitirParticipe = new EventEmitter<number>();
  @Output() emitirEstado = new EventEmitter<string>();

  participe: Participe;
  searchCtrl = new FormControl();
  ciudades: any = []
  parroquias: any[] = []
  generos: any[] = []
  estadosCivil: any[] = []
  grados: any[] = [];
  existeCedula = false;
  sinInformacion = "N/A"
  buscar: string
  direccion: Direccion = {};
  provincias: any = [];
  profesiones: any = [];

  constructor(private fb: FormBuilder,
    private dataService: DataService,
    private componentesService: ComponentesService,
    private matStepper: MatStepper,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadProfesion();
    this.formCesanteActualizar = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarNacimiento: [''],
      idNacionalidad: [''],
      nacionalidad: [''],
      idGenero: ['', Validators.required],
      idEstadoCivil: ['', Validators.required],
      idNivelEstudios: [''],
      fechaExpedicionCedula: ['', Validators.required],
      correo1: ['', Validators.required],
      correo2: [''],
      telefono1: ['', Validators.required],
      telefono2: [''],
      celular: ['', Validators.required],
      idNivelIngresos: [''],
      idActividadEconomica: [null],
      idGrado: ['', Validators.required],
      identificacionConyuge: [''],
      conyuge: [''],
      idTipoVivienda: [''],
      tiempoResidencia: [0],
      foto: [''],
      aporteAdicional: [''],
      fechaIngreso: [''],
      codigoUniformado: [''],
      referenciasBancarias: [''],
      comentarios: [''],
      perfilEconomico: [''],
      contactos: [[]],
      direcciones: [[]],
      direccion: [''],
      calleprincipal:[''],
      referencia:[''],
      referenciasPersonales: [[]],
      idProfesion: ['']
    });

  }

  buscarParticipe() {
    this.spinner.show();
    if (this.buscar) {
      if (this.buscar.length == 10) {
        this.dataService.getParticipeByIdentificacion(this.buscar).subscribe(async (res: any) => {
          this.participe = res.result
          if (this.participe.estado != "Cesado") {
            if (!this.esRegistro) {
              this.componentesService.alerta("info", "La persona debe ser un Cesante para continuar").then((res: any) => {
                if (res.isConfirmed) {
                  this.existeCedula = false
                }
              })
            }
          } else {
            // this.existeCedula = true;
          }
          this.emitirParticipe.emit(this.participe.idParticipe)
          this.emitirEstado.emit(this.participe.estado)
          this.formCesanteActualizar.patchValue({
            nombres: this.participe.nombres,
            apellidos: this.participe.apellidos,
            fechaNacimiento: this.participe.fechaNacimiento,
            lugarNacimiento: this.participe.lugarNacimiento,
            idNacionalidad: this.participe.idNacionalidad,
            idGenero: this.participe.idGenero,
            idEstadoCivil: this.participe.idEstadoCivil,
            idNivelEstudios: this.participe.idNivelEstudios,
            fechaExpedicionCedula: this.participe.fechaExpedicionCedula,
            correo1: this.participe.correo1,
            correo2: this.participe.correo2,
            telefono1: this.participe.telefono1,
            telefono2: this.participe.telefono2,
            celular: this.participe.celular,
            idNivelIngresos: this.participe.idNivelIngresos,
            idActividadEconomica: null,
            idProfesion: this.participe.idProfesion,
            idGrado: this.participe.idGrado,
            identificacionConyuge: this.participe.identificacionConyuge,
            conyuge: this.participe.conyuge,
            idTipoVivienda: this.participe.idTipoVivienda,
            tiempoResidencia: 0,
            foto: this.participe.foto,
            aporteAdicional: this.participe.aporteAdicional,
            fechaIngreso: this.participe.fechaIngreso,
            codigoUniformado: this.participe.codigoUniformado,
            referenciasBancarias: this.participe.referenciasBancarias,
            comentarios: "",
            perfilEconomico: this.participe.perfilEconomico,
            contactos: this.participe.contactos,
            direcciones: this.participe.direcciones,
            referenciasPersonales: this.participe.referenciasPersonales
          })
          const FORMATO_ENTRADA = 'YYYY-MM-DD';
          const fechaNacimientoFormato = moment(this.participe.fechaNacimiento, FORMATO_ENTRADA);
          const fechaExpedicionFormato = moment(this.participe.fechaExpedicionCedula, FORMATO_ENTRADA);
          this.participe.fechaNacimiento = fechaNacimientoFormato.format(FORMATO_ENTRADA);
          this.participe.fechaExpedicionCedula = fechaExpedicionFormato.format(FORMATO_ENTRADA);

          await this.cargarEstadosCivil();
          await this.cargarGrados();
          await this.cargarGeneros();

          if (this.participe.direcciones[0]) {
            this.direccion = this.participe.direcciones[0];
            this.participe.direcciones[0] = this.direccion;
            this.dataProvinciaCiudad(this.direccion.idProvincia,this.direccion.idPais);
          }

          this.spinner.hide();
          this.existeCedula = true;
        }, response => {
          this.spinner.hide();
          this.componentesService.alerta("error", response.error.message)
        })
      } else {
        this.spinner.hide();
        this.componentesService.alerta("info", "El límite es de 10 caracteres")
      }
    } else {
      this.componentesService.alerta("info", "Debes escribir una cédula")
    }
  }

  dataProvinciaCiudad(idProvincia, idPais) {
    // PROVINCIAS DEL ECUADOR
    this.dataService.getProvincias(idPais).subscribe( prov => {
      this.provincias = prov;
    });

    // ciudades
    this.dataService.getCiudades(idProvincia).subscribe( cuidad => {
      this.ciudades = cuidad;
    });
  }

  cargarGrados() {
    this.spinner.show();
    this.dataService.getGrado().subscribe((res: any) => {
      this.grados = res;
      this.spinner.hide();
    }, response => {
      this.spinner.hide();
      this.componentesService.alerta("error", response.error.message)
    })
  }

  cargarEstadosCivil() {
    this.spinner.show();
    this.dataService.getEstadosCivil().subscribe((res: any) => {
      this.estadosCivil = res;
      this.spinner.hide();
    }, response => {
      this.spinner.hide();
      this.componentesService.alerta("error", response.error.message)
    })
  }

  cargarGeneros() {
    this.spinner.show();
    this.dataService.getTiposGenero().subscribe((res: any) => {
      this.generos = res;
      this.spinner.hide();
    }, response => {
      this.spinner.hide();
      this.componentesService.alerta("error", response.error.message)
    })
  }

  loadProfesion(){
    this.dataService.getProfesiones().subscribe(profesion => {
      this.profesiones = profesion;
    });
  }

  actualizar() {
    this.spinner.show("Actualizando datos")
    this.dataService.actualizarParticipeDatos(this.participe.idParticipe, this.formCesanteActualizar.value).subscribe(res => {
      this.spinner.hide()
      this.componentesService.alerta("success", "Se han actualizado los datos").then(res=>{
        if(res.isConfirmed){
          this.matStepper.next();
        }
      })
    }, response => {
      this.spinner.hide()
      this.componentesService.alerta("error", response.error.message)
    })
  }

}
