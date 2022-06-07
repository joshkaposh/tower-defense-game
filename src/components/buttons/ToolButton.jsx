
export default function ToolButton({id,text, handleClick}) {
    return <button id={id} type='button' value={text} onClick={handleClick}>{text}</button>
}