import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private route: { clientId: number; orderId: number; surtidorId: number; customerId: 1 };
  private subject: Subject<MessageEvent>;

  constructor() {
    this.route = JSON.parse(sessionStorage.getItem('route'));
    const ws = new WebSocket('ws://localhost:3000');
    ws.addEventListener('message', e => {
      console.log(e);
    });
    ws.addEventListener('open', e => {
      const msg = {
        route: this.route,
        payload: {}
      };
      ws.send(JSON.stringify(msg));
    });
  }
}
