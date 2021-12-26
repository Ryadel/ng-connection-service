import * as i0 from '@angular/core';
import { InjectionToken, EventEmitter, Injectable, Inject, Optional, NgModule } from '@angular/core';
import { timer, fromEvent } from 'rxjs';
import { switchMap, retryWhen, tap, delay, debounceTime, startWith } from 'rxjs/operators';
import * as _ from 'lodash';
import * as i1 from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

/**
 * InjectionToken for specifing ConnectionService options.
 */
const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
class ConnectionService {
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
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConnectionService, [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], function () {
        return [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [ConnectionServiceOptionsToken]
                    }, {
                        type: Optional
                    }] }];
    }, null);
})();

class ConnectionServiceModule {
}
/** @nocollapse */ /** @nocollapse */ ConnectionServiceModule.ɵfac = function ConnectionServiceModule_Factory(t) { return new (t || ConnectionServiceModule)(); };
/** @nocollapse */ /** @nocollapse */ ConnectionServiceModule.ɵmod = /** @pureOrBreakMyCode */ i0.ɵɵdefineNgModule({ type: ConnectionServiceModule });
/** @nocollapse */ /** @nocollapse */ ConnectionServiceModule.ɵinj = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjector({ providers: [ConnectionService], imports: [[HttpClientModule]] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConnectionServiceModule, [{
            type: NgModule,
            args: [{
                    imports: [HttpClientModule],
                    providers: [ConnectionService]
                }]
        }], null, null);
})();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(ConnectionServiceModule, { imports: [HttpClientModule] }); })();

/*
 * Public API Surface of connection-service
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ConnectionService, ConnectionServiceModule, ConnectionServiceOptionsToken };
