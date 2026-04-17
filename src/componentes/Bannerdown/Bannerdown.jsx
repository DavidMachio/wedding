import "./Bannerdown.css"
import { bannersdown } from "../../data/bannerdown"

const Bannerdown = () => {
  return (
    <article className="component">
      {bannersdown.map((banner) =>
        <section className="bannerdown" key={banner.title}>
          <img className="bannerdown-cover" src={banner.img} alt="" />
          <div className="bannerdown-info">
            <div className="bannerdown-text">
              <h2>{banner.title}</h2>
              <button className="light">Visitar</button>
            </div>

          </div>
        </section>)}


    </article>
  )
}
export default Bannerdown;