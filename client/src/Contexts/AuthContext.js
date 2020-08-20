import React, { createContext, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom'

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
    let history = useHistory();
    const [ isAuth, setIsAuth ] = useState(false);
    const [ bungieMembershipId, setBungieMembershipId ] = useState('');
    const [ name, setName ] = useState('');
    const [ profilePicture, setProfilePicture ] = useState('');
    const [ platforms, setPlatforms ] = useState([]);
    const [ selectedPlatform, setSelectedPlatform ] = useState(null);
    const [ selectedCharacter, setSelectedCharacter ] = useState('');
    const [ membershipId, setMembershipId ] = useState('');
    const [ membershipType, setMembershipType ] = useState('');
    const [ mainCharacter, setMainCharacter] = useState('');
    const [ profileName, setProfileName ] = useState('');

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth: () => {
                setIsAuth(true);
            },
            bungieMembershipId,
            setBungieMembershipId: (id) => {
                setBungieMembershipId(id);
            },
            name,
            setName: (name) => {
                setName(name);
            },
            profilePicture,
            setProfilePicture: (path) => {
                setProfilePicture('https://www.bungie.net'+path);
            },
            platforms,
            setPlatforms: (obj) => {
                setPlatforms(obj);
            },
            selectedPlatform,
            setSelectedPlatform: (obj) => {
                setSelectedPlatform(obj);
            },
            selectedCharacter,
            setSelectedCharacter: (id) => {
                setSelectedCharacter(id);
            },
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
            },
            logout: (e) => {
                e.preventDefault();
                axios.get('/auth/bungie/logout', (req,res) => {
                }).then(() => {
                    setIsAuth(false);
                    setBungieMembershipId('');
                    setProfilePicture('');
                    setName('');
                    setPlatforms([]);
                    setSelectedPlatform(null);
                    setSelectedCharacter('');
                    setMembershipType('');
                    setMembershipId('');
                    setMainCharacter('');
                    setProfileName('');
                    history.push('/');
                })
                
                

            }
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}
