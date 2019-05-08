import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSemanticModule } from "ng-semantic";
import { AppComponent } from './component_main/app.component.main';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BoardComponent } from './component_board/board';
//import { WinRaterComponent } from './component_analysis/winRate';
import { WeightTableComponent } from './component_analysis/weights';
import { RuntimeAnalysist } from './component_analysis/runtimeAnalysist';
//import { MapToIterable} from '@angular/core/';
import { ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
    imports: [
        BrowserModule,
        NgSemanticModule,
        HttpClientModule,
        ChartsModule
    ],

    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        BoardComponent,
   //     MapToIterable,
    //    WinRaterComponent,
        RuntimeAnalysist,
        WeightTableComponent
    ]
})
export class AppModule { }
