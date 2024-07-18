const CACHE_NAME = "my-cache-v1";
const clientFolderURL = "/Client";
const staticAssets = [
  "/",
  
  clientFolderURL,
];

//! Install PWA
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(staticAssets))
  );
  self.skipWaiting();
});

//! Activate PWA
self.addEventListener("activate", (evt) => {
  const cacheWhiteList = [CACHE_NAME];
  evt.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((item) => {
          if (!cacheWhiteList.includes(item)) {
            return caches.delete(item);
          }
          return item;
        })
      )
    )
  );
});

//! Show push notification with logo and platform name
self.addEventListener("push", (event) => {
  let title = "MySelpost";
  let body = "New notification";
  if (event.data) {
    const data = event.data.json();
    if (data.title) {
      title = data.title;
    }
    if (data.body) {
      body = data.body;
    }
    if (data.customTitle) {
      title = data.customTitle;
    }
    if (data.customBody) {
      body = data.customBody;
    }
  }

  const options = {
    icon: "logo.png",
    badge: "logo.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    body: body,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

//! Show push notification with message
self.addEventListener("message", (event) => {
  if (event.data && event.data.title && event.data.body) {
    const notificationOptions = {
      icon: "logo.png",
      badge: "logo.png",
      vibrate: [200, 100, 200],
      requireInteraction: true,
      body: event.data.body,
    };

    self.registration.showNotification(event.data.title, notificationOptions);
  }
});

//! Redirect to site on clicking notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window" })
      .then((clientList) => {
        let urlToOpen = "https://myselpost.com";
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          const newWindow = self.clients.openWindow(urlToOpen);
          newWindow.then((client) => {
            if (client) {
              const notificationOptions = {
                ...event.notification.options,
                requireInteraction: false,
              };
              client.postMessage({ notificationOptions });
            }
          });
        }
      })
  );
});

//! Managae notification subscription change
self.addEventListener("pushsubscriptionchange", async (event) => {
  try {
    const newSubscription = await self.registration.pushManager.subscribe();
    await updateSubscriptionOnServer(newSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
});

//! Update subscription on server
async function updateSubscriptionOnServer(newSubscription) {
  return fetch('/api/update-subscription', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSubscription),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update subscription on server');
    }
    console.log("Subscription updated successfully on server");
  })
  .catch(error => {
    console.error("Error updating subscription on server:", error);
  });
}
