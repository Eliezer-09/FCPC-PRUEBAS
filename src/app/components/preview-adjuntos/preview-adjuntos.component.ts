import { Component, Input, OnInit} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-adjuntos',
  templateUrl: './preview-adjuntos.component.html',
  styleUrls: ['./preview-adjuntos.component.scss']
})
export class PreviewAdjuntosComponent implements OnInit  {
  @Input() documentUrl: string;
  @Input() extension: string;
  isImage = false;
  isPdf = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.detectDocumentType();
  }


  detectDocumentType(): void {
    const documentUrl = this.documentUrl.toLowerCase();
    // Detectar si el documento es una imagen (por extensión de archivo)
    console.log(documentUrl)
    console.log(this.extension)
    console.log(this.extension.match(/(jpeg|jpg|gif|png|bmp)$/))
    if (this.extension.match(/(jpeg|jpg|gif|png|bmp)$/)) {
      this.isImage = true;
      this.isPdf = false;
    }
    // Detectar si el documento es un PDF (por extensión de archivo)
    else if (this.extension.match(/(pdf)$/)) {
      this.isPdf = true;
      this.isImage = false;
      this.setInnerHtmlRol(this.documentUrl);
    }
    // Si el tipo de documento no se reconoce, no mostrar nada.
    else {
      this.isImage = false;
      this.isPdf = false;
    }
  }

  public innerHtml: SafeHtml;
  public setInnerHtmlRol(pdfurl: string) {
    this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
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
