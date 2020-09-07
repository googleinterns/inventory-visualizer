import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * @description This method makes an http call and fetches the data from the specified file and a specific page.
   * The data can be filtered by country, device and time range.
   *
   * @param string filename The name of the file to take the data from
   * @param number page The page to take the data from from the paginated response
   * @param number perPage The amount of segments to fetch
   * @param object filters Filters for the data. This is an object with fields: countries, device, fromDate, toDate, timePeriod
   */
  getSegmentedData(
    filename,
    page = 0,
    perPage = 8,
    filters = null
  ): Observable<object> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    params = this.buildFilter(filters, params);
    return this.http.get(environment.apiRest + 'data/' + filename, { params });
  }

  /**
   * @description This method makes an http call and fetches the data from the specified file and a specific page.
   * The data can be filtered by country, device and time range.
   *
   * @param string filename1 The name of the first file to take the data from
   * @param string filename2 The name of the second file with the comaprison data
   * @param number page The page to take the data from from the paginated response
   * @param number perPage The amount of segments to fetch
   * @param object filters Filters for the data. This is an object with fields: countries, device, fromDate, toDate, timePeriod
   */
  getComparisonData(
    filename,
    filename2,
    page = 0,
    perPage = 8,
    filters = null
  ): Observable<object> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    params = this.buildFilter(filters, params);
    return this.http.get(
      environment.apiRest + 'compare/' + filename + '/' + filename2,
      { params }
    );
  }

  /**
   * @description This method makes an http call and fetches the data from the specified file and a specific page.
   * The data can be filtered by country, device and time range.
   *
   * @param string filename1 The name of the first file to take the data from
   * @param string filename2 The name of the second file with the comaprison data
   * @param object filters Filters for the data. This is an object with fields: countries, device, fromDate, toDate, timePeriod
   */
  getErrorMetricsData(filename, filename2, filters): Observable<object> {
    const params = this.buildFilter(filters, new HttpParams());
    return this.http.get(
      environment.apiRest + 'error/' + filename + '/' + filename2,
      { params }
    );
  }

  /**
   * @description This method makes an http post call to upload a file
   *
   * @param FileList files a list of files
   */
  uploadFile(files): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('uploaded_data', files[0], files[0].name);
    return this.http.post(environment.apiRest + 'file', formData);
  }

  /**
   * @description This method makes an http delete call to delete a file
   *
   * @param FileList files a list of files
   */
  deleteFile(files): void {
    const params = new HttpParams().set('filename', files[0].name);
    this.http.delete(environment.apiRest + 'file', { params });
  }

  /**
   * @description This method makes an http post call to get a jwt token for a new user
   *
   * @param string The username for the new user
   */
  registerUser(username): Observable<any> {
    return this.http.post(environment.apiRest + 'register', { username });
  }

  buildFilter(filters, params): HttpParams {
    if (!filters) {
      return params;
    }
    if (filters.device != null) {
      params = params.set('devices', filters.device);
    }
    if (
      filters.countries &&
      filters.countries !== [] &&
      filters.countries.length !== 0
    ) {
      params = params.set('countries', filters.countries.join([',']));
    }
    if (filters.fromDate != null) {
      const date = new Date(filters.fromDate);
      params = params.set('start_date', (date.getTime() / 1000).toString());
    }
    if (filters.toDate != null) {
      const date = new Date(filters.toDate);
      params = params.set('end_date', (date.getTime() / 1000).toString());
    }
    if (filters.timePeriod != null) {
      params = params.set('time_period', filters.timePeriod);
    }
    return params;
  }
}

