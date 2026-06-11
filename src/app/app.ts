import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Banner } from "./components/banner/banner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Banner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
    protected readonly title = signal('ncdc-website');

  images = [
    'images/1.png',
    'images/2.jpg',
    'images/3.jpg',
  ];

  currentIndex = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentIndex.update(
        index => (index + 1) % this.images.length
      );
    }, 3000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  next() {
    this.currentIndex.update(
      index => (index + 1) % this.images.length
    );
  }

  prev() {
    this.currentIndex.update(
      index => (index - 1 + this.images.length) % this.images.length
    );
  }
}