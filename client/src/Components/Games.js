import React, { useState, useContext } from 'react';
import { MembershipContext } from '../Contexts/MembershipContext';
import axios from 'axios';
import uuid from 'uuid/v1';
import { AuthContext } from '../Contexts/AuthContext';
import Game from './Game';


export default function Games(props) {
    const [ games, setGames ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ display, setDisplay ] = useState(true);
    const { membershipId, membershipType} = useContext(MembershipContext);
    const { mainCharacter} = useContext(AuthContext);

    const fetchGames = (e) => {
        e.preventDefault();
        axios.get(`../../profile/history/${membershipId}/${membershipType}/${mainCharacter}/${props.mode}`)
        .then((res) => {
            setGames(res.data);
        }).then(() => {
            setLoading(false);
        });
    };
    return <div>
        <a href="#" onClick={(e) => {
            if(!games[0]){
                fetchGames(e);
                setLoading(true);
            }else{
                setDisplay(!display);
            }
            }} className="btn">{props.modeName}</a>
            {loading ? 
                <div className="lds-facebook"><div></div><div></div><div></div></div>
                :
                null}
            {games[0] ? <div className={display?"display active": "display"}>
                {
                    games.map((map) => {
                        return <Game key={uuid()} map={map}/>
                    })
                }
            </div>
            :
            null
            }
    </div> 
}
