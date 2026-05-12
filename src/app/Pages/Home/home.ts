import { Component } from '@angular/core';
import { Header } from '../../Components/PageComponents/HomeComponents/header/header';
import { Skilaxy } from '../../Components/PageComponents/HomeComponents/skilaxy/skilaxy';
import { Skills } from '../../Components/PageComponents/HomeComponents/skills/skills';



@Component({
  selector: 'app-home',
  imports: [Header, Skills, Skilaxy],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
