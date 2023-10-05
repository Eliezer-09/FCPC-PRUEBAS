import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'vex-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {

  items = this.navigationService.items;

  constructor(private navigationService: NavigationService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item.currentValue != changes.item.previousValue) {
    }
  }

  ngOnInit() {
  }
}
