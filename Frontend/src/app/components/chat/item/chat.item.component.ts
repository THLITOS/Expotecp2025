import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timeAgo: string;
  avatarUrl: string;
  messages?: Message[];
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.item.component.html',
  styleUrls: ['./chat.item.component.css']
})
export class ChatItemComponent {
  // Propiedad que permite obtener el chat desde el componente SideChatComponent
  @Input() chat!: Chat;
  // Marca una propiedad que emite eventos (EventEmitter) hacia el componente SideChatComponent
  @Output() chatSelected = new EventEmitter<Chat>();

  constructor() { }

  onChatSelected(): void {
    this.chatSelected.emit(this.chat);
  }
}