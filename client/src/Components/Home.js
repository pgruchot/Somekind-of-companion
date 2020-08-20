import React, { useContext, useState } from 'react'
import { AuthContext } from '../Contexts/AuthContext'
import { useHistory, Link } from 'react-router-dom'

export default function Home() {
    const thirdPartyLogin = () => {
        window.open("https://localhost:5000/auth/bungie/oauth", "_self");
    }

    const { isAuth, logout } = useContext(AuthContext);

    const [guardian, setGuardian] = useState('');
    const [platform, setPlatform] = useState(1);
    let history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push("/search/" + platform + "/" + guardian);
    };

    return (
        <div className="background-cover">
            {
                isAuth ? 
                    <div className="icon-bar">
                        <a onClick={(e) => logout(e)}><i className="material-icons">arrow_back</i></a>
                        <Link to="/dashboard"><i className="material-icons">person</i></Link>
                    </div> : null
            }
            <div className="logo">
                <h1 className="logo-h1"><span>Some</span> kind</h1>
                <p className="logo-p">of companion</p>
            </div>
            <div className="bottom-container-home">
                <h2 className="bottom-container-description">Search for guardians:</h2>
                <form onSubmit={handleSubmit} className="bottom-container-search-box">
                    <select onChange={(e) => setPlatform(e.target.value)} name="platform">
                        <option value="1">XBOX</option>
                        <option value="2">PS4</option>
                        <option value="3">PC</option>
                    </select>
                    <input onChange={(e) => setGuardian(e.target.value)} name="guardian" type="text" placeholder="Guardian"></input>
                    <button type="submit">></button>
                </form>
                {
                    !isAuth ? 
                        <a href="#" onClick={() => thirdPartyLogin()} className="btn">Login</a>
                        : null
                }
            </div>
        </div>
    )
}
