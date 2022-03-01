import React, { useRef, useState } from 'react'
import "./slider.css"

interface Props {
    name: string;
    min: number;
    max: number;
    step?: number;
    initial?: number;
    setValue: (value: React.SetStateAction<number>) => void;
    tooltip ?: string;
    
}

const Slider: React.FC<Props> = ({ 
    name,
    min,
    max,
    step = 1,
    initial,
    setValue,
 }) => {
    const rangeMax: number = Math.floor(max / step)
    const rangeMin: number = Math.floor(min / step)

    const inputRef = useRef<HTMLInputElement | null>(null)
    const [inputValue, setInputValue] = useState<number>((!initial) ? ((rangeMax - rangeMin) / 2) : (initial / step))
    
    function handleChange(event: any) {
        const value: number = (event.target.value) * step 

        setValue(value)
        setInputValue(event.target.value)
    }

    return (
        <div className="slider-container">
            <p>{name}</p>
            <input ref={inputRef} type="range" min={rangeMin} max={rangeMax} value={inputValue} className="slider" onChange={handleChange}/>
            <p>{(inputValue * step).toFixed(3)}</p>
        </div>
    )
}

export default Slider