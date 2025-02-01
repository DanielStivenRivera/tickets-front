import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = signal(false);

  get loading (): WritableSignal<boolean> {
    return this._loading;
  }

  setLoading(state: boolean): void {
    this._loading.set(state);
  }

}
