import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authService.authUser.subscribe();
        return this.authService.authUser.pipe(
            take(1),
            exhaustMap(user => {
                if(user) {
                    console.log(user?.token)
                    const modifiedRquest = req.clone(
                        {
                            params: new HttpParams().set('auth', user.token)
                        }
                    );

                    return next.handle(modifiedRquest);
                } else {
                    return next.handle(req);
                }
            })
        );
    }

}