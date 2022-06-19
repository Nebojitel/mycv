import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    //Run somthing before a request is handled by the request handler
    // console.log('Im running before handler', context);
    return handler.handle().pipe(
      map((data: any) => {
        //Run something before the response is sent out
        // console.log('Im running before response is sent out ', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, //Для того, чтоб убедиться, что все работает как должно. Будут оставаться те свойства, что указаны в UserDto
        });
      }),
    );
  }
}
