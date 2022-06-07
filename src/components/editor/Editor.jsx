import React from 'react';
import ToolButton from '../buttons/ToolButton';
// function useTrackMouse() {
//     const [mouse, setMouse] = React.useState({ x: null, y: null })
    
//     React.useEffect(() => {

//     },[])
// }

 
export default function Editor({handleClick}) {

    return <div id='editor'>
        <div id='tools'>
            <ul>
                <ToolButton id='start-game'handleClick={handleClick} text='start-game' />
                <ToolButton id='place-path' handleClick={handleClick} text='place-path' />
                <ToolButton id='place-start' handleClick={handleClick} text='place-start' />
                <ToolButton id='place-end'handleClick={handleClick} text='place-end'/>
            </ul>
            <ul>
                <ToolButton id='place-wall' handleClick={handleClick} text='place-wall' />
                <ToolButton id='remove-tower' handleClick={handleClick} text='remove-tower' />
            </ul>
        </div>
        <div>
            <h2 id='money'></h2>
        </div>
    </div>
}