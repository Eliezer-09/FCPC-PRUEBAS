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
  selector: 'vex-ingresos-colaborador',
  templateUrl: './ingresos-colaborador.component.html',
  styleUrls: ['./ingresos-colaborador.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class IngresosColaboradorComponent implements OnInit {
  icroundCalendarToday = iconify.icroundCalendarToday;
  icroundMonetizationOn=iconify.icroundMonetizationOn
  icroundPercent =iconify.icroundPercent;
  icbaselineAttachMoney = iconify.icbaselineAttachMoney;
  constructor( private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
       private tthhColaboradorService: TTHHColaboradorService) { }


  templateDiasIngreso = [
    { label: "Días trabajados", value: "diasTrabajo" ,icon:this.icroundCalendarToday},
    { label: "Días vacaciones", value: "diasVacaciones",icon:this.icroundCalendarToday },
    { label: "Días subsidio", value: "diasSubsidio" ,icon:this.icroundCalendarToday},
    { label: "Días décimo cuarto mensual", value: "diasdecimocuarto",icon:this.icroundCalendarToday },
    { label: "Días décimo tercero mensual", value: "diastercero" ,icon:this.icroundCalendarToday},
    { label: "Días fondo reserva", value: "diasFondoReserva" ,icon:this.icroundCalendarToday},
  ];

  saldos={
    diasTrabajo:100,
    diasVacaciones:50,
    diasSubsidio:12,
    diasdecimocuarto:10,
    diastercero:70,
    diasFondoReserva:45
  }

  
  templateIngreso = [
    { label: "Sueldo Mes", value: "sueldoMes" ,icon:this.icbaselineAttachMoney},
    { label: "Sueldo Vacaciones", value: "sueldoVacaciones",icon:this.icbaselineAttachMoney },
    { label: "Subsidio Enfermedad 100%", value: "subsidioEnfermedad100" ,icon:this.icroundPercent},
    { label: "Subsidio Enfermedad 25%", value: "subsidioEnfermedad25",icon:this.icroundPercent },
    { label: "Horas Extras 50%", value: "horasExtras50" ,icon:this.icroundPercent},
    { label: "Horas Extras 100%", value: "horasExtra100" ,icon:this.icroundPercent},
    { label: "Décimo Cuarto Mensual", value: "decimoCuartoMensual" ,icon:this.icbaselineAttachMoney},
    { label: "Décimo Tercero Mensual", value: "decimoTerceroMensual" ,icon:this.icbaselineAttachMoney},
  ];

  ingresos={
    sueldoMes:100,
    sueldoVacaciones:50,
    subsidioEnfermedad100:12,
    subsidioEnfermedad25:10,
    horasExtras50:70,
    horasExtra100:45,
    decimoCuartoMensual:40,
    decimoTerceroMensual:20
  }


  datosPersonales: FormGroup = this._formBuilder.group({
    idTipoIdentificacion: [],
    identificacion: [],
    nombres:[],
    apellidos: [],
    fechaNacimiento: [],
    lugarNacimiento: [],
    idNacionalidad: [],
    idGenero: [],
    idEstadoCivil:[],
    correo1: [],
    celular: [],
    telefono1: [],
    operadoraMovil: [],
    idActividadEconomica: [],
  });


  ngOnInit(): void {
 
  }





}
