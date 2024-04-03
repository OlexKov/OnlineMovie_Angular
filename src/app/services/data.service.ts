import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ICountry } from '../models/ICountry';
import { IStafRole } from '../models/IStafRole';
import { IGenre } from '../models/IGenre';
import { IQuality } from '../models/IQuality';
import { IPremium } from '../models/IPremium';

@Injectable({
  providedIn: 'root'
})
export class DataService {

   webApi:string = "http://localhost:5000/api/Data/"

  constructor(private http: HttpClient) { }
  getCountries():Observable<HttpResponse<ICountry[]>>
  {
    return this.http
    .get<ICountry[]>(this.webApi +'getcountries', {observe: 'response'});
  }

  getRoles():Observable<HttpResponse<IStafRole[]>>
  {
    return this.http
    .get<IStafRole[]>(this.webApi +'getroles', {observe: 'response'});
  }

  getGenres():Observable<HttpResponse<IGenre[]>>
  {
    return this.http
    .get<IGenre[]>(this.webApi +'getgenres', {observe: 'response'});
  }

  getQualities():Observable<HttpResponse<IQuality[]>>
  {
    return this.http
    .get<IQuality[]>(this.webApi +'getqualities', {observe: 'response'});
  }

  getPremiums():Observable<HttpResponse<IPremium[]>>
  {
    return this.http
    .get<IPremium[]>(this.webApi +'getpremiums', {observe: 'response'});
  }
}
