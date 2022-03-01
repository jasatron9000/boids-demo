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
                <Slider name="Cohesion" min={0} max={1} sliderHandler={handleCohesion}/>
                <Slider name="Alignment" min={0} max={1} sliderHandler={handleCohesion}/>
                <Slider name="Separation" min={0} max={1} sliderHandler={handleCohesion}/>
            </div>
            <div className="right-column">
                <h2>Visual Range</h2>
                <h2>Avoid Ratio</h2>
            </div>
        </div>
    )
}

export default ControlPanel