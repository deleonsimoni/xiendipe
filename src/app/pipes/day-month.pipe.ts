import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayMonth'
})
export class DayMonthPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let dayWithMont: String = value;

    switch (dayWithMont.substring(0, dayWithMont.indexOf('/'))) {
      case "20":
        return dayWithMont + " - Domingo"
      case "21":
        return dayWithMont + " - Segunda"
      case "22":
        return dayWithMont + " - Terça"
      case "23":
        return dayWithMont + " - Quarta"
      case "24":
        return dayWithMont + " - Quinta"
      case "25":
        return dayWithMont + " - Sexta"
      case "26":
        return dayWithMont + " - Sábado"
      case "27":
        return dayWithMont + " - Domingo"



      default:
        return null
        break;
    }
  }

}
