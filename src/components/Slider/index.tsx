import React, { useRef, useState } from 'react'

interface Props {
    name: string;
    min: number;
    max: number;
    initValue?: number;
    sliderHandler: (current: number) => void;
    tooltip ?: string;
    
}

const Slider: React.FC<Props> = ({ 
    name,
    min,
    max,
    initValue,
    sliderHandler,
 }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [inputValue, setInputValue] = useState<string>("")
    
    function handleChange<HTMLInputElement>(event: any) {
        console.log(event.target.value);
    }

    return (
        <span className="slider-container">
            <p>{name}</p>
            <input ref={inputRef} type="range" min={0} max={1000} value={initValue} className="slider" onChange={handleChange}/>
        </span>
    )
}

export default Slider