import React, { useState, useContext } from 'react';
import { MembershipContext } from '../Contexts/MembershipContext';
import axios from 'axios';
import uuid from 'uuid/v1';

export default function Characters() {
    const [ characters, setCharacters ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ display, setDisplay ] = useState(true);
    const { membershipId, membershipType } = useContext(MembershipContext);
    const fetchCharacters = () =>{
        axios.get(`../../profile/search/${membershipId}/${membershipType}`)
        .then((res) => {
            setCharacters(res.data.characterMiscArray);
        }).then(() => {
            setLoading(false);
        })
    }

    return <div>
            <a href="#" onClick={() => {
                if(!characters[0]){
                    fetchCharacters();
                    setLoading(true);
                }else{
                    setDisplay(!display);
                }
                }} className="btn">Characters</a>
            {loading?
                <div className="lds-facebook"><div></div><div></div><div></div></div>
                :
                null}
            {characters[0] ? <div className={display?"display active": "display"}>
            {
                characters.map((character) => {
                    return <div className="bottom-container-character" key={uuid()}>
                        <div className="bottom-container-character-emblem">
                            <img src={`https://www.bungie.net${character.emblemBackgroundPath}`} alt=""></img>
                            <ul>
                                <li><img src={`https://www.bungie.net${character.emblemPath}`}  alt=""></img></li>
                                <li><span className="color-bg">{character.class}</span></li>
                                <li><span className="color-bg">{character.race}</span></li>
                                <li><span className="color-bg">{character.gender}</span></li>
                                <li><span className="color-bg">{character.light}</span></li>
                            </ul>
                        </div>
                        <ul class="bottom-container-character-items">
                            {
                                character.items.map((item) =>{
                                    return <li key={uuid()} className="item">
                                        <img class="item-icon" src={`https://www.bungie.net${item.icon}`} alt=""></img>
                                        <ul class="item-perks">
                                            {item.perks ? (item.perks.map((perk) =>{
                                                return <li className="perk" key={uuid()}><img className="perk-icon" src={`https://www.bungie.net${perk.icon}`} alt="perk"/><span className="perk-tooltip">{perk.name}<br/>{perk.description}</span></li>
                                            })):(null)} 
                                            {item.sockets ? (item.sockets.map((socket) =>{
                                                return <li className="perk" key={uuid()}><img className="perk-icon" src={`https://www.bungie.net${socket.icon}`} alt="perk"/><span className="perk-tooltip">{socket.name}<br/>{socket.description}</span></li>
                                            })):(null)} 
                                        </ul>
                                        <h2 className="item-name"><marquee behaviour="alternate" scrollamount="2" scrolldelay="50" >{item.name}</marquee> <br></br> {item.damageType ? ( item.damageType.name ) : (null)}</h2>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                })
            }
        </div> 
        : 
        null
        }
        </div>
        
     
}
