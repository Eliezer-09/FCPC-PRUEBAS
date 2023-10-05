import { Component, OnInit } from '@angular/core';
// ICONOS
import icArchive from '@iconify/icons-ic/archive';
import icCreditCard from '@iconify/icons-ic/credit-card';
import icPerson from '@iconify/icons-ic/person';
import icDashboard from '@iconify/icons-ic/dashboard';
import { NavigationDropdown, NavigationLink } from 'src/@vex/interfaces/navigation-item.interface';
import { DataService } from '../services/data.service';
import { NavigationService } from 'src/@vex/services/navigation.service';
@Component({
  selector: 'vex-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  accesos = []; 

  constructor(private dataService: DataService,               
    private navigationService: NavigationService,
    ) {  

    }


  
  ngOnInit(): void {
    
  }


}
