import Cardinfo from "../../componentes/Cardinfo/Cardinfo";
import "./Evento.css";

const Evento = () => {
  return (
    <section className="container-evento">
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      <Cardinfo
      title="Ceremonia"
      time="13:00"
      lugar="Ayuntamiento El Viso de San Juan"
      description="La ceremonia se celebrara por el juzgado, en el ayuntamiento de
            nuestra localidad"/>
      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      <Cardinfo
      title="Celebración"
      time="14:00"
      lugar="Restaurante Solarino"
      description="La celebración será muy proxima al lugar de la ceremonia, a unos 15 minutos, en la localidad de Humanes, disfrutaremos de una comida familiar"/>
    </section>
    
  );
};

export default Evento;
