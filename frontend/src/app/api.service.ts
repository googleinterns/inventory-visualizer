import {Injectable} from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getSegmentedData(filename, page = 0, perPage = 8, filters = null): Observable<object> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    params = this.buildFilter(filters, params);
    return this.http.get(environment.apiRest + 'data/' + filename, {params});
  }

  getComparisonData(filename, filename2, page = 0, perPage = 8, filters = null): Observable<object> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    params = this.buildFilter(filters, params);
    return this.http.get(environment.apiRest + 'compare/' + filename + '/' + filename2, {params});
  }

  getErrorData(filename, filename2): Observable<object> {
    return this.http.get(environment.apiRest + 'error/' + filename + '/' + filename2);
  }

  uploadFile(files): Observable<object> {
    const formData: FormData = new FormData();
    formData.append('uploaded_data', files[0], files[0].name);
    return this.http.post(environment.apiRest + 'file', formData);
  }

  deleteFile(files): void {
    const params = new HttpParams()
      .set('filename', files[0].name);
    this.http.delete(environment.apiRest + 'file', {params});
  }

  buildFilter(filters, params): HttpParams {
    if (!filters) {
      return params;
    }
    if (filters.device != null) {
      params = params.set('device', filters.device);
    }
    if (filters.countries && filters.countries !== [] && filters.countries.length !== 0) {
      params = params.set('country', filters.countries.join([',']));
    }
    if (filters.fromDate != null) {
      const date = new Date(filters.fromDate);
      params = params.set('start_date', (date.getTime() / 1000).toString());
    }
    if (filters.toDate != null) {
      const date = new Date(filters.toDate);
      params = params.set('end_date', (date.getTime() / 1000).toString());
    }
    return params;
  }
}

