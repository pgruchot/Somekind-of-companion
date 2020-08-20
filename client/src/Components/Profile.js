import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import { MembershipContext } from '../Contexts/MembershipContext';
import { AuthContext } from '../Contexts/AuthContext';

export default function Profile(props) {
    const [ profile, setProfile ] = useState(null);
    
    const { match: { params } } = props;
    let { guardian, platform } = params;
    const { setMembershipType, setMembershipId, setProfileName } = useContext(MembershipContext)
    const { logout, isAuth } = useContext(AuthContext)
    let history = useHistory();
    useEffect(() => {
        axios.post('/profile/search', {
            name: guardian,
            membershipType: platform
        }).then((res) => {
            if(!res.data.profile[0]){
                history.push("/");
            }
            else {
                setProfile(res.data.profile[0]);
                setMembershipId(res.data.profile[0].membershipId);
                setMembershipType(res.data.profile[0].membershipType);
                setProfileName(res.data.profile[0].displayName);
            }
            
        })
      }, []);

    return profile ? 
        <div>
            {
                isAuth ? 
                    <div className="icon-bar">
                        <a onClick={(e) => logout(e)}><i className="material-icons">arrow_back</i></a>
                        <Link to="/dashboard"><i className="material-icons">person</i></Link>
                        <Link to="/"><i className="material-icons">home</i></Link>
                    </div> :
                    <div className="icon-bar">
                        <Link to="/"><i className="material-icons">home</i></Link>
                    </div> 
            }
            <div className="profile">
                <p className="profile-p">Looking @</p>
                <h1 className="profile-h1">{profile.displayName}</h1>
                <img className="profile-img" src={"https://bungie.net"+profile.iconPath} alt=""></img>
            </div>   
        </div> : 
        <p>Loading...</p>
}
