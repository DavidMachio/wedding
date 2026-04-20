import Countdown from "../CountDown/Countdown";
import "./Portada.css";

const Portada = () => {
  return (
    <section>
      <div className="portada-component">
      <img src="textura2.avif" alt="" />
        <h1>DAVID & CANDELA</h1>
        <p>08 Mayo 2026</p>
    </div>
  <Countdown/>
    
    </section>
  );
};
export default Portada;
