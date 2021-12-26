import { EventEmitter, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { debounceTime, delay, retryWhen, startWith, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * InjectionToken for specifing ConnectionService options.
 */
export const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
export class ConnectionService {
    constructor(http, options) {
        this.http = http;
        this.stateChangeEventEmitter = new EventEmitter();
        this.currentState = {
            hasInternetAccess: false,
            hasNetworkConnection: window.navigator.onLine
        };
        this.serviceOptions = _.defaults({}, options, ConnectionService.DEFAULT_OPTIONS);
        this.checkNetworkState();
        this.checkInternetState();
    }
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     */
    get options() {
        return _.clone(this.serviceOptions);
    }
    checkInternetState() {
        if (!_.isNil(this.httpSubscription)) {
            this.httpSubscription.unsubscribe();
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap(() => this.http[this.serviceOptions.requestMethod](this.serviceOptions.heartbeatUrl, { responseType: 'text' })), retryWhen(errors => errors.pipe(
            // log error message
            tap(val => {
                console.error('Http error:', val);
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
            }), 
            // restart after 5 seconds
            delay(this.serviceOptions.heartbeatRetryInterval))))
                .subscribe(result => {
                this.currentState.hasInternetAccess = true;
                this.emitEvent();
            });
        }
        else {
            this.currentState.hasInternetAccess = false;
            this.emitEvent();
        }
    }
    checkNetworkState() {
        this.onlineSubscription = fromEvent(window, 'online').subscribe(() => {
            this.currentState.hasNetworkConnection = true;
            this.checkInternetState();
            this.emitEvent();
        });
        this.offlineSubscription = fromEvent(window, 'offline').subscribe(() => {
            this.currentState.hasNetworkConnection = false;
            this.checkInternetState();
            this.emitEvent();
        });
    }
    emitEvent() {
        this.stateChangeEventEmitter.emit(this.currentState);
    }
    ngOnDestroy() {
        try {
            this.offlineSubscription.unsubscribe();
            this.onlineSubscription.unsubscribe();
            this.httpSubscription.unsubscribe();
        }
        catch (e) {
        }
    }
    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param reportCurrentState Report current state when initial subscription. Default is "true"
     */
    monitor(reportCurrentState = true) {
        return reportCurrentState ?
            this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            :
                this.stateChangeEventEmitter.pipe(debounceTime(300));
    }
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param options Partial option values.
     */
    updateOptions(options) {
        this.serviceOptions = _.defaults({}, options, this.serviceOptions);
        this.checkInternetState();
    }
}
ConnectionService.DEFAULT_OPTIONS = {
    enableHeartbeat: true,
    heartbeatUrl: '//internethealthtest.org',
    heartbeatInterval: 30000,
    heartbeatRetryInterval: 1000,
    requestMethod: 'head'
};
/** @nocollapse */ /** @nocollapse */ ConnectionService.ɵfac = function ConnectionService_Factory(t) { return new (t || ConnectionService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(ConnectionServiceOptionsToken, 8)); };
/** @nocollapse */ /** @nocollapse */ ConnectionService.ɵprov = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjectable({ token: ConnectionService, factory: ConnectionService.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConnectionService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                type: Inject,
                args: [ConnectionServiceOptionsToken]
            }, {
                type: Optional
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb25uZWN0aW9uLXNlcnZpY2Uvc3JjL2xpYi9jb25uZWN0aW9uLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFhLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUMsU0FBUyxFQUE0QixLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEUsT0FBTyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekYsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUE0Q2xEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQTZDLElBQUksY0FBYyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFLM0ksTUFBTSxPQUFPLGlCQUFpQjtJQTRCNUIsWUFBb0IsSUFBZ0IsRUFBcUQsT0FBaUM7UUFBdEcsU0FBSSxHQUFKLElBQUksQ0FBWTtRQW5CNUIsNEJBQXVCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFOUQsaUJBQVksR0FBb0I7WUFDdEMsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07U0FDOUMsQ0FBQztRQWVBLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWpGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFiRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFTTyxrQkFBa0I7UUFFeEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO2lCQUNwRSxJQUFJLENBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLEVBQ3ZILFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUNqQixNQUFNLENBQUMsSUFBSTtZQUNULG9CQUFvQjtZQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDO1lBQ0YsMEJBQTBCO1lBQzFCLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQ2xELENBQ0YsQ0FDRjtpQkFDQSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO2dCQUMzQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDNUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ25FLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1lBQzlDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDckUsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7WUFDL0MsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFNBQVM7UUFDZixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUk7WUFDRixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNyQztRQUFDLE9BQU8sQ0FBQyxFQUFFO1NBQ1g7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxJQUFJO1FBQy9CLE9BQU8sa0JBQWtCLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUMvQixZQUFZLENBQUMsR0FBRyxDQUFDLEVBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQzdCO1lBQ0QsQ0FBQztnQkFDRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUMvQixZQUFZLENBQUMsR0FBRyxDQUFDLENBQ2xCLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGFBQWEsQ0FBQyxPQUEwQztRQUN0RCxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQzs7QUF2SGMsaUNBQWUsR0FBNkI7SUFDekQsZUFBZSxFQUFFLElBQUk7SUFDckIsWUFBWSxFQUFFLDBCQUEwQjtJQUN4QyxpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLHNCQUFzQixFQUFFLElBQUk7SUFDNUIsYUFBYSxFQUFFLE1BQU07Q0FDckIsQ0FBQTt3SEFQUyxpQkFBaUIsMENBNEJrQiw2QkFBNkI7eUhBNUJoRSxpQkFBaUIsV0FBakIsaUJBQWlCLG1CQUZoQixNQUFNO3VGQUVQLGlCQUFpQjtjQUg3QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQTZCd0MsTUFBTTt1QkFBQyw2QkFBNkI7O3NCQUFHLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlciwgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIHRpbWVyfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIGRlbGF5LCByZXRyeVdoZW4sIHN0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuLyoqXHJcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGlzIHVzZWQgdG8gcmVwb3J0IGN1cnJlbnQgY29ubmVjdGlvbiBzdGF0dXMuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TdGF0ZSB7XHJcbiAgLyoqXHJcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgbmV0d29yayBjb25uZWN0aW9uLiBEZXRlcm1pbmVkIGJ5IFdpbmRvdyBvYmplY3RzIFwib25saW5lXCIgLyBcIm9mZmxpbmVcIiBldmVudHMuXHJcbiAgICovXHJcbiAgaGFzTmV0d29ya0Nvbm5lY3Rpb246IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgSW50ZXJuZXQgYWNjZXNzLiBEZXRlcm1pbmVkIGJ5IGhlYXJ0YmVhdCBzeXN0ZW0gd2hpY2ggcGVyaW9kaWNhbGx5IG1ha2VzIHJlcXVlc3QgdG8gaGVhcnRiZWF0IFVybC5cclxuICAgKi9cclxuICBoYXNJbnRlcm5ldEFjY2VzczogYm9vbGVhbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGNvdWxkIGJlIHVzZWQgdG8gY29uZmlndXJlIFwiQ29ubmVjdGlvblNlcnZpY2VcIi5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcclxuICAvKipcclxuICAgKiBDb250cm9scyB0aGUgSW50ZXJuZXQgY29ubmVjdGl2aXR5IGhlYXJ0YmVhdCBzeXN0ZW0uIERlZmF1bHQgdmFsdWUgaXMgJ3RydWUnLlxyXG4gICAqL1xyXG4gIGVuYWJsZUhlYXJ0YmVhdD86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogVXJsIHVzZWQgZm9yIGNoZWNraW5nIEludGVybmV0IGNvbm5lY3Rpdml0eSwgaGVhcnRiZWF0IHN5c3RlbSBwZXJpb2RpY2FsbHkgbWFrZXMgXCJIRUFEXCIgcmVxdWVzdHMgdG8gdGhpcyBVUkwgdG8gZGV0ZXJtaW5lIEludGVybmV0XHJcbiAgICogY29ubmVjdGlvbiBzdGF0dXMuIERlZmF1bHQgdmFsdWUgaXMgXCIvL2ludGVybmV0aGVhbHRodGVzdC5vcmdcIi5cclxuICAgKi9cclxuICBoZWFydGJlYXRVcmw/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogSW50ZXJ2YWwgdXNlZCB0byBjaGVjayBJbnRlcm5ldCBjb25uZWN0aXZpdHkgc3BlY2lmaWVkIGluIG1pbGxpc2Vjb25kcy4gRGVmYXVsdCB2YWx1ZSBpcyBcIjMwMDAwXCIuXHJcbiAgICovXHJcbiAgaGVhcnRiZWF0SW50ZXJ2YWw/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogSW50ZXJ2YWwgdXNlZCB0byByZXRyeSBJbnRlcm5ldCBjb25uZWN0aXZpdHkgY2hlY2tzIHdoZW4gYW4gZXJyb3IgaXMgZGV0ZWN0ZWQgKHdoZW4gbm8gSW50ZXJuZXQgY29ubmVjdGlvbikuIERlZmF1bHQgdmFsdWUgaXMgXCIxMDAwXCIuXHJcbiAgICovXHJcbiAgaGVhcnRiZWF0UmV0cnlJbnRlcnZhbD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBIVFRQIG1ldGhvZCB1c2VkIGZvciByZXF1ZXN0aW5nIGhlYXJ0YmVhdCBVcmwuIERlZmF1bHQgaXMgJ2hlYWQnLlxyXG4gICAqL1xyXG4gIHJlcXVlc3RNZXRob2Q/OiAnZ2V0JyB8ICdwb3N0JyB8ICdoZWFkJyB8ICdvcHRpb25zJztcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmplY3Rpb25Ub2tlbiBmb3Igc3BlY2lmaW5nIENvbm5lY3Rpb25TZXJ2aWNlIG9wdGlvbnMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW46IEluamVjdGlvblRva2VuPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4gPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0Nvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuJyk7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9PUFRJT05TOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMgPSB7XHJcbiAgICBlbmFibGVIZWFydGJlYXQ6IHRydWUsXHJcbiAgICBoZWFydGJlYXRVcmw6ICcvL2ludGVybmV0aGVhbHRodGVzdC5vcmcnLFxyXG4gICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDMwMDAwLFxyXG4gICAgaGVhcnRiZWF0UmV0cnlJbnRlcnZhbDogMTAwMCxcclxuICAgIHJlcXVlc3RNZXRob2Q6ICdoZWFkJ1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPENvbm5lY3Rpb25TdGF0ZT4oKTtcclxuXHJcbiAgcHJpdmF0ZSBjdXJyZW50U3RhdGU6IENvbm5lY3Rpb25TdGF0ZSA9IHtcclxuICAgIGhhc0ludGVybmV0QWNjZXNzOiBmYWxzZSxcclxuICAgIGhhc05ldHdvcmtDb25uZWN0aW9uOiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZVxyXG4gIH07XHJcbiAgcHJpdmF0ZSBvZmZsaW5lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBvbmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBwcml2YXRlIGh0dHBTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBwcml2YXRlIHNlcnZpY2VPcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnM7XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1cnJlbnQgQ29ubmVjdGlvblNlcnZpY2Ugb3B0aW9ucy4gTm90aWNlIHRoYXQgY2hhbmdpbmcgdmFsdWVzIG9mIHRoZSByZXR1cm5lZCBvYmplY3QgaGFzIG5vdCBlZmZlY3Qgb24gc2VydmljZSBleGVjdXRpb24uXHJcbiAgICogWW91IHNob3VsZCB1c2UgXCJ1cGRhdGVPcHRpb25zXCIgZnVuY3Rpb24uXHJcbiAgICovXHJcbiAgZ2V0IG9wdGlvbnMoKTogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcclxuICAgIHJldHVybiBfLmNsb25lKHRoaXMuc2VydmljZU9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBASW5qZWN0KENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuKSBAT3B0aW9uYWwoKSBvcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCBDb25uZWN0aW9uU2VydmljZS5ERUZBVUxUX09QVElPTlMpO1xyXG5cclxuICAgIHRoaXMuY2hlY2tOZXR3b3JrU3RhdGUoKTtcclxuICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrSW50ZXJuZXRTdGF0ZSgpIHtcclxuXHJcbiAgICBpZiAoIV8uaXNOaWwodGhpcy5odHRwU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZXJ2aWNlT3B0aW9ucy5lbmFibGVIZWFydGJlYXQpIHtcclxuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uID0gdGltZXIoMCwgdGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRJbnRlcnZhbClcclxuICAgICAgICAucGlwZShcclxuICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLmh0dHBbdGhpcy5zZXJ2aWNlT3B0aW9ucy5yZXF1ZXN0TWV0aG9kXSh0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdFVybCwge3Jlc3BvbnNlVHlwZTogJ3RleHQnfSkpLFxyXG4gICAgICAgICAgcmV0cnlXaGVuKGVycm9ycyA9PlxyXG4gICAgICAgICAgICBlcnJvcnMucGlwZShcclxuICAgICAgICAgICAgICAvLyBsb2cgZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgIHRhcCh2YWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSHR0cCBlcnJvcjonLCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgLy8gcmVzdGFydCBhZnRlciA1IHNlY29uZHNcclxuICAgICAgICAgICAgICBkZWxheSh0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICAgICAgLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrTmV0d29ya1N0YXRlKCkge1xyXG4gICAgdGhpcy5vbmxpbmVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnb25saW5lJykuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSB0cnVlO1xyXG4gICAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vZmZsaW5lU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ29mZmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNOZXR3b3JrQ29ubmVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVtaXRFdmVudCgpIHtcclxuICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIuZW1pdCh0aGlzLmN1cnJlbnRTdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMub2ZmbGluZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm9ubGluZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vbml0b3IgTmV0d29yayAmIEludGVybmV0IGNvbm5lY3Rpb24gc3RhdHVzIGJ5IHN1YnNjcmliaW5nIHRvIHRoaXMgb2JzZXJ2ZXIuIElmIHlvdSBzZXQgXCJyZXBvcnRDdXJyZW50U3RhdGVcIiB0byBcImZhbHNlXCIgdGhlblxyXG4gICAqIGZ1bmN0aW9uIHdpbGwgbm90IHJlcG9ydCBjdXJyZW50IHN0YXR1cyBvZiB0aGUgY29ubmVjdGlvbnMgd2hlbiBpbml0aWFsbHkgc3Vic2NyaWJlZC5cclxuICAgKiBAcGFyYW0gcmVwb3J0Q3VycmVudFN0YXRlIFJlcG9ydCBjdXJyZW50IHN0YXRlIHdoZW4gaW5pdGlhbCBzdWJzY3JpcHRpb24uIERlZmF1bHQgaXMgXCJ0cnVlXCJcclxuICAgKi9cclxuICBtb25pdG9yKHJlcG9ydEN1cnJlbnRTdGF0ZSA9IHRydWUpOiBPYnNlcnZhYmxlPENvbm5lY3Rpb25TdGF0ZT4ge1xyXG4gICAgcmV0dXJuIHJlcG9ydEN1cnJlbnRTdGF0ZSA/XHJcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIucGlwZShcclxuICAgICAgICBkZWJvdW5jZVRpbWUoMzAwKSxcclxuICAgICAgICBzdGFydFdpdGgodGhpcy5jdXJyZW50U3RhdGUpLFxyXG4gICAgICApXHJcbiAgICAgIDpcclxuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5waXBlKFxyXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgb3B0aW9ucyBvZiB0aGUgc2VydmljZS4gWW91IGNvdWxkIHNwZWNpZnkgcGFydGlhbCBvcHRpb25zIG9iamVjdC4gVmFsdWVzIHRoYXQgYXJlIG5vdCBzcGVjaWZpZWQgd2lsbCB1c2UgZGVmYXVsdCAvIHByZXZpb3VzXHJcbiAgICogb3B0aW9uIHZhbHVlcy5cclxuICAgKiBAcGFyYW0gb3B0aW9ucyBQYXJ0aWFsIG9wdGlvbiB2YWx1ZXMuXHJcbiAgICovXHJcbiAgdXBkYXRlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4pIHtcclxuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCB0aGlzLnNlcnZpY2VPcHRpb25zKTtcclxuICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=