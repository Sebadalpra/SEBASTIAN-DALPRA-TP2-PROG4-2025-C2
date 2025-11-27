import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[resaltarAdmin]' })
export class ResaltarAdminDirective implements OnInit {
    @Input('resaltarAdmin') esAdmin!: boolean
    constructor(private el: ElementRef) {}

    ngOnInit() {
        if (this.esAdmin) {
            this.el.nativeElement.style.fontWeight = 'bold';
            this.el.nativeElement.style.color = '#d9534f'; // color rojo para admin
        }
    }
}
