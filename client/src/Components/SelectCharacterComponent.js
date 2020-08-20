import React, { useContext, useEffect, useState } from 'react'
import uuid from 'uuid/v1'
import { AuthContext } from '../Contexts/AuthContext';
import { MembershipContext } from '../Contexts/MembershipContext'
import axios from 'axios'

export default function SelectCharacterComponent() {
    const [ characters, setCharacters ] = useState([]);
    const { selectedPlatform, membershipType, membershipId, mainCharacter, setMainCharacter } = useContext(AuthContext);
    const { setMembershipId, setMembershipType } = useContext(MembershipContext);
    const fetchCharacters = () => {
        console.log('fetch'+membershipType, membershipId)
        axios.get(`/profile/search/basic/${membershipId}/${membershipType}`)
        .then((res) => {
            setCharacters(res.data.characterMiscArray);
            setMembershipId(membershipId);
            setMembershipType(membershipType);
        })
    }; 
    useEffect(() => {
        if(selectedPlatform&&membershipType) {
            fetchCharacters();
        }

    }, [membershipType, membershipId]);
    return (
        <div className="select-platform">
        { selectedPlatform ? 
            <div className="select-platform-center">
                {
                    characters.map((character) => {
                        return mainCharacter === character.characterId ? 
                            <a key={uuid()} onClick={() => {
                            setMainCharacter(character.characterId)
                            }} className="active-btn" href="#">{character.class+' '+character.light}</a>
                         : 
                            <a key={uuid()} onClick={() => {
                            setMainCharacter(character.characterId)
                            }} href="#">{character.class+' '+character.light}</a>
                    })
                }
            </div>
            : <div><h4 className="prompt">Select Platform & Character</h4></div>
            }
        </div>
    )
}
