export default class LocalStorageModule {

    getObject<T>(id: string): T | null {
        console.log("Get object: ", id);

        // Look in local storage for object
        let key = this._getClassTypeName(id);
        let object = window.localStorage.getItem(key);
/* 
        return new Promise(function(resolve, reject) {

            // we're going to resolve with another promise 
            let updatedPromise = new Promise(function(resolve, reject) {
                // get from server
                // if server is most up to date...
            });

            resolve(updatedPromise);
            resolve(object);
        });
        // Ask server for updated object, response will say if it's newer or not based on date_updated sent in request
 */
        return null;
    }

    private _getClassTypeName<T>(id: string): string {
        return id;
    }

}
