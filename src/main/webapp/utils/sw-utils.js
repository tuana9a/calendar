class ServiceWorkerUtils {
    registerServiceWorker(serviceWorkerFile = "", onSuccess = console.log, onError = console.error) {
        if (!isServiceWorkderAvailable) return;
        navigator.serviceWorker.register(serviceWorkerFile).then(onSuccess).catch(onError);
    }
    async unregisterServiceWorkers() {
        return navigator.serviceWorker.getRegistrations().then(function (serviceWorkers) {
            return serviceWorkers.map(function (serviceWorker) {
                return serviceWorker.unregister();
            });
        });
    }
}

export const serviceWorkserUtils = new ServiceWorkerUtils();
