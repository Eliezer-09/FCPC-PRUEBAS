import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as signalR from '@microsoft/signalr';  
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { DataService } from '../../services/data.service';
import { TicketsService } from '../tickets/tickets.service';
import { ApiServiceUrl, ApiUrl } from 'src/app/Shared/Routes/ApiServiceUrl';

@Component({
  selector: 'vex-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit {


  turnosPendientes;
  turnosEnProcesos;
  participes;
  apiUrl= environment.serviceUrl;
  constructor(
    private dataService: DataService, 
    private logger: NGXLogger,
    private changeDetectorRefs: ChangeDetectorRef,
    private ticketService: TicketsService) { 
    
  }

  ngOnInit() {

    this.actualizarDatos();

    const connection = new signalR.HubConnectionBuilder()  
        // .configureLogging(signalR.LogLevel.Information) 

        .withUrl(ApiUrl.tickets + '/hub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          logger: this.logger,
        })  
        .build();  

      connection.start().then(function () {  
      }).catch(function (err) {  
        return console.error("SignalR Error:", err.toString());  
      });  

      connection.on("ActualizarTickets", () => {  
        this.actualizarDatos();  
        this.reproducir();
      });  
  }

  detectarCambios(){
    this.changeDetectorRefs.detectChanges();
  }

  actualizarDatos(){
    // Llenar con los datos que se requieren
    this.ticketService.getTicketsByEstado("Pendiente").subscribe( turno => {
      this.logger.log(turno);
      this.turnosPendientes = turno["result"];

    });

    this.ticketService.getTicketsByEstado("Enproceso").subscribe( turno => {
      this.logger.log(turno);
      this.turnosEnProcesos = turno["result"];
    });
  }

  reproducir() {
    const audio = new Audio('assets/song/mario-coin.mp3');
    audio.play();
  }

  esoTilin() {
    const audio = new Audio('assets/song/esotilin.mp3');
    audio.play();
  }

  aLaMierdaTilin() {
    const audio = new Audio('assets/song/alamierdatilin.mp3');
    audio.play();
  }

}
