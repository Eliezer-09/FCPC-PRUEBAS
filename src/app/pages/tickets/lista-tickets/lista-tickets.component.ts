import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs/operators';
import { TicketsService } from '../tickets.service';
import { iconfa}   from 'src/static-data/icons';
@Component({
  selector: 'vex-lista-tickets',
  templateUrl: './lista-tickets.component.html',
  styleUrls: ['./lista-tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListaTicketsComponent implements OnInit {
  layoutCtrl = new FormControl("boxed");
  menuOpen = false;
  files:TreeNode[] = [];
  data;
  categoria = "Pendiente";
  faTicketAlt =iconfa.faTicketAlt;
  constructor(
    private _ticketsService: TicketsService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
  }

  isActive(category: any['id']) {
  }

  verTicket(event) {

  }

  setData(data: any) {
    this.categoria = "";
    this.changeDetector.detectChanges();

    this.categoria = data;
    this.changeDetector.detectChanges();
    // this._ticketsService
    //     .getTicketsInternosByTermino(this.categoria, "Estado")
    //     .pipe(
    //       map((userData: any) => {
    //         console.log(userData["result"]);
    //       })).subscribe(res => {
    //         this.data = res["result"];
    //         console.log("Data", this.data);
    //       });
    // this.datosIniciales(1,10,data);
  }
}
