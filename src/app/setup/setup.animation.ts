import { animate, style, transition, trigger } from '@angular/animations';

export const setupTransition = trigger('setupTransition', [
  transition(':leave', [
    animate('200ms', style({ opacity: 0 }))
  ])
]);
