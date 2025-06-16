import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value:any, Search: any): any {
    if(!Search){
      return value
    }
    return value.filter((value:any)=>{return (value.ProductName.toLowerCase().includes(Search))})
  }

}
