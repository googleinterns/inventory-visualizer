import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  uploadFile(files): Observable<object> {
    const formData: FormData = new FormData();
    formData.append('uploaded_data', files[0], files[0].name);
    return this.http.post(environment.apiRest + 'file', formData);
  }

  deleteFile(files): void {
    this.http.delete( environment.apiRest + 'file' + '?filename=' + files[0].name);
  }
}

