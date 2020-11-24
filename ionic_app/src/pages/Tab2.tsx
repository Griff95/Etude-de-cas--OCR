import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close, triangle } from 'ionicons/icons';
import { usePhotoGallery, Photo } from '../hooks/usePhotoGallery';
import { IonAlert} from '@ionic/react';

const Tab2: React.FC = () => {
  const { ocrPhoto, deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [showAlert1, setShowAlert1] = useState(false);
  var ocr_msg = "Could not display";

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
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={'Alert'}
          subHeader={'Subtitle'}
          message={ocr_msg}
          buttons={['OK']}
        />
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
              text: 'Read this text',
              role: 'destructive',
              icon: triangle,
              handler: () => {
                if (photoToDelete) {
                  console.log(ocrPhoto(photoToDelete));
                  //console.log(JSON.parse(JSON.stringify(ocrPhoto(photoToDelete))).data)
                  setPhotoToDelete(undefined);
                  ocr_msg='yo';
                  setShowAlert1(true);
                }
              }
            }, {
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
