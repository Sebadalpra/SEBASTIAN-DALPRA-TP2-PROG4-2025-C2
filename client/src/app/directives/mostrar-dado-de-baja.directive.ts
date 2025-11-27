import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[mostrarDadoDeBaja]'
})
export class MostrarDadoDeBajaDirective implements OnInit, OnChanges {
  @Input('mostrarDadoDeBaja') estaDadoDeBaja: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.aplicarEstilo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estaDadoDeBaja']) {
      this.aplicarEstilo();
    }
  }

  private aplicarEstilo() {
    if (this.estaDadoDeBaja) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
    }
  }
}
