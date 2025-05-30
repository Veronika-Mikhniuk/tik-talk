import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NgFor } from '@angular/common'
import { SvgIconComponent } from "../svg-icon/svg-icon.component"
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { ProfileService } from '../../data/services/profile.service'
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, SvgIconComponent, SubscriberCardComponent, RouterLink, AsyncPipe, ImgUrlPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService)
  subscribers$ = this.profileService.getSubscribersShortList()
  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ]

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe())
  }
}
