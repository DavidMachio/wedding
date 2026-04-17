import "./Cardinfo.css";

const Cardinfo = ( {title, time, lugar, description}) => {
  return (
    <article className="article-cardinfo">
        
        <div className="div-cardinfo">
          <h2 className="cardinfo-title">{title}</h2>
          <p className="cardinfo-hora">{time}</p>
          <h5 className="cardinfo-lugar">
            {lugar}
          </h5>
          <p className="cardinfo-descripcion">
            {description}
          </p>
        </div>
        <button className="button-map">Ver lugar</button>
      
      
        
     
    </article>
  );
};
export default Cardinfo;
