import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Http} from '@angular/http';
@Component({
    selector: 'app',
    templateUrl: '../client/app/component_main/app.component.main.html',
    styleUrls: ['../client/app/component_main//app.component.main.css']
})


export class AppComponent implements OnInit {
    logined = false;
    options: any;
    reverse = false; // check chinachess ? reverse chinachess
    any_state : any;
    selectedFile :File=null;
    

    constructor(private http:Http){}
    ngOnInit() {
    }

    chinachess: FormControl = new FormControl();
    flag : FormControl = new FormControl();
    selectOpponent(v) {
        // console.log(v);
    }
    // update analysis results
    onFileSelected($event){
        this.selectedFile =<File>$event.target.files[0];
    }
    onUpload(){
    }
     myFunction() {
        var x = document.getElementById("demo");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
}
