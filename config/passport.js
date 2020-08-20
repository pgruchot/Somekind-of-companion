const passport = require('passport');
const User = require('../models/user');
const OAuth2Strategy = require('passport-oauth2');
const keys = require('./keys')
const request = require('request')

//Changing strategy prototype to include a call needed to get basic account information after login
OAuth2Strategy.prototype.userProfile = function (token, done) {
    var options = {
        url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
        headers: {
            'X-API-Key': keys.bungieAPI.APIKey,
            'Authorization': 'Bearer ' + token,
        }
    };

    request(options, callback);

    function callback(error, response, body) {
        if (error || response.statusCode !== 200) {
            return done(error);
        }
        var info = JSON.parse(body);
        return done(null, info.Response);
    }
};

//Serialization process
passport.serializeUser((user, done) => {
    done(null, user.membershipId);
});

passport.deserializeUser((id, done) => {
    User.findOne({"membershipId": id}, function(err, user) {
        done(err, { membershipId: user.membershipId, displayName: user.displayName, profilePicture: user.profilePicture, platforms: user.platforms.filter((platform) => {
            return platform !== null
        }) });
    });
})

//Configuring oauth2 strategy
passport.use('oauth2', new OAuth2Strategy({
        tokenURL: 'https://www.bungie.net/Platform/App/OAuth/token/',
        authorizationURL: keys.bungie.authorizationURL,
        clientID: keys.bungie.clientID,
        callbackURL: 'https://localhost:5000/auth/bungie/callback',
    },
    (token, refreshToken, profile,  done) => {
        console.log(profile)
            process.nextTick(() => {
                User.findOne({ 'membershipId' : profile.user.membershipId }, (err, user) => {
                    if(err)
                        return done(err);
                    if(user){
                        user.token = token;
                        user.save((err) => {
                            if(err) {
                                throw err;
                            }
                        });
                        console.log(user)
                        return done(null, user);
                    }
                    else {
                        const newUser = new User();
                        newUser.membershipId = profile.user.membershipId;
                        newUser.token = token;
                        newUser.displayName = profile.user.displayName;
                        newUser.profilePicture = profile.user.profilePicturePath;
                        newUser.platforms =
                            [
                             {"psn": profile.psnId ? 
                                  profile.psnId : null},
                             {"xbox": profile.gamerTag ? 
                                 profile.gamerTag : null},
                             {"pc": profile.steamDisplayName ? 
                                 profile.steamDisplayName : null}
                            ]
                        newUser.save((err) => {
                            if(err)
                                throw err;
                            console.log(newUser)
                            return done(null, newUser);
                        })
                    }
                })
            })
    }
))

module.exports = passport;