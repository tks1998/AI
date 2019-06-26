import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'log-results',
    templateUrl: '../client/app/component_analysis/logresults.html',
    styleUrls: ['../client/app/component_analysis/logresults.css'],
})


export class logResultsComponent implements OnInit{
    ngOnInit(): void {
    }

    public log_red;
    public log_black;
    
    display(log_red,log_black) {
        console.log("R:", log_red);
        console.log("B:", log_black);
        this.log_red = log_red;
        this.log_black = log_black;
    }
}