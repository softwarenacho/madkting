import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
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
  product;
  categories;
  shops;
  page = 1;
  size = 100;
  total = 0;
  tabs = [];
  config;

  columns;
  dataSource: MatTableDataSource<Object>;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: api) { }

  ngOnInit() {
    this.getProducts();
    this.galleryOptions = [
      {
        layout: "thumbnails-top"
      },
      {
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewSwipe: true,
        previewDownload: true
      },
      {
        imageSize: "contain",
        imageAutoPlay: true,
        imageAutoPlayPauseOnHover: true,
        previewAutoPlay: true,
        previewAutoPlayPauseOnHover: true,
        thumbnailsSwipe: true,
        thumbnailSize: 'contain',
        imageArrows: true,
        imageArrowsAutoHide: true,
        imageInfinityMove: true,
        thumbnailsArrows: true,
        thumbnailsArrowsAutoHide: true,
        previewInfinityMove: true
      },
      {
        width: "100%",
        height: "500px",
        thumbnailsColumns: 4
      },
      {
        breakpoint: 768,
        width: "100%",
        height: "350px",
        thumbnailsColumns: 3
      }
    ];
    this.api.get_config().subscribe( config => {
      this.categories = JSON.parse(config['body']['categories']);
      this.shops = JSON.parse(config['body']['shops']);
    });
      this.dataSource = new MatTableDataSource();
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  getProducts = () => {
    this.loading = true;
    this.api.get_products(this.page, this.size)
    .subscribe(data => {
      let response = data['body']
      this.total = response['total'];
      this.page = response['page'];
      this.size = response['size'];
      this.products = JSON.parse(response['data']);
      this.products.forEach( product => {
        product['description_html'] = product['description_html'].replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
        product['marketplaces'] = product['marketplaces'].filter( mk => mk['status'] != 'not_listed')
      });
      let products = this.products.map( product => {
        let row = {
          id: product['pk'],
          sku: product['sku'],
          name: product['name'],
          brand: product['brand'],
          stock: product['stock'],
          price: product['price'],
          category: product['category_pk'],
          photo: product['images'][0]['url']
        }
        return row;
      });
      if (window.innerWidth > 768.9) {
        this.columns = ['photo', 'id', 'sku', 'name', 'brand', 'stock', 'price', 'category', 'actions'];
      } else {

        this.columns = ['photo', 'sku', 'name', 'brand', 'actions'];
      }
      this.dataSource.data = products;
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator.length = this.total;
      // this.dataSource.paginator.pageIndex = this.page;
      // this.dataSource.paginator.pageSize = this.size;
      this.loading = false;
    });
  }

  paginate = e => {
    console.log('paginate', e)
    this.page = e.pageIndex;
    this.size = e.pageSize;
    // this.getProducts();
  }

  getCategory = pk => {
    let category = this.categories.find( cat => cat['pk'] == pk);
    return category ? category['name'] : '';
  }

  backToList = () => {
    this.product = false;
    this.galleryImages = [];
    let e = document.getElementById("list-tab");
    e.scrollIntoView();
  }

  selectTab = product => {
    this.product = product;
    this.galleryImages = this.product['images'].map( image => {
      return {
        small: image['url'],
        medium: image['url'],
        big: image['url'],
      }
    });
  }

  openTab = product => {
    this.products.forEach( (pro, i) => {
      if (pro['sku'] == product['sku']) {
        this.product = pro;
        this.tabs.push(pro);
        this.galleryImages = pro['images'].map( image => {
          return {
            small: image['url'],
            medium: image['url'],
            big: image['url'],
          }
        });
      }
    })
  }

  closeTab = product => {
    this.tabs = this.tabs.filter( item => item['sku'] != product['sku'] );
    if (this.product['sku'] == product['sku']) this.backToList();
  }

}

// var elmnt = document.getElementByClass("content");
// elmnt.scrollIntoView();
