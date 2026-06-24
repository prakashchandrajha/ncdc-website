import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Banner } from "./components/banner/banner";
import { FirstCards } from "./components/home/first-cards/first-cards";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Banner, FirstCards],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}