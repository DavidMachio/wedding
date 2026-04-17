import Portada from "../../componentes/Portada/Portada";
import "./Home.css";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <main className="home-main">
      <Portada />
      <section className="seccion-detalles">
        <section className="section-info ceremonia">
          <h2>Ceremonia</h2>
          <p>13:00 h</p>
          <p>Ayuntamiento de El Viso de San Juan</p>
          <p>Plaza de la Nación Española 1</p>
          <p>(45215) El Viso De San Juan</p>

          <a href="https://maps.app.goo.gl/pqNMmf36KuCEiwxZ6" target="_blank">
            COMO LLEGAR
          </a>
        </section>
        <section className="section-info celebracion">
          <h2>Celebración</h2>
          <p>14:30 h aprox</p>
          <p>Restaurante Solarino</p>
          <p>C. Gardenia, 2</p>
          <p>(28970) Humanes de Madrid, Madrid</p>

          <a href="https://maps.app.goo.gl/LQ5b5cv9SVrh3Hmz5" target="_blank">
            COMO LLEGAR
          </a>
        </section>
        <section className="section-info asistencia">
          <img src="textura.jpg" alt="" />

          <h2>Asistencia</h2>
          <p>¿Te apetece acompañarnos en este día tan importante?</p>
          <p>
            Por favor, confirma tu asistencia rellenando un pequeño formulario
            donde también podrás elegir tu menú.
          </p>
          <p>¡Gracias de corazón por formar parte de nuestro día!</p>
          <a
            href="https://forms.gle/Vd1io7bfTKCbssRi6"
            target="_blank"
          >
            CONFIRMAR
          </a>
        </section>
        <section className="section-info">
          <h2>Imágenes</h2>
          <p>
            Seguro que durante el día haréis un montón de fotos preciosas. Si os
            apetece, nos encantaría que las compartierais con nosotros para
            guardar todos esos recuerdos tan especiales.
          </p>
          <NavLink to={"fotos"}>IMAGENES</NavLink>
        </section>
      </section>
    </main>
  );
};
export default Home;
