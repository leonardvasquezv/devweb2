import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '@shared/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    count = 0;
    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('spinner') === 'S') {
            this.loaderService.show();
            this.count++;
        }
        return next.handle(req).pipe(
            finalize(() => {
                if (req.headers.get('spinner') === 'S') {
                    this.count--;
                }
                if (this.count === 0) {
                    this.loaderService.hide();
                }
            })
        );
    }
}
