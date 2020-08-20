const requestPromise = require('request-promise');
const https = require('https');
const keys = require('./keys');

module.exports = function() { 
  //Retrieve profile data
  this.searchProfiles = async function(name, membershipType) {
    const requestOptions = {
        method: 'GET',
        uri: 'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/'+membershipType+'/' + name + '/',
        headers: {
            'X-API-KEY': keys.bungieAPI.APIKey
          },
        json: true,
      };
    const APIResponse = await requestPromise(requestOptions);
    if(!APIResponse.Response)
      return null;
    return APIResponse.Response;
  }

  //Retrieve profile with character data
  this.getProfile = async function(membershipId, membershipType) {
      const requestOptions = {
          method: 'GET',
          uri: 'https://www.bungie.net/Platform/Destiny2/'+membershipType+'/Profile/'+ membershipId + '/?components=100',
          headers: {
              'X-API-KEY': keys.bungieAPI.APIKey
            },
          json: true,
      };
      const APIResponse = await requestPromise(requestOptions);
      return APIResponse.Response;
  }

  //Retrieve character specific data
  this.getCharacterMisc = async function(membershipId, membershipType, characterId) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://www.bungie.net/Platform/Destiny2/'+membershipType+'/Profile/'+membershipId+'/Character/'+characterId+'/?components=200,205',
      headers: {
          'X-API-KEY': keys.bungieAPI.APIKey
        },
      json: true,
    };
    const APIResponse = await requestPromise(requestOptions);
    return APIResponse.Response;
  }

// this.getCharacterInventory = async function(membershipId,characterId) {
//   const requestOptions = {
//     method: 'GET',
//     uri: 'https://www.bungie.net/Platform/Destiny2/2/Profile/'+membershipId+'/Character/'+characterId+'/?components=205',
//     headers: {
//         'X-API-KEY': keys.bungieAPI.APIKey
//       },
//     json: true,
//   };
//   const APIResponse = await requestPromise(requestOptions);
//   console.log(APIResponse.Response.equipment.data)
//   return APIResponse.Response.equipment.data;
// }

  //Retrieve instanced item info
  this.getItemInfo = async function(membershipId, membershipType, itemInstanceId) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://www.bungie.net/Platform/Destiny2/'+membershipType+'/Profile/'+membershipId+'/Item/'+itemInstanceId+'/?components=300,302,304,305',
      headers: {
          'X-API-KEY': keys.bungieAPI.APIKey
        },
      json: true,
    };
    const APIResponse = await requestPromise(requestOptions);
    return APIResponse.Response;
  }

  //Retrieve profile statistics
  this.getProfileStats = async function(membershipId, membershipType) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://www.bungie.net/Platform/Destiny2/'+ membershipType +'/Account/'+ membershipId +'/Stats/',
      headers: {
          'X-API-KEY': keys.bungieAPI.APIKey
        },
      json: true,
    };
    const APIResponse = await requestPromise(requestOptions);
    return APIResponse.Response.mergedAllCharacters.results;
  }

  //Retrieve activities list
  this.getActivities = async function(membershipId, membershipType, characterId, mode) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://www.bungie.net/Platform/Destiny2/'+membershipType+'/Account/'+membershipId+'/Character/'+characterId+'/Stats/Activities/?mode='+mode,
      headers: {
          'X-API-KEY': keys.bungieAPI.APIKey
        },
      json: true,
    };
    const APIResponse = await requestPromise(requestOptions);
    return APIResponse.Response.activities;
  }

  //Retrieve instanced match info
  this.getMatch = async function( instanceId ) {
    const requestOptions = {
      method: 'GET',
      uri: 'https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/'+instanceId+'/',
      headers: {
          'X-API-KEY': keys.bungieAPI.APIKey
        },
      json: true,
    };
    const APIResponse = await requestPromise(requestOptions);
    //console.log(APIResponse.Response.entries);
    return APIResponse.Response.entries;
  }
}