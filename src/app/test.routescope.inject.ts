
import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';

@Component({
  selector: 'test',
  providers: [],
  template: `bla`
})
export class InjectionTestComponent implements OnInit { 

  private rootScope: any
  private user: any

  constructor(private injector: Injector) {

  }

  ngOnInit() {

    this.rootScope = this.injector.get('$rootScope');
  }

}
