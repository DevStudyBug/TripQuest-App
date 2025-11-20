import { inject, Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({ providedIn: "root" })
export class UIToastService {
    private toastCtrl = inject(ToastController);

    async showToast(message: string, duration = 1500, color:'success' | 'warning' | 'danger' | 'primary'| 'medium' | 'light' | 'dark' = 'medium') {
        const toast = await this.toastCtrl.create({
            message, 
            duration,
            color,
            position: 'bottom'
        });
        await toast.present();
    }

}