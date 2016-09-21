import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jup-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  @Input() result: number = 0;

  constructor() { }

  ngOnInit() {
  }

  login() {
    alert('it worked!');
  }
}
