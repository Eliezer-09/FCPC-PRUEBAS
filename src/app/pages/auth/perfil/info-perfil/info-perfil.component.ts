import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
import icImage from '@iconify/icons-ic/image';
import icCell from '@iconify/icons-ic/round-settings-cell';

import icKeyboardArrowRight from '@iconify/icons-ic/twotone-keyboard-arrow-right';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { Participe } from 'src/app/model/models';
import { DataService } from 'src/app/services/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'vex-info-perfil',
  templateUrl: './info-perfil.component.html',
  styleUrls: ['./info-perfil.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class InfoPerfilComponent implements OnInit {

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
  icCell = icCell;


  @Input() dataFuncionario?: Participe;

  icImage = icImage
  fotoPerfil;
  adjunto: any;

  constructor(
    private authService: AuthService, 
    private changeDetector: ChangeDetectorRef, 
    private spinner: NgxSpinnerService,
    private logger: NGXLogger,
    private dataService: DataService,
    ) { }

  ngOnInit(): void {
    this.fotoFuncionario()
  }

  actualizarFoto(event){
    this.spinner.show()
    this.adjunto = event.target.files.item(0);
    this.logger.log(this.adjunto)
    this.dataService.getBase64(this.adjunto).then( (res:any) => {
      this.logger.log(res)
      const body = {
        "Foto": res
      }
      this.authService.actualizarFotoFuncionario(body).subscribe( ress => {
        location.reload()
        this.spinner.hide();
      }, error => {
        this.logger.log(error)
      })
      this.spinner.hide();
      this.changeDetector.detectChanges()
    })
  }

  fotoFuncionario(){
    this.authService.getFotoFuncionario().subscribe(res=>{
      this.fotoPerfil = res
      this.changeDetector.detectChanges()
    })
  }

}
