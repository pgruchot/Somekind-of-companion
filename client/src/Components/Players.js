import React from 'react'
import uuid from 'uuid/v1'

export default function Players(props) {
    return (
        <ul className="players">
            {
                props.players.map(player => {
                    return <li key={uuid()} className="player-list">
                        <img className="player-img" src={`https://www.bungie.net${player.playerIcon}`} alt=""/>
                        <p className="nickname">{player.player}</p>
                        <p>{player.kills}</p>
                        <p>{player.deaths}</p>
                        <p>{player.score}</p>
                        <p>{player.efficiency}</p>
                        <p>{player.killsDeathsRatio}</p>
                        <p>{player.killsDeathsAssists}</p>
                    </li>
                })
            }
        </ul>
    )
}
