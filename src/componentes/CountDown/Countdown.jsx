import "../CountDown/Countdown.css"

const Countdown = () => {


    return(
        <section className="section-countdown">
            <h3>FALTAN:</h3>
            <article className="article-countdown">
                <div className="div-date-countdown">
                    <p className="numerico-countdown">45</p>
                    <p className="texto-countdown">Días</p>
                </div>
                <div className="div-date-countdown">
                    <p className="numerico-countdown">10</p>
                    <p className="texto-countdown">Horas</p>
                </div>
                <div className="div-date-countdown">
                    <p className="numerico-countdown">37</p>
                    <p className="texto-countdown">Minutos</p>
                </div>
                <div className="div-date-countdown">
                    <p className="numerico-countdown">24</p>
                    <p className="texto-countdown">Segundos</p>
                </div>
            </article>

        </section>
    )
}
export default Countdown;