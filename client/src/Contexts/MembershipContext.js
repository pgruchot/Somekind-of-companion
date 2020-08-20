import React, { createContext, useState } from 'react'

export const MembershipContext = createContext();

export default function MembershipContextProvider(props) {
    const [ membershipId, setMembershipId ] = useState('');
    const [ membershipType, setMembershipType ] = useState('')
    const [ mainCharacter, setMainCharacter] = useState('')
    const [ profileName, setProfileName ] = useState('')

    return (
        <MembershipContext.Provider value={{
            membershipId, 
            setMembershipId: (id) => {
                setMembershipId(id);
            }, 
            membershipType,
            setMembershipType: (type) => {
                setMembershipType(type);
            },
            mainCharacter,
            setMainCharacter: (id) => {
                setMainCharacter(id);
            },
            profileName,
            setProfileName: (name) => {
                setProfileName(name);
            }}}>
            {props.children}
        </MembershipContext.Provider>
    )
}
