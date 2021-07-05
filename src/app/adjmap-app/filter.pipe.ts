import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'searchInput' })
export class ClaimFilterPipe implements PipeTransform {
  public transform(claims: any[], searchText: any): any {
    if (searchText == null || claims == null) {
      return claims;
    }
    if(searchText.length > 2){
    if(searchText.toLowerCase() === "selected"){
      return claims.filter(claims => { return claims.isSelected === true; });
    }
    
      return claims.filter(claims => claims.filterString.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  
    }
  
    else{
      return claims;
    }
  }
}