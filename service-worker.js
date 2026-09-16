// =========================
// STUDENTHUB SERVICE WORKER
// NOTIFICATION ENGINE
// =========================

const CACHE_NAME = "studenthub-v23";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// =========================
// INSTALL
// =========================

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    function (cache) {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


// =========================
// ACTIVATE
// =========================

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    function (cacheName) {

                                        return (
                                            cacheName !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function (cacheName) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }
                                )

                        );

                    }
                )
                .then(
                    function () {

                        return self.clients.claim();

                    }
                )

        );

    }
);


// =========================
// FETCH
// =========================

self.addEventListener(
    "fetch",
    function (event) {

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        event.respondWith(

            fetch(event.request)

                .then(
                    function (response) {

                        if (
                            !response ||
                            response.status !== 200
                        ) {

                            return response;

                        }


                        let responseClone =
                            response.clone();


                        caches.open(CACHE_NAME)
                            .then(
                                function (cache) {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                }
                            );


                        return response;

                    }
                )

                .catch(
                    function () {

                        return caches.match(
                            event.request
                        );

                    }
                )

        );

    }
);


// =========================
// MESSAGE ENGINE
// =========================

self.addEventListener(
    "message",
    function (event) {

        if (!event.data) {

            return;

        }


        // =========================
        // SHOW NOTIFICATION
        // =========================

        if (
            event.data.type ===
            "SHOW_NOTIFICATION"
        ) {

            let title =
                event.data.title ||
                "StudentHub";

            let options =
                event.data.options || {};


            event.waitUntil(

                self.registration.showNotification(
                    title,
                    options
                )

            );

        }

    }
);


// =========================
// NOTIFICATION CLICK
// =========================

self.addEventListener(
    "notificationclick",
    function (event) {

        event.notification.close();


        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            })

                .then(
                    function (clientList) {

                        // If StudentHub is already open,
                        // bring it to the front.

                        for (
                            let client of clientList
                        ) {

                            if (
                                "focus" in client
                            ) {

                                return client.focus();

                            }

                        }


                        // Otherwise open StudentHub.

                        if (
                            clients.openWindow
                        ) {

                            return clients.openWindow(
                                "./index.html"
                            );

                        }

                    }
                )

        );

    }
);


// =========================
// NOTIFICATION CLOSE
// =========================

self.addEventListener(
    "notificationclose",
    function () {

        // Reserved for future analytics
        // and notification tracking.

    }
);