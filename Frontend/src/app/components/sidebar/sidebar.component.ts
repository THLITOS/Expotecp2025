import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FeedService } from '../services/feed.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isExpanded = false;

  @Input() selectedSection: 'feed' | 'comunidades' | 'crearcomunidad' | 'soporte' |'TusComunidades'| 'otro' = 'feed';
  @Output() sectionSelected = new EventEmitter<'feed' | 'comunidades' | 'crearcomunidad' | 'soporte' |'TusComunidades'| 'otro'>();

  constructor(
    private feedService: FeedService
  ) {}

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  selectSection(section: 'feed' | 'comunidades' | 'crearcomunidad' | 'soporte' |'TusComunidades'| 'otro') {
    this.sectionSelected.emit(section);
    this.feedService.cerrarFormulario();
  }
}
