import { Component, inject, OnInit } from '@angular/core';
import { Clobe } from "../../Components/PageComponents/PlaygroundComponents/animated Elements/clobe/clobe";
import { UserUpload } from "../../Components/PageComponents/PlaygroundComponents/user-upload/user-upload";
import { CodeUploader } from "../../Components/PageComponents/PlaygroundComponents/code-uploader/code-uploader";
import { PlaygroundServ, UserCode } from '../../Services/playground-serv/playground-serv';
import { AsyncPipe } from '@angular/common';
import { Gear } from "../../Components/PageComponents/PlaygroundComponents/animated Elements/gear/gear";


@Component({
  selector: 'app-playground',
  imports: [Clobe, UserUpload, CodeUploader, AsyncPipe, Gear],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
})
export class Playground implements OnInit {
private playgroundService = inject(PlaygroundServ);

  allCode$ = this.playgroundService.allCode$;

  ngOnInit() {
    this.playgroundService.load();
  }

  uploadCode(code: UserCode) {
    this.playgroundService.upload(code).subscribe();
  }
}
