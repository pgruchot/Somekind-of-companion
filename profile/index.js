const express = require('express');
const router = express.Router();

//Importing methods needed to get data from API or manifest
require('../config/APICalls.js')();
require('../config/manifestCalls')();

//Route for profile check
router.post('/search', (req, res) => {
    const { name, membershipType } = req.body;
    const APIResponse = searchProfiles(name, membershipType).then((profile) => {
        res.json({ profile });
    });
})

//Route for retrieving player characters with emblems
router.get('/search/basic/:membershipId/:membershipType', async (req, res) => {
    const { membershipId, membershipType } = req.params;
    const APIResponse = await getProfile(membershipId, membershipType);
    const characterArray = APIResponse.profile.data.characterIds;
    const characterMiscArray = await Promise.all(characterArray.map( async (characterId) => {
        const characterMisc = await getCharacterMisc(membershipId, membershipType, characterId);
        const characterInfo = characterMisc.character.data;
        const class_ = await checkClass(characterInfo.classHash);
        return ({ 
            characterId: characterInfo.characterId,
            light: characterInfo.light, 
            class: class_, 
            emblemPath: characterInfo.emblemPath, 
            emblemBackgroundPath: characterInfo.emblemBackgroundPath, 
        })
    }));
    res.json({characterMiscArray});
})

//Route for retrieving player game history
router.get('/history/:membershipId/:membershipType/:characterId/:mode', async (req, res) => {
    const { membershipId, membershipType, characterId, mode } = req.params;
    const APIResponse = await getActivities(membershipId, membershipType, characterId, mode);
    const activityArray = await Promise.all(APIResponse.map( async (activity) => {
        //console.log(activity.activityDetails.referenceId)
        const activityMap = await checkActivityMap(activity.activityDetails.referenceId);
        //console.log(activityMap)
        const activityMode = await checkActivityMode(activity.activityDetails.directorActivityHash);
        const activityResult = activity.values.standing.basic.displayValue;
        //console.log(activity.values)
        return ({
            instanceId: activity.activityDetails.instanceId,
            activityMap,
            activityMode,
            activityResult
        })
    }))
    res.json(activityArray)
})

//Route for retrieving particular match data
router.get('/history/match/:instanceId', async (req, res) => {
    const { instanceId } = req.params;
    const APIResponse = await getMatch(instanceId);
    //console.log(APIResponse)
    const players = APIResponse.map((entry) => {
        //console.log(entry)
        return({
            standing: entry.standing,
            player: entry.player.destinyUserInfo.displayName,
            playerIcon: entry.player.destinyUserInfo.iconPath,
            kills: entry.values.kills.basic.displayValue,
            deaths: entry.values.deaths.basic.displayValue,
            score: entry.values.score.basic.displayValue,
            efficiency: entry.values.efficiency.basic.displayValue,
            killsDeathsRatio: entry.values.killsDeathsRatio.basic.displayValue,
            killsDeathsAssists: entry.values.killsDeathsAssists.basic.displayValue,
        })
    })
    res.json(players)
    //console.log(APIResponse);
})

//Route for retrieving character inventory and specifics
router.get('/search/:membershipId/:membershipType', async (req, res) => {
    const { membershipId, membershipType } = req.params;
    const APIResponse = await getProfile(membershipId, membershipType);
    const characterArray = APIResponse.profile.data.characterIds;
    const characterMiscArray = await Promise.all(characterArray.map( async (characterId) => {
            const characterMisc = await getCharacterMisc(membershipId, membershipType, characterId);
            const characterInfo = characterMisc.character.data;
            const characterInventory = characterMisc.equipment.data.items;
            let class_ = await checkClass(characterInfo.classHash);
            let race = await checkRace(characterInfo.raceHash);
            let gender = await checkGender(characterInfo.genderHash);
            const items = await Promise.all( characterInventory.map( async (item) => {
                const basicItemInfo = await checkBasicItemInfo(item.itemHash);
                if(basicItemInfo !== null) {
                    const itemResponse = await getItemInfo(membershipId, membershipType, item.itemInstanceId);
                    const instancedInfo = await checkItem(itemResponse);
                    return ({ ...basicItemInfo, ...instancedInfo})
                }
            }));
            return ({ 
                characterId: characterInfo.characterId,
                light: characterInfo.light, 
                race: race, 
                gender: gender, 
                class: class_, 
                emblemPath: characterInfo.emblemPath, 
                emblemBackgroundPath: characterInfo.emblemBackgroundPath, 
                items: items })
        }));
    res.json({ characterMiscArray });
})

//Route for retrieving profile stats
router.get('/stats/:membershipId/:membershipType', async (req, res) => {
    const { membershipId, membershipType } = req.params;
    //console.log(membershipId, membershipType)
    const APIResponse = await getProfileStats(membershipId, membershipType);
    //console.log(APIResponse)
    const allPvE = APIResponse.allPvE.allTime;
    const allPvP = APIResponse.allPvP.allTime;
    res.json({ statsPvE: [
        allPvE.activitiesCleared,
        allPvE.assists,
        allPvE.kills,
        allPvE.secondsPlayed,
        allPvE.deaths,
        allPvE.averageLifespan,
        allPvE.precisionKills,
        allPvE.killsDeathsRatio,
        allPvE.killsDeathsAssists,
        allPvE.objectivesCompleted,
        allPvE.opponentsDefeated,
    ], statsPvP: [
        allPvP.activitiesEntered,
        allPvP.activitiesWon,
        allPvP.assists,
        allPvP.kills,
        allPvP.secondsPlayed,
        allPvP.deaths,
        allPvP.averageLifespan,
        allPvP.precisionKills,
        allPvP.killsDeathsRatio,
        allPvP.killsDeathsAssists,
        allPvP.objectivesCompleted,
        allPvP.opponentsDefeated,
        allPvP.winLossRatio,
        allPvP.longestKillSpree,
        allPvP.longestSingleLife,
        allPvP.combatRating,
    ] })
})

module.exports = router;