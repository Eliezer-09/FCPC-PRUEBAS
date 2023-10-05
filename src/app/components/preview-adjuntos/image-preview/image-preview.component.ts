import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements AfterViewInit {
  @Input() imageUrl: string;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.adjustImageSize();
  }

  adjustImageSize(event?: Event): void {
    const container = this.elementRef.nativeElement.querySelector('.image-preview-container');
    const img = container.querySelector('img');

    if (img) {
      const maxWidth = window.innerWidth * 0.8; // Ajusta el tamaño de la imagen al 80% del ancho de la ventana
      const maxHeight = window.innerHeight * 0.8; // Ajusta el tamaño de la imagen al 80% de la altura de la ventana

      if (img.width > maxWidth) {
        img.width = maxWidth;
        img.style.height = 'auto';
      }

      if (img.height > maxHeight) {
        img.height = maxHeight;
        img.style.width = 'auto';
      }
    }
  }
}
