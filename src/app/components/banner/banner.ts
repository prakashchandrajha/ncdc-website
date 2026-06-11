import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-banner',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit, OnDestroy {
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