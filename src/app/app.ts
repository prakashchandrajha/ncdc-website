import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCalendarAlt,
  faCoins,
  faFileSignature,
  faHandsHelping,
  faLandmark,
  faPercent,
  faProjectDiagram,
  faWater,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Header } from "./components/header/header";
import { Banner } from "./components/banner/banner";
import { FirstCards } from "./components/home/first-cards/first-cards";

interface ProfileItem {
  name: string;
  icon: IconDefinition;
  pos: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Banner, FirstCards, FaIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Replace these with the names + Font Awesome icons you want around the circle.
  // `pos` keeps each item's absolute position on the ring.
  profileItems: ProfileItem[] = [
    { name: 'Loan Application', icon: faFileSignature, pos: 'left-[45px] -top-[4px]' },
    { name: 'Finance & Financing', icon: faCoins, pos: 'right-[45px] -top-[4px]' },
    { name: 'Activities Assisted', icon: faHandsHelping, pos: '-left-4 top-20' },
    { name: 'Pattern of Assistance', icon: faProjectDiagram, pos: '-right-4 top-20' },
    { name: 'Programme 2024-25', icon: faCalendarAlt, pos: 'bottom-8 -left-0' },
    { name: 'Rate (Fixed)', icon: faPercent, pos: 'bottom-8 -right-0' },
    { name: 'Rate (Floating)', icon: faWater, pos: 'right-[40%] -bottom-4' },
  ];

  centerBrand = { name: 'NCDC', icon: faLandmark };
}
