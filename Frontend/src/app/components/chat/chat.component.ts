import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ChatItemComponent } from './item/chat.item.component'; 
import { ChatConversacionComponent } from './conversacion/chat.conversacion.component';
import { FeedService } from '../services/feed.service';
import { ChatModalComponent } from './modal/chat.modal.component';

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
  selector: 'app-side-chat-panel',
  standalone: true,
  imports: [CommonModule, ChatItemComponent, ChatConversacionComponent, ChatModalComponent, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class SideChatPanelComponent implements AfterViewChecked, OnInit, OnDestroy {
  @Input() chatOpen: boolean = false;
  @Output() closeChat = new EventEmitter<void>();

  selectedChat: Chat | null = null;
  currentUser = localStorage.getItem('idUsuario') || "anonimo";
  showNewChatModal: boolean = false;

  imagedummy = 'https://static.vecteezy.com/system/resources/previews/013/446/485/non_2x/colored-design-icon-of-user-chat-vector.jpg';

  chats: Chat[] = [];
  filteredChats: Chat[] = [];

  @ViewChild('messagesScroll') private messagesScrollContainer!: ElementRef;

  private messageUpdateIntervalId: any;

  searchTerm: string = '';

  constructor(private feedService: FeedService) {
  }

  ngOnInit() {
    this.loadMessages();
    this.messageUpdateIntervalId = setInterval(() => {
      this.loadMessages();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.messageUpdateIntervalId);
  }

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

  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredChats = [...this.chats];
      return;
    }

    const lowerCaseSearchTerm = this.searchTerm.trim().toLowerCase();
    this.filteredChats = this.chats.filter(chat =>
      chat.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  trackByChatId(index: number, chat: any): string {
    return chat.id;
  }

  closeChatPanel(): void {
    this.closeChat.emit();
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
  }

  goBackToChatList(): void {
    this.selectedChat = null;
  }

  addNewMessage(messageText: string): void {
    if (this.selectedChat && messageText.trim()) {
      const newMessage: Message = {
        id: `m${Date.now()}`,
        text: messageText.trim(),
        timestamp: new Date().toLocaleString(),
        isMine: true
      };

      if (!this.selectedChat.messages) {
        this.selectedChat.messages = [];
      }
      this.selectedChat.messages.push(newMessage);
      this.selectedChat.lastMessage = messageText.trim();
    }
  }

  private loadMessages(): void {

    this.feedService.getChats(this.currentUser).subscribe((data: any) => {
      this.chats = data.chats;
      this.applyFilter();
      if (this.selectedChat) {
        const chat = this.chats.find(c => c.id === this.selectedChat?.id);
        this.selectedChat.messages = chat?.messages || [];
      }
    });
  }

  openNewChatModal(): void {
    this.showNewChatModal = true;
  }


  closeNewChatModal(): void {
    this.showNewChatModal = false;
  }

  onNewChatSelected(chatId: string): void {
    this.loadMessages();
    setTimeout(() => {
      const newlySelectedChat = this.chats.find(c => c.id === chatId);
      if (newlySelectedChat) {
        this.selectChat(newlySelectedChat);
      }
    }, 100);
  }
}