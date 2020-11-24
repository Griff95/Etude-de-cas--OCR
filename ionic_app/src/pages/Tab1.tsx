import React from 'react';
import { IonFab, IonIcon, IonFabButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {  triangle, square } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import axios from 'axios';
import { IonButton, IonList, IonItem, IonThumbnail, IonImg, IonLabel, } from '@ionic/react';
import  { useState } from 'react';
import { IonAlert} from '@ionic/react';


const imdata = "hi";
//const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />
//ReactDOM.render(<Example data={data} />, document.getElementById('container'))


const sendPostRequest = () => {
  axios.post("http://localhost:5000/post",{
    data: imdata
  })
  .then(resp => {
    console.log(resp);
  });
};


export const Tab1: React.FC = () => {
  const [showAlert1, setShowAlert1] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TEST ALERT</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={() => setShowAlert1(true)} expand="block">Show Alert 1</IonButton>
        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={'Alert'}
          subHeader={'Subtitle'}
          message={'This is an alert message.'}
          buttons={['OK']}
        />
        <ExploreContainer name="TEST ALERT" />
        <IonList>
      
        <IonItem >
          <IonThumbnail slot="start">
            
            <IonImg src={`data:image/jpeg;base64,${imdata}`} />
            
          </IonThumbnail>
        </IonItem>
      ))
    </IonList>
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={() => sendPostRequest()}>
            <IonIcon icon={triangle}></IonIcon>
          </IonFabButton>
        </IonFab>
        
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
