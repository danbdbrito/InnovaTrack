import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { StorageService } from 'src/app/storageS.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {}

  async ionViewDidEnter()  {
    this.checkSession()
  }

  async checkSession() {
    const sessionStatus = await this.storageService.get('isSessionActive')
    if (sessionStatus) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['/login'])
    }
  }
}
