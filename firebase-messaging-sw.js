importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCYuhNhB-i-NxjenRFjdzugYOsw2KeXSq0",
  authDomain: "study-tracker1.firebaseapp.com",
  projectId: "study-tracker1",
  messagingSenderId: "210271104714",
  appId: "1:210271104714:web:14ec55de6895019822ce33"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "static/icon-192.png"
    }
  );
});
