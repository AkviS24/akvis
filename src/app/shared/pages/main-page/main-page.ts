import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { WhyMe } from "../../components/why-me/why-me";
import { Skills } from '../../components/skills/skills';
import { Projects }from '../../components/projects/projects';

@Component({
  selector: 'app-main-page',
  imports: [Hero, WhyMe, Skills, Projects],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
