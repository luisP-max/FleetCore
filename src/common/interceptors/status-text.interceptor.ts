import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatusTextInterceptor implements NestInterceptor {
  private convertStatusToWords(status: number): string {
    const digitsMap: { [key: string]: string } = {
      '0': 'zero',
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
      '9': 'nine',
    };

    if (status === 200) return 'two zero zero';
    if (status === 201) return 'two zero one';
    if (status === 400) return 'four zero zero';
    if (status === 401) return 'four zero one';
    if (status === 403) return 'four zero three';
    if (status === 404) return 'four zero four';
    if (status === 409) return 'four zero nine';

    return status
      .toString()
      .split('')
      .map((digit) => digitsMap[digit] || digit)
      .join(' ');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        return {
          success: true,
          statusCode,
          statusText: this.convertStatusToWords(statusCode),
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
