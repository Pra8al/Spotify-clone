import {Injectable} from '@angular/core';
import {ToastInfo} from './model/toast-info.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: ToastInfo[] = [];

  show(body: string, type: "SUCCESS" | "DANGER") {
    let className;
    if (type === "SUCCESS") {
      className = "bg-success text-light";
    } else {
      className = 'bg-danger text-light';
    }
    const toastInfo: ToastInfo = {body: body, className: className};
    this.toasts.push(toastInfo);
  }

  constructor() {
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(toastToCompare => toastToCompare != toast);
  }
}
