import { Component, Input, Output, EventEmitter, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../services/feed.service';

interface Message {
  id: string;
  text: string;
  timestamp: string; 
  isMine: boolean; 
  imageUrl?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timeAgo: string;
  avatarUrl: string;
  messages?: Message[];
}

@Component({
  selector: 'app-chat-conversacion',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass], 
  templateUrl:'./chat.conversacion.component.html',
  styleUrls: ['./chat.conversacion.component.css']
})
export class ChatConversacionComponent implements AfterViewChecked {
  @Input() selectedChat!: Chat;
  @Output() messageSent = new EventEmitter<string>();
  currentUser = localStorage.getItem('idUsuario') || "anonimo";

  newMessageText: string = '';

  @ViewChild('messagesScroll') private messagesScrollContainer!: ElementRef;

  constructor(private feedService: FeedService) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesScrollContainer.nativeElement.scrollTop = this.messagesScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      //
    }
  }

  sendMessage(): void {
    if (this.newMessageText.trim()) {
      const data = { "remitente": this.currentUser, "contenido": this.newMessageText.trim()}
      this.feedService.sendMessage(this.selectedChat.id, data).subscribe();
      this.messageSent.emit(this.newMessageText.trim()); 
      this.newMessageText = ''; 
    }
  }
}