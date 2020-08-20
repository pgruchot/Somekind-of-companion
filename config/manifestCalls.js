const sqlite3 = require('sqlite3').verbose();

const manifestDownload = require('./manifestDownload');

module.exports = async function() {
    //mount manifest
    const db = await manifestDownload();
   
    //Check class against manifest
    this.checkClass = function(classHash){
            return new Promise(async (resolve, reject) => {
                    classHash = classHash & 0xFFFFFFFF
                    let table = 'DestinyClassDefinition'
                    let sql = `SELECT json FROM ${table} WHERE id = ${classHash}`;
                    await db.each(sql, (err, row) => {
                        if(err) {
                            return reject(err);
                        }
                        const decodedData = JSON.parse(row.json);
                        const decodedName = decodedData.displayProperties.name;
                        return resolve(decodedName);
                    });          
            })  
    }

    //Check race against manifest
    this.checkRace = function(raceHash){
            return new Promise(async (resolve, reject) => {
                    raceHash = raceHash & 0xFFFFFFFF
                    let table = 'DestinyRaceDefinition'
                    let sql = `SELECT json FROM ${table} WHERE id = ${raceHash}`;
                    await db.each(sql, (err, row) => {
                        if(err) {
                            return reject(err);
                        }
                        const decodedData = JSON.parse(row.json);
                        let decodedName = decodedData.displayProperties.name;
                        return resolve(decodedName);
                    });          
            }) 
    }

    //Check gender against manifest
    this.checkGender = function(genderHash){
            return new Promise(async (resolve, reject) => {
                    genderHash = genderHash & 0xFFFFFFFF
                    let table = 'DestinyGenderDefinition';
                    let sql = `SELECT json FROM ${table} WHERE id = ${genderHash}`;
                    await db.each(sql, (err, row) => {
                        if(err) {
                            console.log(err)
                            return reject(err);
                        }
                        const decodedData = JSON.parse(row.json);
                        let decodedName = decodedData.displayProperties.name;
                        return resolve(decodedName);
                    });          
            })  
    }

    //Check item basics against manifest
    this.checkBasicItemInfo = function(itemHash) {
        return new Promise((resolve, reject) => {
                //console.log(itemHash)
                itemHash = itemHash & 0xFFFFFFFF;
                let table = 'DestinyInventoryItemDefinition';
                let sql = `SELECT json FROM ${table} WHERE id = ${itemHash}`;
                db.get(sql, (err, row) => {
                    if(err) {
                        console.log(err)
                        return reject(err);
                    }
                    if(row === undefined) {
                        //console.log(itemHash)
                        return resolve(null)
                    }
                    const decodedData = JSON.parse(row.json);
                    const decodedItem = decodedData.displayProperties;
                    //console.log(decodedItem.name)
                    return resolve({ 
                        description: decodedItem.description, 
                        name: decodedItem.name, 
                        icon: decodedItem.icon });
                });     
            })     
    }

    //Check item damage type against manifest
    this.checkItemDamage = function(damageTypeHash) {
            return new Promise((resolve, reject) => {
                //console.log(damageTypeHash)
                damageTypeHash = damageTypeHash & 0xFFFFFFFF;
                    let table = 'DestinyDamageTypeDefinition';
                    let sql = `SELECT json FROM ${table} WHERE id = ${damageTypeHash}`;
                    db.each(sql, (err, row) => {
                        if(err) {
                            console.log(err)
                            return reject(err);
                        }
                        const decodedData = JSON.parse(row.json);
                        const decodedItem = decodedData.displayProperties;
                        return resolve({
                            name: decodedItem.name, 
                            icon: decodedItem.icon});
                    })
            })
    }

    //Check item perk against manifest
    this.checkItemPerk = function(perk) {
        return new Promise((resolve, reject) => {
                    let perkPlugHash = perk.perkHash & 0xFFFFFFFF;
                    let table = 'DestinySandboxPerkDefinition';
                    let sql = `SELECT json FROM ${table} WHERE id = ${perkPlugHash}`;
                    db.get(sql, (err, row) => {
                        if(err) {
                            console.log(err)
                            return reject(err);
                        }
                        if(row === undefined) {
                            return resolve(null)
                        }
                        const decodedData = JSON.parse(row.json);
                        const decodedItem = decodedData.displayProperties;
                        if(decodedItem.name === undefined){
                            return resolve(null)
                        }
                        return resolve({
                            description: decodedItem.description, 
                            name: decodedItem.name, 
                            icon: decodedItem.icon})
                        })
                    })
    }

    //Check item socket against manifest
    this.checkItemSocket = function(socket) {
        return new Promise((resolve, reject) => {
                    let socketPlugHash = socket.plugHash & 0xFFFFFFFF;
                    let table = 'DestinyInventoryItemDefinition';
                    let sql = `SELECT json FROM ${table} WHERE id = ${socketPlugHash}`;
                    db.get(sql, (err, row) => {
                        if(err) {
                            console.log(err)
                            return reject(err);
                        }
                        if(row === undefined) {
                            return resolve(null)
                        }
                        const decodedData = JSON.parse(row.json);
                        const decodedItem = decodedData.displayProperties;
                        if(decodedItem.icon === undefined){
                            return resolve(null)
                        }
                        //console.log(decodedItem.name)
                        return resolve({
                            description: decodedItem.description, 
                            name: decodedItem.name, 
                            icon: decodedItem.icon})
                        })
                    })
    }

    //Prepare damage type, perk info and socket info for item
    this.checkItem = function(item) {
            return new Promise( async (resolve, reject) => {
                //console.log(item);
                const damageType = item.instance.data.damageType !== 0 ? 
                    await checkItemDamage(item.instance.data.damageTypeHash) : 
                    null;
                //console.log(item);
                const decodedPerks = item.perks.data !== undefined ? 
                    await Promise.all( item.perks.data.perks.map( async perk => {
                        const decodedPerk = await checkItemPerk(perk);
                        return decodedPerk;
                    })
                ) : null;
                //console.log(item.sockets)
                const decodedSockets = item.sockets.data ? 
                    await Promise.all( item.sockets.data.sockets.map( async socket => {
                        const decodedSocket = socket.plugHash ? await checkItemSocket(socket) : null;
                        //console.log(socket.plugHash)
                        //console.log(decodedSocket.name)
                        return decodedSocket;
                    }) 
                ) : null;
                return resolve({ 
                    damageType, 
                    perks: decodedPerks ? 
                        decodedPerks.filter(perk => perk !== null) : 
                        null, 
                    sockets: decodedSockets ? 
                        decodedSockets.filter(socket => socket !== null) : 
                        null  
                })
            })
    }

    //Check activity to retrieve map and img
    this.checkActivityMap = function(referenceId) {
        return new Promise((resolve, reject) => {
            let referenceIdHash = referenceId & 0xFFFFFFFF;
            let table = 'DestinyActivityDefinition';
            let sql = `SELECT json FROM ${table} WHERE id = ${referenceIdHash}`;
            db.get(sql, (err, row) => {
                if(err) {
                    console.log(err)
                    return reject(err);
                }
                const decodedData = JSON.parse(row.json);
                const decodedItem = decodedData.displayProperties;
                let imgLink = decodedData.pgcrImage;
                //console.log(decodedItem)
                
                return resolve({
                    description: decodedItem.description, 
                    name: decodedItem.name,
                    imgLink
                })    
            })
        })
    }

    //Check activity mode against manifest
    this.checkActivityMode = function(directorActivityHash) {
        return new Promise((resolve, reject) => {
            let activityHash = directorActivityHash & 0xFFFFFFFF;
            let table = 'DestinyActivityDefinition';
            let sql = `SELECT json FROM ${table} WHERE id = ${activityHash}`;
            db.get(sql, (err, row) => {
                if(err) {
                    console.log(err)
                    return reject(err);
                }
                const decodedData = JSON.parse(row.json);
                const decodedItem = decodedData.displayProperties;
                //console.log(decodedItem)
                return resolve({
                    description: decodedItem.description, 
                    name: decodedItem.name,
                    icon: decodedItem.icon
                })    
            })
        })
    }
}