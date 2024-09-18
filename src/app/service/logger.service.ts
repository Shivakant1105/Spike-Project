import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}
  /**
   * @description Displays a success alert with a custom message using SweetAlert2.
   * @author : vivekSengar
   * @param {string} message - The message to display in the success alert.
   */
  alertWithSuccess(message: string) {
    Swal.fire('Thank you...', message, 'success');
  }

  /**
   * @description Displays an error alert with the provided error message using SweetAlert2.
   * @author : vivekSengar
   * @param {string} errorMessage - string
   */
  erroAlert(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      title: 'Opsss...',
      text: errorMessage,
      background:localStorage.getItem('theme')=='dark-theme'?'#111C2D':'#FFFFFF',
    });
  }
 
}
