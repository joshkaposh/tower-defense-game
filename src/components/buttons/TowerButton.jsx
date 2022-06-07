
export default function TowerButton({ id, name,type, handleClick }) {
    return <button id={id} data-tower={name} type='button' value={type} onClick={handleClick}>{name}</button>
}