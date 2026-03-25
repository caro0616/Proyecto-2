import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-odontobot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odontobot.component.html',
  styleUrl: './odontobot.component.scss'
})
export class OdontobotComponent {
  open = signal(false);
  bubbleVisible = signal(true);

  toggle() { this.open.update(v => !v); this.bubbleVisible.set(false); }
  closeBubble() { this.bubbleVisible.set(false); }
}
