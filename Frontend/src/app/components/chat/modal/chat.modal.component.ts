import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.modal.component.html',
  styleUrls: ['./chat.modal.component.css']
})
export class ChatModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() chatSelected = new EventEmitter<string>(); // Emite el Id del chat seleccionado

  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
  currentUser = localStorage.getItem('idUsuario') || "anonimo";

  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
    this.loadUsers();

    // Aplica el filtro
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.filterUsers(term))
    ).subscribe(filtered => {
      this.filteredUsers = filtered;
    });
  }

  loadUsers(): void {
    this.feedService.getUsuarios().subscribe({
      next: (users: any) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerms.next(searchTerm);
  }

  private filterUsers(term: string): Observable<any[]> {
    if (!term.trim()) {
      return of(this.users);
    }
    const lowerCaseTerm = term.toLowerCase();
    return of(this.users.filter(user =>
      user.username.toLowerCase().includes(lowerCaseTerm)
    ));
  }

  selectUser(user: any): void {
    const inicial = {
      "participantes": [
        this.currentUser,
        user._id
      ]
    }
    // Iniciar o obtener la conversación con este usuario
    this.feedService.iniciarConversacion(inicial).subscribe({
      next: (chat: any) => {
        this.chatSelected.emit(chat.id);
        this.close.emit();
      },
      error: (err) => {
        console.error('Error al iniciar conversación:', err);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}