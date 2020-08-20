import React, { useState, useContext } from 'react';
import { MembershipContext } from '../Contexts/MembershipContext';
import axios from 'axios';
import uuid from 'uuid/v1';


export default function Stats() {
    const [ statsPvE, setStatsPvE ] = useState([]);
    const [ statsPvP, setStatsPvP ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ display, setDisplay ] = useState(true);
    const { membershipId, membershipType } = useContext(MembershipContext);
    const fetchStats = (e) => {
        e.preventDefault();
        axios.get(`../../profile/stats/${membershipId}/${membershipType}`)
        .then((res) => {
            setStatsPvE(res.data.statsPvE);
            setStatsPvP(res.data.statsPvP);
        }).then(()=> {
            setLoading(false);
        });
    };



    return <div>
        <a href="#" onClick={(e) => {
            if(!statsPvP[0]){
                fetchStats(e);
                setLoading(true);
            }else{
                setDisplay(!display);
            }
            }} 
        className="btn">Stats</a>
        {loading?
            <div className="lds-facebook"><div></div><div></div><div></div></div>
            :
            null}
        {
            statsPvP[0] ?
            <div className={display?"display active": "display"}>
            {
                <div> 
                    <div className="bottom-container-stats">
                        <div className="bottom-container-stats-header">
                            <h2>Aggregated PvE</h2>
                        </div>
                        <ul>
                            {
                                statsPvE.map((stat) => {
                                    return <li key={uuid()}>
                                        <h3>{stat.basic.displayValue}</h3>
                                        <p>{stat.statId}</p>
                                    </li>        
                                })
                            }
                        </ul>
                    </div>
                    <div className="bottom-container-stats">
                        <div className="bottom-container-stats-header">
                            <h2>Aggregated PvP</h2>
                        </div>
                        <ul>
                            {
                                statsPvP.map((stat) => {
                                    return <li key={uuid()}>
                                        <h3>{stat.basic.displayValue}</h3>
                                        <p>{stat.statId}</p>
                                    </li>        
                                })
                            }
                        </ul>
                    </div>
                </div>
            }
        </div>
        :
        null
        }
    </div> 
    
    
   
}
