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
  size = 10;
  total = 0;
  tabs = [];
  config;
  columns = ['photo', 'sku', 'name', 'brand', 'actions'];
  dataSource =  new MatTableDataSource();
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: api) { }

  ngOnInit() {
    this.loading = true;
    this.api.get_products(this.page, this.size)
    .subscribe(data => {
      let response = data['body']
      this.total = response['total']
      this.products = JSON.parse(response['data']);
      this.products.forEach( product => {
        product['description_html'] = product['description_html'].replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");
        product['marketplaces'] = product['marketplaces'].filter( mk => mk['status'] != 'not_listed')
      });
      let products = this.products.map( product => {
        let row = {
          sku: product['sku'],
          name: product['name'],
          brand: product['brand'],
          photo: product['images'][0]['url']
        }
        return row;
      });
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
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
        breakpoint: 756,
        width: "300px",
        height: "300px",
        thumbnailsColumns: 5
      },
      {
        breakpoint: 500,
        width: "100%",
        height: "200px",
        thumbnailsColumns: 3
      }
    ];
    this.api.get_config().subscribe( config => {
      this.categories = JSON.parse(config['body']['categories']);
      this.shops = JSON.parse(config['body']['shops']);
    });
  }

  getCategory = pk => {
    let category = this.categories.find( cat => cat['pk'] == pk);
    return category['name'];
  }

  backToList = () => {
    this.product = false;
    this.galleryImages = [];
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
