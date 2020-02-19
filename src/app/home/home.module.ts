import { NgModule } from '@angular/core';
import { routing } from './home.routing';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [routing,CommonModule],
    declarations: [HomeComponent]
})
export class HomeModule { }