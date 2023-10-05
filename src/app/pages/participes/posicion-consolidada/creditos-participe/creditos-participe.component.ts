import { Component, OnInit, Input } from '@angular/core';
import { Participe } from '../../../../model/models';


import icAdd from '@iconify/icons-ic/twotone-add';
import icClose from '@iconify/icons-ic/twotone-close';
import icStar from '@iconify/icons-ic/twotone-star';
import icStarBorder from '@iconify/icons-ic/twotone-star-border';
import icNotifications from '@iconify/icons-ic/twotone-notifications';
import icInsertComment from '@iconify/icons-ic/twotone-insert-comment';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import { stagger80ms } from '../../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'vex-creditos-participe',
  templateUrl: './creditos-participe.component.html',
  styleUrls: ['./creditos-participe.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms
  ]
})
export class CreditosParticipeComponent implements OnInit {
  
  estados = [
    {
      estado: "Pendiente"
    },
    {
      estado: "Aprobado"
    },
    {
      estado: "Legalizado"
    },
    {
      estado: "Transferido"
    },
    {
      estado: "Pagado"
    },
    {
      estado: "Rechazado"
    },
  ]

  icNotifications = icNotifications;
  icInsertComment = icInsertComment;
  icAttachFile = icAttachFile;
  icAdd = icAdd;
  icClose = icClose;
  icStar = icStar;
  icStarBorder = icStarBorder;

  @Input() dataParticipe?: Participe;
  @Input() dataCreditos?: any;

  diferenciaFecha;

  colorCalificacionPrestamo(calificacion){
    var color = "grey";
    if(calificacion){
      var categoria = calificacion.substring(0, 1);

      if(categoria == "A"){
        color="green";
      }
      else if(categoria == "B"){
        color="blue";
      }
      else if(categoria == "C"){
        color="orange";
      }
      else if(categoria == "D"){
        color= "pink";
      }
      else if(categoria == "E"){
        color= "red";
      }
    }
    return color;
  }

  constructor(
    private router: Router,
    private logger: NGXLogger
  ) { }

  ngOnInit() {

  }

  detallePrestamo(idPrestamo, estado) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/creditos/detalle/${this.dataParticipe.idParticipe}/${idPrestamo}/${estado}`])
    );
    window.open(url, '_blank');
  }

  drop(event) {

  }

}
