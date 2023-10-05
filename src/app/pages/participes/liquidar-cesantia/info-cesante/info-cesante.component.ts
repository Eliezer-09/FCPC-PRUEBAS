import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Participe } from '../../models/models-participes';
import { ParticipesService } from '../../participes.service';
//Iconos
import icDescription from '@iconify/icons-ic/twotone-description';
import icSearch from '@iconify/icons-ic/twotone-search';
import icEmail from '@iconify/icons-ic/email';
import icAssignment from '@iconify/icons-ic/assignment-ind';
import icPhone from '@iconify/icons-ic/phone';
import icLocationCity from '@iconify/icons-ic/location-city';
import icPerson from '@iconify/icons-ic/person';
import icCreditCard from '@iconify/icons-ic/credit-card';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFavorite from '@iconify/icons-ic/twotone-favorite';
import icComment from '@iconify/icons-ic/twotone-comment';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icKeyboardArrowRight from '@iconify/icons-ic/twotone-keyboard-arrow-right';
import icCheck from '@iconify/icons-ic/sharp-check';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentesService } from 'src/app/services/componentes.service';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-info-cesante',
  templateUrl: './info-cesante.component.html',
  styleUrls: ['./info-cesante.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class InfoCesanteComponent implements OnInit {
  //Iconos
  icSearch = icSearch;
  icDescription = icDescription;
  icEmail =  icEmail;
  icPhone = icPhone;
  icAssignment = icAssignment;
  icLocationCity = icLocationCity
  icPerson = icPerson
  icCreditCard = icCreditCard
  icAdd = icAdd;
  icFavorite = icFavorite;
  icComment = icComment;
  icAttachFile = icAttachFile;
  icKeyboardArrowRight = icKeyboardArrowRight;
  icCheck = icCheck;
  @Input() participe: Participe;
  documento;


  constructor(private participeService: ParticipesService, 
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private componentesService: ComponentesService) { }

  ngOnInit(): void {
  }

  colorCalificacion(){
    var color = "grey";
    if(this.participe && this.participe?.calificacionCredito){
      var categoria = this.participe?.calificacionCredito.substring(0,1);
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

  descargarPDF() {
    this.spinner.show();
    this.dataService.getCuentaIndividual(this.participe.idParticipe).subscribe(result=>{
      this.documento = URL.createObjectURL(result);
      this.spinner.hide()
      window.open(this.documento, '_blank');
    },error => {
      this.componentesService.alerta("error", "Ocurrio un error al descargar la cuenta individual")
      this.spinner.hide()
    });
  }

}
