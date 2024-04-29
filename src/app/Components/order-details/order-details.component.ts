import { CommonModule, NgForOf } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../Services/orders.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  providers: [OrdersService],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  orderStatuses: string[] = ['pending', 'accepted', 'on way', 'delivered'];
  currentStatusIndex: number = 0;
  isAdmin = false;
  getCurrentStatusIndex(status: string): number {
    return this.orderStatuses.indexOf(status);
  }
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    if (this.router.url.split('/')[1] == 'admin') {
      this.isAdmin = true;
    }
  }
  order: any;
  date: any;
  time: any;
  discount: any;
  invalidStatus: boolean = false;
  dropdownStates: { [orderId: string]: boolean } = {};
  ngOnInit() {
    console.log(this.route);
    this.orderService
      .getOrderDetails(this.route.snapshot.paramMap.get('id'))
      .subscribe({
        next: (data) => {
          this.order = data;
          this.date = new Date(this.order.order.createdAt).toLocaleDateString();
          this.time = new Date(this.order.order.createdAt).toLocaleTimeString();
          this.order.order.createdAt = this.date + ' ' + this.time;
          this.currentStatusIndex = this.getCurrentStatusIndex(
            this.order.order.status
          );
          this.discount =
            ((this.order.order.total - 30) / (1 - this.order.order.discount)) *
            this.order.order.discount;
          console.log(this.order.order.status);
          console.log(this.order.products);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  updateStatus(id: any, status: any) {
    if (
      status == 'delivered' ||
      status == 'pending' ||
      status == 'on way' ||
      status == 'accepted' ||
      status == 'rejected'
    ) {
      this.orderService.updateOrderStatus(id, status).subscribe({
        next: (data) => {
          this.order.order.status = status;
          this.currentStatusIndex = this.getCurrentStatusIndex(status);
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.invalidStatus = true;
    }
  }
  toggleDropdown(orderId: string) {
    this.dropdownStates[orderId] = !this.dropdownStates[orderId];
  }
  reOrder(id: any) {
    this.orderService.reOrder(id).subscribe({
      next: (data) => {
        this.cartService.getCart().subscribe({
          next: (data: any) => {
            setTimeout(() => {
              this.router.navigate(['/cart']);
            }, 1000);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  cancelOrder(id: any) {
    this.orderService.cancelOrder(id).subscribe({
      next: (data) => {
        this.order.order.status = 'cancelled';
        this.currentStatusIndex = this.getCurrentStatusIndex('cancelled');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
