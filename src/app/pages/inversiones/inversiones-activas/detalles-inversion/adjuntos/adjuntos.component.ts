import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { iconify } from 'src/static-data/icons';
import { InversionesService } from '../../../inversiones.service';

@Component({
  selector: 'vex-adjuntos',
  templateUrl: './adjuntos.component.html',
  styleUrls: ['./adjuntos.component.scss']
})
export class AdjuntosComponent implements OnInit, AfterViewChecked {

  constructor(
    private detectChanges: ChangeDetectorRef,
    private dataService: InversionesService,
    private sanitizer: DomSanitizer,
  ) { }

  @Input() idInversion: any;
  documento;
  infoMessage = "No se ha encontrado el Documento";
  icroundAttachFile  = iconify.icroundAttachFile;

  ngOnInit(): void {
    this.dataService.getAdjuntoByIdInversion(this.idInversion).subscribe( res => {
      this.documento = res["changingThisBreaksApplicationSecurity"];
      this.setHtmlInversion(this.documento);
    })
  }

  ngAfterViewChecked(): void {
    this.detectChanges.detectChanges();
  }

  public innerHtmlInversion: SafeHtml;
  public setHtmlInversion(pdfurl: string) {
    this.innerHtmlInversion = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

}
