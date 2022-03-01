import { useState } from "react"
import './App.css';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import Slider from "./components/Slider";

function App() {
  const [perception, setPerception] = useState<number>(100);
  const [avoidance, setAvoidance] = useState<number>(0.4);
  
  const [cohesionFactor, setCohesionFactor] = useState<number>(0.001);
  const [alignmentFactor, setAlignmentFactor] = useState<number>(0.5);
  const [separationFactor, setSeparationFactor] = useState<number>(0.5);

  return (
    <div className="App">
      <h1>Boids Demo</h1>
      <Canvas 
        perception={perception} 
        closePerception={avoidance}

        cohesionFactor={cohesionFactor}
        alignmentFactor={alignmentFactor}
        seperationFactor={separationFactor}
      />
      <div className="settings">        
        <Slider name={"Cohesion"}   min={0} max={1} step={0.001} initial={0.001} setValue={setCohesionFactor}/>
        <Slider name={"Alignment"}  min={0} max={1} step={0.001} initial={0.5} setValue={setAlignmentFactor}/>
        <Slider name={"Separation"} min={0} max={1} step={0.001} initial={0.5} setValue={setSeparationFactor}/>

        <Slider name={"Visual Range"} min={1} max={200} initial={100} setValue={setPerception}/>
        <Slider name={"Avoidance Range"} min={0} max={1} step={0.05} initial={0.5} setValue={setAvoidance}/>
      </div>
    </div>
  );
}

export default App;
