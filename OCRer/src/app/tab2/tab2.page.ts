import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo, PhotoService } from '../services/photo.service';
import {AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, 
    public actionSheetController: ActionSheetController, 
    public alertController: AlertController,
    private http: HttpClient) {}


    ocr(foto:string) {
      this.http.post('http://127.0.0.1:5000/post',{data: foto})
          .subscribe((data) => {
          if (!data['txt_read'].replace(/[^0-9a-z]/gi, '')) {
            this.presentAlert("...nothing yet");
          }else{
          //this.presentAlert(data['txt_read'].replace('[^a]',"ZZZZZ").replace(/[^\na-z ]/gi, ''))
          console.log(data['txt_read']);
          this.presentAlert(data['txt_read'].replace(/[^\na-z ]/gi, '').replace(/\n/gi,"<br/>"));
        }
        });
    }
    
    testget() {
      this.http.get('http://127.0.0.1:5000/test_get')
          .subscribe((data) => {
          this.presentAlert(data['txt_read']);
        });
    }
    

     

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  async presentAlert(OCRresult: string) {
    
    const alert = await this.alertController.create({
      header: 'I read...',
      subHeader: '',
      message: OCRresult,
      buttons: ['OK'],
    });
  
    await alert.present();
  }

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      
      buttons: [{
        text: 'OCR This!',
        role: 'destructive',
        icon: 'triangle',
        handler: () => {
          this.ocr(photo.webviewPath);
        }
      },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }
}
