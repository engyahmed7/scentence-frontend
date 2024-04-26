import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBagShopping,
  faGear,
  faMagnifyingGlass,
  faCircleXmark,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { SearchComponent } from '../../search/search.component';
import { SettingsComponent } from '../settings/settings.component';
import { CartService } from '../../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-buttons',
  standalone: true,
  imports: [FontAwesomeModule, SearchComponent, SettingsComponent],
  templateUrl: './navbar-buttons.component.html',
  styleUrl: './navbar-buttons.component.css',
})
export class NavbarButtonsComponent {
  showSearch: string = 'hidden-item';
  showSettings: string = 'hidden-item';
  cart: any = [];
  cartSize: number = 0;
  total: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        if (data) {
          this.cart = data;
          this.total = this.cart.reduce((acc: number, item: any) => {
            return acc + item.price * item.qty;
          }, 0);
          this.cartSize = this.cart.length;
        }
      },
    });
  }

  icons = {
    search: faMagnifyingGlass,
    cart: faBagShopping,
    settings: faGear,
    icon: faMagnifyingGlass,
    bars: faBars,
  };

  changeSearch(e: Event) {
    this.icons.icon =
      this.icons.icon === faMagnifyingGlass ? faCircleXmark : faMagnifyingGlass;
    this.showSearch =
      this.showSearch === 'hidden-item' ? 'show-item' : 'hidden-item';
    this.showSettings = 'hidden-item';
  }

  changeSettings(e: Event) {
    this.icons.icon = faMagnifyingGlass;
    this.showSearch = 'hidden-item';
    this.showSettings =
      this.showSettings === 'hidden-item' ? 'show-item' : 'hidden-item';
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
