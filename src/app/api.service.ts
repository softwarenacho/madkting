import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const base = 'https://nacho-api.herokuapp.com/api/madkting';

@Injectable()
export class api {

  constructor(private http:HttpClient) {}

  get_products(page, size) {
    let url = base + '?page=' + page + '&page_size=' + size;
    return this.http.get(url, { 'observe': 'response' });
  }

  get_config() {
    let url = base + '/config';
    return this.http.get(url, { 'observe': 'response' });
  }

}
