import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { api } from '../api.service';
import { Observable } from 'rxjs';

export interface ProductData {
  photo: string;
  sku: string;
  name: string;
  brand: string;
  stock: string;
  price: string;
  category: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loading;
  products;
  page = 1;
  size = 10;
  total = 0;
  columns = ['photo', 'sku', 'name', 'brand'];
  dataSource =  new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: api) { }

  ngOnInit() {
    this.loading = true;
    this.api.get_products(this.page, this.size)
    .subscribe(data => {
      let response = data['body']
      console.log('data',response)
      this.total = response['total']
      this.products = JSON.parse(response['data']);
      let products = this.products.map( product => {
        let row = {
          sku: product['sku'],
          name: product['name'],
          brand: product['brand'],
          photo: product['images'][0]['url']
        }
        return row;
      });
      console.log('products', products);
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }

}
