import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Banner } from "./components/banner/banner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Banner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}