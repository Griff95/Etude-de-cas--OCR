import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, 
  IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close, triangle } from 'ionicons/icons';
import { usePhotoGallery, Photo } from '../hooks/usePhotoGallery';
import {IonModal, IonButton,IonAlert} from '@ionic/react';
import axios from 'axios';




const Tab2: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ocrMsg, setOcrMsg] = useState('');


  
  
  const ocrPhoto = async (photo: Photo) => {
    return await axios.post("http://localhost:5000/post",{
      data: photo.webviewPath
    }).then(resp => resp.data.txt_read)
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
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
          header={'Alert'}
          subHeader={'Subtitle'}
          message={ocrMsg}
          buttons={['OK']}
        />
        <IonModal 
        isOpen={showModal} cssClass='my-custom-class'>
        <p>This is modal content</p>
      </IonModal>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => setPhotoToDelete(photo)} src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: 'Modal',
              role: 'destructive',
              icon: triangle,
              handler: () => {
                
                if (photoToDelete) {                  
                  ocrPhoto(photoToDelete);             
                  setShowModal(true);
                  setPhotoToDelete(undefined); 
                }
              }
            },
            {
              text: 'alert',
              role: 'destructive',
              icon: triangle,
              handler: () => {
                if (photoToDelete) {                  
                  ocrPhoto(photoToDelete);             
                  setShowAlert(true);
                  setPhotoToDelete(undefined); 
                }
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
