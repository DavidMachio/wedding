import { useEffect, useState } from "react";
import "../CountDown/Countdown.css";

const WEDDING_DATE = "2026-05-08T13:00:00+02:00";

const getTimeLeft = () => {
  const difference = new Date(WEDDING_DATE).getTime() - Date.now();

  if (difference <= 0) {
    return {
      dias: "00",
      horas: "00",
      minutos: "00",
      segundos: "00",
      finished: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const dias = Math.floor(totalSeconds / (60 * 60 * 24));
  const horas = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutos = Math.floor((totalSeconds % (60 * 60)) / 60);
  const segundos = totalSeconds % 60;

  return {
    dias: String(dias).padStart(2, "0"),
    horas: String(horas).padStart(2, "0"),
    minutos: String(minutos).padStart(2, "0"),
    segundos: String(segundos).padStart(2, "0"),
    finished: false,
  };
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="section-countdown">
      <h3>{timeLeft.finished ? "HA LLEGADO EL DIA" : "FALTAN:"}</h3>
      <article className="article-countdown">
        <div className="div-date-countdown">
          <p className="numerico-countdown">{timeLeft.dias}</p>
          <p className="texto-countdown">Días</p>
        </div>
        <div className="div-date-countdown">
          <p className="numerico-countdown">{timeLeft.horas}</p>
          <p className="texto-countdown">Horas</p>
        </div>
        <div className="div-date-countdown">
          <p className="numerico-countdown">{timeLeft.minutos}</p>
          <p className="texto-countdown">Minutos</p>
        </div>
        <div className="div-date-countdown">
          <p className="numerico-countdown">{timeLeft.segundos}</p>
          <p className="texto-countdown">Segundos</p>
        </div>
      </article>
    </section>
  );
};

export default Countdown;
