import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-referred-104-workarea',
  templateUrl: './referred-104-workarea.component.html',
  styleUrls: ['./referred-104-workarea.component.css']
})
export class Referred104WorkareaComponent implements OnInit {
  @ViewChild("sidenav")
  sidenav: any;

  constructor() { }

  ngOnInit() {

    
  }

  sideNavModeChange(sidenav) {
    let deviceHeight = window.screen.height;
    let deviceWidth = window.screen.width;
    if (deviceWidth < 700) sidenav.mode = "over";
    else sidenav.mode = "side";
    sidenav.toggle();
  }


}
