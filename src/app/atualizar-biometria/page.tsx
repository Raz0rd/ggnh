'use client';

import { useEffect } from 'react';
import Image from 'next/image';

// Declaração de tipo para o elemento customizado do Typebot
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'typebot-standard': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function AtualizarBiometriaPage() {
  useEffect(() => {
    // Carregar script do Typebot
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.37/dist/web.js';
      
      Typebot.initStandard({
        typebot: "validacnhs",
        apiHost: "https://sendbot.chat",
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Barra Gov.br */}
      <div id="barra-brasil">
        <div className="conteudo-barra-brasil">
          <a href="#" className="pic-gov" title="GovBR">GovBR</a>
          <nav id="menu-barra-brasil">
            <ul className="lista-barra-brasil">
              <li className="list-item">
                <a href="#" className="link-barra link-externo-barra">Acesso à informação</a>
              </li>
              <li className="espacador"></li>
              <li className="list-item">
                <a href="#" className="link-barra link-externo-barra">Participe</a>
              </li>
              <li className="espacador"></li>
              <li className="list-item">
                <a href="#" className="link-barra link-externo-barra">Serviços</a>
              </li>
              <li className="espacador"></li>
              <li className="list-item">
                <a href="#" className="link-barra link-externo-barra">Legislação</a>
              </li>
              <li className="espacador"></li>
              <li className="list-item">
                <a href="#" id="link-orgaos" className="link-barra link-externo-barra">Órgãos do Governo</a>
              </li>
            </ul>
          </nav>
          <a href="#" id="botao-seta-direita" className="botao-seta-direita">
            <i className="arrow right">Navegar para direita</i>
          </a>
        </div>
      </div>

      {/* Container Central */}
      <div className="container-center">
        <Image
          src="/govbr.svg"
          alt="Logo Gov.br"
          width={140}
          height={40}
          className="logo-gov"
        />

        <div className="card-typebot">
          <typebot-standard style={{ width: '100%', height: '600px' }}></typebot-standard>

          <div className="footer">
            <span>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h448v288z"></path>
              </svg>
              3.0.1213
            </span>
            <span>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"></path>
              </svg>
              3.0.4801
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Barra Gov.br */
        #barra-brasil div,
        #barra-brasil a,
        #barra-brasil ul,
        #barra-brasil li {
          margin: 0;
          padding: 0;
          font-size: 100%;
          font-family: inherit;
          vertical-align: baseline;
          font-size: 1rem;
        }

        #barra-brasil ul {
          list-style: none;
        }

        #barra-brasil {
          background-color: #1351B4;
          box-sizing: content-box;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
        }

        #barra-brasil .conteudo-barra-brasil {
          padding-top: 2px;
          height: 40px;
          width: 95%;
          max-width: 100vw;
          margin: 0 auto;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
        }

        #barra-brasil .pic-gov {
          background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2266%22%20height%3D%2214%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cdefs%3E%3Cpath%20id%3D%22a%22%20d%3D%22M9.367%204.374V.247H.37v4.127h8.997z%22%2F%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M7.602%2011.174a3.693%203.693%200%200%201-2.45.896c-.644%200-1.26-.114-1.848-.343a4.416%204.416%200%200%201-1.54-1.001%204.863%204.863%200%200%201-1.05-1.61C.453%208.481.322%207.758.322%206.946a4.851%204.851%200%200%201%201.47-3.521%205.092%205.092%200%200%201%201.617-1.05%205.205%205.205%200%200%201%202.009-.385c.448%200%20.877.049%201.288.147a4.495%204.495%200%200%201%202.086%201.12c.28.266.509.567.686.903l-2.03%201.554a2.289%202.289%200%200%200-.882-.945%202.362%202.362%200%200%200-1.246-.357%202.034%202.034%200%200%200-1.596.742c-.196.233-.35.511-.462.833a3.198%203.198%200%200%200-.168%201.057c0%20.392.056.747.168%201.064.112.317.268.59.469.819.2.229.441.406.721.532.28.126.593.189.938.189.793%200%201.493-.327%202.1-.98H5.768v-1.96h4.088V12H7.602v-.826zm8.078.91c-.756%200-1.442-.145-2.058-.434a5.092%205.092%200%200%201-2.604-2.758%205.008%205.008%200%200%201-.364-1.876c0-.653.126-1.283.378-1.89a5.018%205.018%200%200%201%201.057-1.603c.453-.462.99-.83%201.61-1.106.62-.275%201.3-.413%202.037-.413.756%200%201.442.145%202.058.434.616.29%201.143.672%201.582%201.148a5.151%205.151%200%200%201%201.015%201.624c.238.607.357%201.227.357%201.862a4.83%204.83%200%200%201-.378%201.883%205.1%205.1%200%200%201-1.05%201.596%205.165%205.165%200%200%201-1.603%201.113c-.62.28-1.3.42-2.037.42zm-2.254-5.04c0%20.336.047.66.14.973.093.313.233.59.42.833.187.243.422.439.707.588.285.15.623.224%201.015.224.392%200%20.733-.077%201.022-.231a2.07%202.07%200%200%200%20.707-.602%202.59%202.59%200%200%200%20.406-.847c.089-.317.133-.64.133-.966%200-.336-.047-.66-.14-.973a2.397%202.397%200%200%200-.427-.826%202.156%202.156%200%200%200-.686-.581%202.002%202.002%200%200%200-.959-.224c-.392%200-.733.077-1.022.231a2.054%202.054%200%200%200-.7.595%202.476%202.476%200%200%200-.413.84%203.682%203.682%200%200%200-.14.98zm13.272%204.87c-.644%200-1.241-.124-1.792-.371a4.456%204.456%200%200%201-1.414-.994%204.616%204.616%200%200%201-.938-1.435%204.477%204.477%200%200%201-.343-1.722V2.094h2.618v5.208c0%20.616.186%201.106.56%201.47.373.364.849.546%201.428.546.317%200%20.616-.059.896-.175.28-.117.528-.28.742-.49.215-.21.383-.462.504-.756.121-.294.182-.616.182-.966V2.094h2.618v5.298c0%20.616-.117%201.183-.35%201.701a4.478%204.478%200%200%201-.945%201.428%204.435%204.435%200%200%201-1.428%201.001c-.551.243-1.148.364-1.792.364zm10.78-.175l-3.696-9.66h2.688l2.436%206.706h.028l2.394-6.706h2.646l-3.696%209.66h-2.8zm16.34-4.76h-5.782c.047.429.161.803.343%201.12.182.318.411.581.686.791.275.21.588.364.938.462.35.098.714.147%201.092.147.579%200%201.092-.112%201.54-.336.448-.224.849-.541%201.204-.952l1.54%201.302a4.991%204.991%200%200%201-1.967%201.498c-.775.336-1.624.504-2.548.504-.7%200-1.358-.119-1.974-.357a4.89%204.89%200%200%201-1.617-1.022%204.813%204.813%200%200%201-1.092-1.61%205.304%205.304%200%200%201-.399-2.072c0-.672.135-1.302.406-1.89a4.791%204.791%200%200%201%201.099-1.554c.462-.448.998-.803%201.61-1.064a4.875%204.875%200%200%201%202.002-.399c.653%200%201.269.121%201.848.364.579.243%201.085.588%201.519%201.036.434.448.775.994%201.022%201.638.247.644.371%201.358.371%202.142v.392zm-5.782-1.638h3.416a2.563%202.563%200%200%200-.245-.791%202.123%202.123%200%200%200-.483-.644%202.236%202.236%200%200%200-.686-.434%202.176%202.176%200%200%200-.84-.161c-.317%200-.611.054-.882.161a2.23%202.23%200%200%200-.707.434%202.03%202.03%200%200%200-.476.644%202.425%202.425%200%200%200-.196.791zm10.262%206.398V2.094h2.408v1.274h.056a3.557%203.557%200%200%201%201.358-1.106c.56-.28%201.178-.42%201.855-.42.448%200%20.859.068%201.232.203.373.136.7.336.98.602.28.266.504.595.672.987.168.392.252.849.252%201.372v6.734h-2.618v-5.74c0-.579-.14-1.027-.42-1.344-.28-.317-.686-.476-1.218-.476-.653%200-1.174.21-1.561.63-.387.42-.58.98-.58%201.68v5.25h-2.618zm12.866.175c-.756%200-1.442-.145-2.058-.434a5.092%205.092%200%200%201-2.604-2.758%205.008%205.008%200%200%201-.364-1.876c0-.653.126-1.283.378-1.89a5.018%205.018%200%200%201%201.057-1.603c.453-.462.99-.83%201.61-1.106.62-.275%201.3-.413%202.037-.413.756%200%201.442.145%202.058.434.616.29%201.143.672%201.582%201.148a5.151%205.151%200%200%201%201.015%201.624c.238.607.357%201.227.357%201.862a4.83%204.83%200%200%201-.378%201.883%205.1%205.1%200%200%201-1.05%201.596%205.165%205.165%200%200%201-1.603%201.113c-.62.28-1.3.42-2.037.42zm-2.254-5.04c0%20.336.047.66.14.973.093.313.233.59.42.833.187.243.422.439.707.588.285.15.623.224%201.015.224.392%200%20.733-.077%201.022-.231a2.07%202.07%200%200%200%20.707-.602%202.59%202.59%200%200%200%20.406-.847c.089-.317.133-.64.133-.966%200-.336-.047-.66-.14-.973a2.397%202.397%200%200%200-.427-.826%202.156%202.156%200%200%200-.686-.581%202.002%202.002%200%200%200-.959-.224c-.392%200-.733.077-1.022.231a2.054%202.054%200%200%200-.7.595%202.476%202.476%200%200%200-.413.84%203.682%203.682%200%200%200-.14.98z%22%20fill%3D%22%23FFF%22%2F%3E%3Cg%20transform%3D%22translate(0%202.5)%22%3E%3Cmask%20id%3D%22b%22%20fill%3D%22%23fff%22%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%2F%3E%3C%2Fmask%3E%3Cpath%20d%3D%22M4.348%204.374h1.007L3.636.247H2.629L.91%204.374h1.007l.378-.896h1.675l.378.896zm-1.33-1.61l.56-1.33h.014l.56%201.33H3.018zm3.721.28c0%20.196.037.373.112.532.075.159.173.294.294.406.121.112.257.196.406.252.15.056.303.084.462.084a.95.95%200%200%200%20.42-.098c.14-.065.266-.154.378-.266h.014v.294h.896v-2.38c0-.196-.033-.378-.098-.546a1.283%201.283%200%200%200-.28-.448%201.36%201.36%200%200%200-.455-.308%201.542%201.542%200%200%200-.609-.112c-.317%200-.597.07-.84.21-.243.14-.448.35-.616.63l.784.336c.056-.121.145-.224.266-.308a.677.677%200%200%201%20.406-.126c.196%200%20.35.054.462.161.112.107.168.266.168.476v.056c-.121-.065-.252-.121-.392-.168a1.669%201.669%200%200%200-.462-.07c-.168%200-.336.028-.504.084a1.405%201.405%200%200%200-.448.252%201.228%201.228%200%200%200-.315.413%201.403%201.403%200%200%200-.119.595zm.952.154a.65.65%200%200%201%20.084-.343.628.628%200%200%201%20.217-.224.936.936%200%200%201%20.287-.126.952.952%200%200%201%20.588.028c.084.037.154.08.21.126v.546a.732.732%200%200%201-.217.224.56.56%200%200%201-.294.084.732.732%200%200%201-.252-.042.648.648%200%200%201-.203-.119.556.556%200%200%201-.14-.182.524.524%200%200%201-.049-.238z%22%20fill%3D%22%23FFF%22%20mask%3D%22url(%23b)%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          display: block;
          width: 66px;
          height: 14px;
          min-width: 66px;
          margin-right: 10px;
          line-height: 0;
          font-size: 0;
          color: transparent;
        }

        #barra-brasil .conteudo-barra-brasil nav {
          overflow-x: auto;
        }

        #barra-brasil .conteudo-barra-brasil nav ul {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
          width: auto;
          max-width: none;
        }

        #barra-brasil .conteudo-barra-brasil nav ul li.list-item {
          flex-shrink: 0;
        }

        #barra-brasil .conteudo-barra-brasil nav ul li.espacador {
          height: 20px;
          width: 1px;
          border-right: 1px solid rgba(151, 151, 151, 0.3);
          margin: 0 7px 0 20px;
        }

        #barra-brasil a {
          text-decoration: none;
          color: #fff;
          font-weight: bold;
          font-size: 0.7em;
          font-family: Raleway, Arial, Helvetica, sans-serif;
          text-transform: uppercase;
          transition-property: all;
          transition-duration: 0.1s;
          transition-timing-function: ease-in-out;
        }

        #barra-brasil .conteudo-barra-brasil nav a:hover {
          opacity: 1;
        }

        #barra-brasil .conteudo-barra-brasil a.botao-seta-direita {
          display: none;
        }

        /* Container e Card */
        body {
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA3NUM3MEQ3QTM1NDExRTNCQkFGRDREODlCNTg3M0Q3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA3NUM3MEQ4QTM1NDExRTNCQkFGRDREODlCNTg3M0Q3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDc1QzcwRDVBMzU0MTFFM0JCQUZENEQ4OUI1ODczRDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDc1QzcwRDZBMzU0MTFFM0JCQUZENEQ4OUI1ODczRDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xh3fmAAAANklEQVR42mL8//8/AyWAiYFCwEi1Qv7//zMyorNB1jMyMjKS7W6oH7AMj1IlMOHxE0CAAQDTnSf+8QXHwwAAAABJRU5ErkJggg==') repeat;
          margin: 0;
          padding: 0;
        }

        .container-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .logo-gov {
          padding: 0px !important;
          height: 40px !important;
          object-fit: contain !important;
          margin-top: 20px !important;
          cursor: pointer !important;
          z-index: 9 !important;
        }

        .card-typebot {
          margin: 20px 0px 20px 0px;
          display: flex;
          flex-direction: column;
          background: rgb(255, 255, 255);
          width: 100vw;
          overflow: hidden;
          max-width: 900px !important;
          border-radius: 10px !important;
          box-shadow: 0px 5px 15px 5px rgba(0,0,0,0.2) !important;
          min-height: 700px;
        }

        .card-typebot .footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: rgb(8, 103, 184);
          font-size: 14px;
          padding: 15px 0px;
        }

        .card-typebot .footer span {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        @media only screen and (max-width: 600px) {
          #barra-brasil .conteudo-barra-brasil a.botao-seta-direita {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
