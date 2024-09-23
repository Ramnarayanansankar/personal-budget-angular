import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public myBudget: IBudget[] = [];

  constructor(private http: HttpClient){}
  getMyBudgetData() {
    console.log("before ===========",this.myBudget);
    if (this.myBudget.length === 0) {
      this.http.get('http://localhost:3000/myBudget').subscribe((res: any) => {
        this.myBudget = res.myBudget;
        console.log("after ===========",this.myBudget);
      });
    }
  }
}
export interface IBudget {
  title: String;
  value: number;
}
