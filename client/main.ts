import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app.component';
import { provide } from '@angular/core';

enableProdMode();
bootstrap(AppComponent, [provide(Window, {useValue: window})]);
