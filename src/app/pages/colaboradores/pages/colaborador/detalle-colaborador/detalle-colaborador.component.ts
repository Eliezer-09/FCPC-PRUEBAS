import { Component, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Identificacion } from 'src/app/model/models';
import { iconify } from 'src/static-data/icons';
import icMoney from "@iconify/icons-ic/monetization-on";
@Component({
  selector: 'vex-detalle-colaborador',
  templateUrl: './detalle-colaborador.component.html',
  styleUrls: ['./detalle-colaborador.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class DetalleColaboradorComponent implements OnInit {
  icbaselineAttachMoney = iconify.icbaselineAttachMoney;
  icroundCalendarToday = iconify.icroundCalendarToday;
  icroundPercent =iconify.icroundPercent;
  icroundPerson=iconify.icroundPerson;
  icroundCurrencyRuble=iconify.icroundCurrencyRuble;

  icroundMonetizationOn=iconify.icroundMonetizationOn
  icroundShopify =iconify.icroundShopify 
  icroundBeachAccess=iconify.icroundBeachAccess
  participe: Identificacion = {nombres:"Isaac Emmanuel", apellidos:"Caicedo Galan", identificacion:'09050540104'};
  constructor() { }
  icMoney = icMoney;
  seccion = "";
  dataCreditos?: any[];

  valuesCard={
    ingresos:500.2,
    egresos:360.5,
    vacaciones:100.3,
    descuentos:30.40,
    rubros:90
  }
  activeItem = {
    ingresos: true,
    egresos: false,
    vacaciones: false,
    descuentos: false,
  };
  items = [
    {
      id: "ingresos",
      icon: this.icroundMonetizationOn,
      label: "Ingresos",
    },
    {
      id: "egresos",
      icon: this.icroundShopify,
      label: "egresos",
    },
    {
      id: "vacaciones",
      icon: this.icroundBeachAccess,
      label: "Vacaciones",
    },
    {
      id: "descuentos",
      icon: this.icroundPercent,
      label: "Descuentos",
    },
  ];

  templateDatos = [
    { label: "guayaquil", value: "guayaquil" ,icon:this.icroundCalendarToday},
    { label: "Sueldo Fijo", value: "sueldoFijo",icon:this.icroundCalendarToday },
    { label: "Fecha Ingreso Empresa", value: "fechaIngresoEmpresa" ,icon:this.icroundCalendarToday},
    { label: "Ciudad", value: "ciudad",icon:this.icroundCalendarToday },
    { label: "Tipo de Jornada", value: "tipoJornada" ,icon:this.icroundCalendarToday},
    { label: "Correo Electrónico", value: "correoElectronico" ,icon:this.icroundCalendarToday}
  ];

  datos={
    guayaquil:'Analista Contable',
    sueldoFijo:500,
    fechaIngresoEmpresa:'01/03/2020',
    ciudad:'Guayaquil',
    tipoJornada:'Completa',
    correoElectronico:'abc@fcpc-cte'
  }

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


  ngOnInit(): void {
  }

  cambiarSeccion(event) {
    this.seccion = event;
    if (event == "vencido") {
     /*  this.apiParticipe
        .getPrestamosVencidosByParticcipe(this.dataParticipe["idParticipe"])
        .subscribe(
          (res: any) => {
            this.mostrarValoresVencidos = true;
            this.logger.log("Préstamos Vencidos", res["result"]);
            this.prestamosVencidos = res["result"];
          },
          (err) => {
            this.logger.log("Error Valores Vencidos", err);
            this.mostrarValoresVencidos = false;
          }
        ); */
    }
  }

}
