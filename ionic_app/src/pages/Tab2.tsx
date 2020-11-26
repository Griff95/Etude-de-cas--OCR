import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, 
  IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close, triangle } from 'ionicons/icons';
import { usePhotoGallery, Photo } from '../hooks/usePhotoGallery';
import {IonModal, IonButton,IonAlert} from '@ionic/react';
import axios from 'axios';



const Tab2: React.FC = () => {
  const { deletePhoto, photos, takePhoto} = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [showAlert, setShowAlert] = useState(false);
  const [msgTo, setMsgTo] = useState("nope");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Which one should I read?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'I can read:'}
          subHeader={''}    
          message={msgTo}
          buttons={['Wow!']}
        />

        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => setPhotoToDelete(photo)} 
                                src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => {takePhoto()}}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
                
        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
           
            {
              text: 'OCR THIS!',
              role: 'destructive',
              icon: triangle,
              handler: () => {
                
                if (photoToDelete) {  
                  axios.post("http://localhost:5000/post",{
                    data: photoToDelete.webviewPath
                  })
                  .then(resp => {
                    console.log('"'+resp.data.txt_read+'"');
                    if (!resp.data.txt_read.replace(/[^0-9a-z]/gi, '')) {setMsgTo('...nothing');}
                    else {
                      setMsgTo(resp.data.txt_read.replace(/[^0-9a-z ]/gi, ''));
                    }  
                    setShowAlert(true) 
                  });
                  }                                         
                  setPhotoToDelete(undefined); 
                }
              },           
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel'
            },
          {
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }
          ]
              
          }
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
