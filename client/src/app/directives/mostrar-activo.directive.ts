import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

@Directive({ selector: '[mostrarActivo]' })
export class MostrarActivoDirective implements OnInit {
  @Input('mostrarActivo') set isActive(value: boolean) {
    this.viewContainer.clear();
    if (value) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  ngOnInit() {}
}
