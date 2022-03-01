import "./controlPanel.css"
import Slider from "../Slider"

const ControlPanel: React.FC = () => {
    
    function handleCohesion(current: number): void {
        console.log(current);
    }

    return (
        <div className="control-panel">
            <div className="logo">
                <h1>Boids</h1>
            </div>
            <div className="left-column">
            </div>
            <div className="right-column">
                <h2>Visual Range</h2>
                <h2>Avoid Ratio</h2>
            </div>
        </div>
    )
}

export default ControlPanel