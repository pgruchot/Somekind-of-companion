import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../Contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const { logout, setIsAuth, setBungieMembershipId, name, setName, profilePicture, setProfilePicture, setPlatforms } = useContext(AuthContext);
    useEffect(() => {
        axios.get('/auth/user', (req, res) => {}).then((res) => {
            console.log(res)
            const { user } = res.data;
            setIsAuth();
            setBungieMembershipId(user.membershipId);
            setName(user.displayName);
            setProfilePicture(user.profilePicture);
            setPlatforms(user.platforms);
        }).catch((err) => {
            console.log(err)
        })
    },[]);

    return( 
        <div> 
            <div className="icon-bar">
                <a onClick={(e) => logout(e)}><i className="material-icons">arrow_back</i></a>
                <Link to="/"><i className="material-icons">home</i></Link>
            </div>
            <div className="profile">
                <p className="profile-p">Looking @</p>
                <h1 className="profile-h1">{name}</h1>
                <img className="profile-img" src={profilePicture} alt=""></img>
            </div>
        </div>
    )
}
