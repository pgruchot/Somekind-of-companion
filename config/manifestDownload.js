const https = require('https');
const fs = require('fs');
const requestPromise = require('request-promise');
const mongoose = require('mongoose');
const extract = require('extract-zip');
const sqlite3 = require('sqlite3').verbose();

const manifestVersion = require('../models/manifest')

const keys = require('./keys');
const path = keys.path;

//Request options used to get manifest data 
const requestOptions = {
    method: 'GET',
    uri: 'https://www.bungie.net/Platform/Destiny2/Manifest/',
    headers: {
        'X-API-KEY': keys.bungieAPI.APIKey
      },
    json: true,
};

//Function used to download manifest
const downloadManifest = (url, directory) => {
    return new Promise((resolve, reject) => {
        try {
            let file = fs.createWriteStream(directory);
            let request = https.get(url, (res) => {
            res.pipe(file); 
                file.on('finish', (res) => {
                    file.close();
                    return resolve();
                });
            })
        } catch(err) {
            console.log("error while downloading manifest");
            console.log(err);
            return reject(new Error(400));
        }   
    })
}

//Function to check for newest manifest version
const checkManifestVersion = () => {
    return new Promise((resolve, reject) => {
            console.log('trying')
            requestPromise(requestOptions).then((res) => {
                console.log('got manifest response');
                console.log(res.Response.version);
                return resolve(res.Response);
            }).catch((err) => {
                console.log("error while calling api for version");
                return reject(new Error(401));
            })  
    })
}

//Function used to compare manifest versions
const dbManifestOperations = (versionResponse) => {
    return new Promise((resolve, reject) => {
        let document = manifestVersion.findOne({"localID": 1}, ( err, doc ) => {
              if(err) {
                  console.log("db check for version error");
                  console.log(err);
                  return reject(new Error(402));
              }
              if(doc) {
                console.log('found in db')
                console.log('old version: ' + doc.version)
                console.log('new version: ' + versionResponse.version)
                if(doc.version !== versionResponse.version) {
                    doc.version = versionResponse.version;
                    doc.mobileWorldContentPaths = versionResponse.mobileWorldContentPaths.en;
                    doc.save((err) => {
                        if(err){
                            console.log("db save error");
                            console.log(err);
                            return reject(new Error(402));
                        }
                    });
                    return resolve(2)
              }
              return resolve(1);
            }
        })
    })
}

//Function used to extract manifest zip
const extractManifestFile = () => {
    return new Promise((resolve, reject) => {
        extract(path + 'manifest/manifest.zip', {dir: path + 'manifest/extracted'}, function (err) {
            // extraction is complete. make sure to handle the err
            if(err) {
                console.log("extracting error");
                console.log(err);
                return reject(new Error(403));
            } else {
                console.log('extracting done');
                return resolve();
            }
    })
    })
}

//Function used to rename manifest to something less complicated
const renameManifestFile = (manifestOriginalName) => {
    //response.Response.mobileWorldContentPaths.en.substr(34)
    return new Promise((resolve, reject) => {
        fs.rename(path + 'manifest/extracted/' + manifestOriginalName.substr(34), path + 'manifest/extracted/manifest.content', function(err) {
            if (err) { 
                console.log("db save error");
                console.log(err);
                return reject(new Error(404));
            } else {
                return resolve();
            }
        })
    })
}


//Function used to open SQLite connection
const openSQliteManifest = () => {
    return new Promise((resolve, reject) => {
    let manifest = new sqlite3.Database( path + 'manifest/extracted/manifest.content' , sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          console.log("sqlite open error")
          console.log(err)
          return reject(new Error(405));
        }
          console.log('DB connected');
          return resolve(manifest);
      });
    })
}

//Function used to aggregate all async operations and expose db 
async function prepareDB() {
    try{
        let version = await checkManifestVersion();
        let shouldDownload = await dbManifestOperations(version);
        console.log("Should download")
        if(shouldDownload == 2) {
            console.log('yes')
            console.log('Downloading manifest')
            console.log(path)
            await downloadManifest('https://www.bungie.net'+ version.mobileWorldContentPaths.en, path + 'manifest/manifest.zip');
            console.log('Extracting manifest')
            await extractManifestFile();
            console.log('Renaming manifest')
            console.log(version.mobileWorldContentPaths.en)
            await renameManifestFile(version.mobileWorldContentPaths.en);
            console.log('Download process complete, manifest ready to open')
        }else{
            console.log('no')
        }
        
        console.log('Opening db')
        let db = await openSQliteManifest();
        return db;
    } catch(err) {
        console.log('handling caught err')
        console.log('Calling prepareDB again in one minute...');
        setTimeout(() => prepareDB(), 60000);
    }
    
    // console.log("Manifest ready for action!");
    

}

module.exports = prepareDB;