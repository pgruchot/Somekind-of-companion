import React, { useState } from 'react'
import Players from './Players';
import axios from 'axios'

export default function Game(props) {
    const [players, setPlayers] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ display, setDisplay ] = useState(true);
    const fetchPlayers = (e) => {
        e.preventDefault();
        axios.get(`../../profile/history/match/${props.map.instanceId}`)
        .then((res) => {
            setPlayers(res.data);
        }).then(() => {
            setLoading(false)
        });
    };
    return (
         <div className="match-box">
                        <img className="match-box-map" src={`https://www.bungie.net${props.map.activityMap.imgLink}`} alt=""/>
                        <img className="match-box-mode" src={`https://www.bungie.net${props.map.activityMode.icon}`} alt=""/>
                        <a href="#" onClick={(e) => {
                            if(!players[0]){
                                fetchPlayers(e);
                                setLoading(true);
                            }else{
                                setDisplay(!display);
                            }
                            }} className="match-box-title">
                            <h3>{props.map.activityMode.name}</h3>
                            <p>on</p>
                            <h3>{props.map.activityMap.name}</h3>
                            <h3><span>{props.map.activityResult}</span></h3>
                        </a>
                        
                        {loading ?
                            <div className="lds-facebook"><div></div><div></div><div></div></div>
                            :
                            null}
                        {
                            players[0]? <div className={display?"display active": "display"}>
                                    <ul className="descriptions">
                                        <li>player</li>
                                        <li>kills</li>
                                        <li>deaths</li>
                                        <li>score</li>
                                        <li>efficiency</li>
                                        <li>kd</li>
                                        <li>kda</li>
                                    </ul>
                                    <Players players={players} />
                                </div>
                                :
                                null
                        }
                    </div>
    )
}
