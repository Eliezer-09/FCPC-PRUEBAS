import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vex-view-adjuntos',
  templateUrl: './view-adjuntos.component.html',
  styleUrls: ['./view-adjuntos.component.scss']
})
export class ViewAdjuntosComponent implements OnInit {


  url: string;
  @ViewChild('documentFrame') documentFrame: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {

  }


  loadDocument(type:string,adjunto: any) {
/*     this.url = url;
    const securyUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.url) */
/*     console.log(securyUrl) */
    if(type=="blob"){
      adjunto = URL.createObjectURL(adjunto);
      window.open(adjunto)
    }
    if(type=="url") window.open(adjunto)
 /*    window.open(securyUrl["changingThisBreaksApplicationSecurity"]); */
  }
  
/* 
  public getInnerHtmlDocumento(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<object data='${this.data} ` +
      `#toolbar=0&navpanes=0' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>` +
      `Object  ${this.data} failed` +
      "</object>"
    );

  } */

}
