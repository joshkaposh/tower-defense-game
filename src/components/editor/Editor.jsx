import React from 'react';

// function useTrackMouse() {
//     const [mouse, setMouse] = React.useState({ x: null, y: null })
    
//     React.useEffect(() => {

//     },[])
// }

function ToolButton({id,text, handleClick}) {
    return <button id={id} type='button' value={text} onClick={handleClick}>{text}</button>
}
 
export default function Editor({handleClick}) {

    return <div id='editor'>
        <div id='tools'>

            <ul>
                <ToolButton id='start-game'handleClick={handleClick} text='start-game' />

                <ToolButton id='build-path'handleClick={handleClick} text='build-path' />

                <ToolButton id='place-start'handleClick={handleClick} text='place-start' />
                <ToolButton id='place-end'handleClick={handleClick} text='place-end'/>
                <ToolButton id='place-path' handleClick={handleClick} text='place-path' />
            </ul>
            <ul>
                <ToolButton id='place-wall' handleClick={handleClick} text='place-wall' />
                <ToolButton id='place-tower' handleClick={handleClick} text='place-tower' />
                <ToolButton id='remove-tower' handleClick={handleClick} text='remove-tower' />
            </ul>
        
        </div>
        
        <div>
            <h2 id='money'></h2>
        </div>
    </div>
}