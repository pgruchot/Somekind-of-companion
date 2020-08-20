import React, { useEffect, useContext } from 'react'
import axios from 'axios';
import { AuthContext } from '../Contexts/AuthContext';
import uuid from 'uuid/v1'

export default function SelectPlatformComponent() {
    const { platforms, selectedPlatform, setSelectedPlatform, setMembershipType, setMembershipId, setProfileName } = useContext(AuthContext);
    const searchForProfile = () => {
        let name, platform;
        const platformContains = (word) => {
            return JSON.stringify(selectedPlatform).includes(word);
        }

        switch (true) {
            case platformContains("psn"):
                name = selectedPlatform.psn
                platform = 1;
                break;
            case platformContains("xbox"):
                name = selectedPlatform.xbox
                platform = 2;
                break;
            case platformContains("pc"):
                name = selectedPlatform.pc
                platform = 3;
                break;
            default:
                console.log("undefined kapp");
        }

        axios.post('/profile/search', {
            name: name,
            membershipType: platform
        }).then((res) => {
            console.log('dziala')
            setMembershipId(res.data.profile[0].membershipId);
            setMembershipType(res.data.profile[0].membershipType);
            setProfileName(res.data.profile[0].displayName);
        })
    };
    useEffect(() => {
        if(selectedPlatform) {
            console.log(selectedPlatform)
            searchForProfile();
        }

    }, [selectedPlatform]);
    
    return (
        <div className="select-platform">
            {
                platforms ? 
                    <div className="select-platform-center">
                        {platforms.map(platform => {
                            return selectedPlatform === platform ? 
                                <a key={uuid()} onClick={() => {
                                setSelectedPlatform(platform)
                                //searchForProfile();
                                }} className="active-btn" href="#">{Object.keys(platform)}</a>
                             : 
                                <a key={uuid()} onClick={() => {
                                setSelectedPlatform(platform)
                                //searchForProfile();
                                }} className="" href="#">{Object.keys(platform)}</a>    
                        })}
                    </div>
                : <div>
                    Loading platforms...
                </div>}
        </div>
        
    )
}
