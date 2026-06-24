import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

interface Brand {
  name: string;
  logoUrl: string;
  link: string;
}

@Component({
  selector: 'app-first-cards',
  imports: [CommonModule],
  templateUrl: './first-cards.html',
  styleUrl: './first-cards.css',
})
export class FirstCards implements OnInit, OnDestroy {
  brands: Brand[] = [
    {
      name: 'Heineken',
      logoUrl: 'https://lqrs.com/site/assets/files/62390/heineken-logo.320x0.png',
      link: 'https://lqrs.com/brands/heineken/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Heineken'
    },
    {
      name: 'Budweiser',
      logoUrl: 'https://lqrs.com/site/assets/files/62391/budweiser-logo.320x0.png',
      link: 'https://lqrs.com/brands/budweiser/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Budweiser'
    },
    {
      name: 'Carlsberg',
      logoUrl: 'https://lqrs.com/site/assets/files/15605/carlsberg-logo.320x0.png',
      link: 'https://lqrs.com/brands/carlsberg/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Carlsberg'
    },
    {
      name: 'Stella Artois',
      logoUrl: 'https://lqrs.com/site/assets/files/62394/stella-artois-logo.320x0.png',
      link: 'https://lqrs.com/brands/stella-artois/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Stella+Artois'
    },
    {
      name: 'Corona Extra',
      logoUrl: 'https://lqrs.com/site/assets/files/62392/corona-extra-logo.320x0.png',
      link: 'https://lqrs.com/brands/corona-extra/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Corona+Extra'
    },
    {
      name: 'Guinness',
      logoUrl: 'https://lqrs.com/site/assets/files/62393/guinness-logo.320x0.png',
      link: 'https://lqrs.com/brands/guinness/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Guinness'
    },
    {
      name: 'Hoegaarden',
      logoUrl: 'https://lqrs.com/site/assets/files/62395/hoegaarden-logo.32x0.png',
      link: 'https://lqrs.com/brands/hoegaarden/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Hoegaarden'
    },
    {
      name: 'Beck\'s',
      logoUrl: 'https://lqrs.com/site/assets/files/62396/becks-logo.32x0.png',
      link: 'https://lqrs.com/brands/becks/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Becks'
    },
    {
      name: 'Peroni',
      logoUrl: 'https://lqrs.com/site/assets/files/62397/peroni-logo.32x0.png',
      link: 'https://lqrs.com/brands/peroni/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Peroni'
    },
    {
      name: 'Pilsner Urquell',
      logoUrl: 'https://lqrs.com/site/assets/files/62398/pilsner-urquell-logo.32x0.png',
      link: 'https://lqrs.com/brands/pilsner-urquell/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Pilsner+Urquell'
    },
    {
      name: 'Tiger Beer',
      logoUrl: 'https://lqrs.com/site/assets/files/62399/tiger-beer-logo.32x0.png',
      link: 'https://lqrs.com/brands/tiger-beer/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Tiger+Beer'
    },
    {
      name: 'Modelo Especial',
      logoUrl: 'https://lqrs.com/site/assets/files/62400/modelo-especial-logo.32x0.png',
      link: 'https://lqrs.com/brands/modelo-especial/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Modelo+Especial'
    },
    {
      name: 'Pacifico',
      logoUrl: 'https://lqrs.com/site/assets/files/62401/pacifico-logo.32x0.png',
      link: 'https://lqrs.com/brands/pacifico/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Pacifico'
    },
    {
      name: 'Amstel',
      logoUrl: 'https://lqrs.com/site/assets/files/62402/amstel-logo.32x0.png',
      link: 'https://lqrs.com/brands/amstel/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Amstel'
    },
    {
      name: 'Birra Moretti',
      logoUrl: 'https://lqrs.com/site/assets/files/62403/birra-moretti-logo.32x0.png',
      link: 'https://lqrs.com/brands/birra-moretti/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Birra+Moretti'
    },
    {
      name: 'Leffe',
      logoUrl: 'https://lqrs.com/site/assets/files/62404/leffe-logo.32x0.png',
      link: 'https://lqrs.com/brands/leffe/?utm_source=q&utm_medium=cpc&utm_campaign=brand&utm_term=Leffe'
    }
  ];

  currentIndex = 0;
  visibleCount = 4;
  cardWidthPx = 140;
  gapPx = 12;
  autoplayInterval = 3000;
  private autoplayTimer: any;
  isPaused = false;

  private get maxIndex(): number {
    return Math.max(0, this.brands.length - this.visibleCount);
  }

  get trackOffsetPx(): number {
    return this.currentIndex * (this.cardWidthPx + this.gapPx);
  }

  get canPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.brands.length / this.visibleCount));
  }

  get currentPage(): number {
    return Math.min(this.currentIndex + 1, this.totalPages);
  }

  ngOnInit(): void {
    this.updateVisibleCount();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateVisibleCount();
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  updateVisibleCount(): void {
    const width = window.innerWidth;
    if (width < 640) this.visibleCount = 1;
    else if (width < 768) this.visibleCount = 2;
    else if (width < 1024) this.visibleCount = 3;
    else this.visibleCount = 4;
  }

  prev(): void {
    if (this.canPrev) {
      this.currentIndex -= 1;
      this.resetAutoplay();
    }
  }

  next(): void {
    if (this.canNext) {
      this.currentIndex += 1;
      this.resetAutoplay();
    } else {
      this.currentIndex = 0;
      this.resetAutoplay();
    }
  }

  goTo(index: number): void {
    this.currentIndex = Math.min(index, this.maxIndex);
    this.resetAutoplay();
  }

  pause(): void {
    this.isPaused = true;
    this.stopAutoplay();
  }

  resume(): void {
    this.isPaused = false;
    this.startAutoplay();
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.autoplayInterval);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
