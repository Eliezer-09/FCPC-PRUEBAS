import { Component, OnInit} from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Identificacion } from 'src/app/model/models';
import { iconify } from 'src/static-data/icons';
import icMoney from "@iconify/icons-ic/monetization-on";
import { MatDialog } from '@angular/material/dialog';

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
 
  icroundPercent =iconify.icroundPercent;
  icroundPerson=iconify.icroundPerson;
  icroundCurrencyRuble=iconify.icroundCurrencyRuble;

  icroundMonetizationOn=iconify.icroundMonetizationOn
  icroundShopify =iconify.icroundShopify 
  icroundBeachAccess=iconify.icroundBeachAccess
  participe: Identificacion = {nombres:"Isaac Emmanuel", apellidos:"Caicedo Galan", identificacion:'09050540104'};
  constructor(public dialog: MatDialog) { }
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



  ngOnInit(): void {
 
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  handleClick(seccion: string, elementId: string): void {
    this.cambiarSeccion(seccion);
    setTimeout(() => {
      this.scrollToElement(elementId);
    }, 10); // Ajusta el tiempo según sea necesario
  }
  
  

  cambiarSeccion(event) {
    console.log(event)
    this.seccion = event;
    if (event == "vencido") {
    }
  }

}
