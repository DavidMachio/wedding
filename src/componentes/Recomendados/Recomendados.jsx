import "./Recomendados.css"
import { bannersdown } from "../../data/bannerdown";

const Recomendados = () => {
  return (
    <section className="section-recomendados">
      <article className="recomendados">
        {bannersdown.map((banner) => <div className="recomendados-card" key={banner.title}>
          <img src={banner.img} alt="" />
          <h3>{banner.title}</h3>

        </div>)}
      </article>
    </section>
  )
}
export default Recomendados;
