import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'numberCast'
})
export class NumberCastPipe implements PipeTransform {
  transform(input: any): number {
    return parseFloat(input);
  }
}
