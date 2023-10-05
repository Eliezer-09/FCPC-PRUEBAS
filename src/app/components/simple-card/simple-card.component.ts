import {Component, Input, Output, EventEmitter} from '@angular/core';
@Component(
    {selector: 'vex-simple-card', templateUrl: './simple-card.component.html', styleUrls: ['./simple-card.component.scss']}
)
export class SimpleCardComponent<T> {
    radius: number;
    color: string;
    centered = false;
    @Output() openComponent = new EventEmitter<T>();
    @Input()simpleCard = {
        idCard:'', 
        name:'',
        description:'',
        innerHTML: '',
        data: '',
    }

    constructor() {}

}
