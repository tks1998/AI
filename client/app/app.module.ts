import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSemanticModule } from "ng-semantic";
import { AppComponent } from './component_main/app.component.main';
import { HttpModule } from '@angular/http';
import { BoardComponent } from './component_board/board';
import { MapToIterable } from './pipe/MapToIterable';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { WinRaterComponent } from './component_analysis/winRate';
import { logResultsComponent } from './component_analysis/logresults';



@NgModule({
    imports: [
        BrowserModule,
        NgSemanticModule,
        HttpModule,
        FormsModule,
        ChartsModule
    ],

    bootstrap: [
        AppComponent
    ],

    declarations: [
        AppComponent,
        BoardComponent,
        MapToIterable,
        WinRaterComponent,
        logResultsComponent
    ]
})
export class AppModule { }
