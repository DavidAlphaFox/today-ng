import { trigger, style, animate, transition, query, group } from '@angular/animations';


export const mainPageSwitchTransition = trigger('mainPageSwitchTransition', [
  transition(':enter',
    query('nz-layout.container', [
      style({ opacity: 0, transform: 'scale3d(0.95, 0.95, 0)' }),
      animate('200ms 200ms')
    ])
  ),
  transition(':leave', [
    query('nz-layout.container', [
      animate('200ms', style({ opacity: 0, transform: 'scale3d(0.95, 0.95, 0)' }))
    ])
  ])
]);
