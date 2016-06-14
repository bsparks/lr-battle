'use strict';

class AssetLoader {
    constructor(basePath) {
        this.basePath = basePath;
        this.assets = [];
        this.cache = {};
    }

    add(type, key, path) {
        let asset = {type, key, path};
        this.assets.push(asset);
    }

    getCache(key) {
        return this.cache[key];
    }

    _loadImage(key, path) {
        let loader = this;
        let promise = new Promise((resolve, reject) => {
            if (loader.cache[key]) {
                return resolve(loader.cache[key]);
            }

            let img = new Image();
            img.onload = function(e) {
                loader.cache[key] = img;
                resolve(img);
            };
            img.onerror = function(e) {
                reject('error loading image: ', key, path, e);
            };

            img.src = loader.basePath + path;
        });

        return promise;
    }

    load() {
        let queue = this.assets.map(asset => {
            if (asset.type === 'image') {
                return this._loadImage(asset.key, asset.path);
            }
            // TODO: other asset types
        });

        return Promise.all(queue);
    }
}