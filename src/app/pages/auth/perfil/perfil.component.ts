import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { Participe } from 'src/app/model/models';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'vex-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class PerfilComponent implements OnInit {
  idUsuario: string;
  funcionario: Participe;
  constructor(private authService: AuthService, private changeDetector: ChangeDetectorRef,private logger: NGXLogger) { }

  ngOnInit(){
    this.authService.getPerfilFuncionario().subscribe(res=> {
      this.funcionario = res;
      this.changeDetector.detectChanges();
      this.logger.log(this.funcionario)
    })
  }



}
