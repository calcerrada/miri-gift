import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { concatMap, delay, interval, map, of, takeWhile } from 'rxjs';
import { ICON_NAMES } from './models/icons-names';
import confetti from 'canvas-confetti';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentIconPath = 'images/regalo.png';
  finishGiftIconPath = 'images/autocaravana.png';
  init = false;
  finish = false;
  private iconNames = ICON_NAMES;

  private randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private celebrate() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  getSurprise() {
    if (this.init) {
      return;
    }
    this.init = true;
    let currentValue: string = this.iconNames[0];

    // Controlador de tiempo dinámico
    const timing$ = interval(100).pipe(
      map((tick) => {
        if (tick < 10) return 100;
        else if (tick < 30) return 100;
        else if (tick < 35) return 150;
        else if (tick < 36) return 200;
        else if (tick < 37) return 300;
        else if (tick < 38) return 400;
        else return -1; // Detener
      }),
      takeWhile((time) => time !== -1)
    );

    timing$
      .pipe(
        concatMap(
          (time, index) => of(index).pipe(delay(time)) // Cambiar icono tras un retraso dinámico
        ),
        map((tick) => this.iconNames[tick % this.iconNames.length]) // Ciclar por los iconos
      )
      .subscribe({
        next: (icon) => {
          this.currentIconPath = `images/${icon}.png`;
        },
        complete: () => {
          currentValue = this.iconNames[0];
          this.currentIconPath = `images/${currentValue}.png`;
          this.finish = true;
          this.celebrate();
        },
      });
  }
}
