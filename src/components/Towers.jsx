import React from 'react';
import TowerButton from './buttons/TowerButton';
import towersJson from '../game/towers/towers.json'

export default function Towers({handleClick}) {

    return <ul id='towers'>
        {
            towersJson.map(tower => {
        return <TowerButton type={tower.type}  key={tower.name} id={tower.name} name={tower.name} handleClick={handleClick} />
    })}
    </ul>
    
}