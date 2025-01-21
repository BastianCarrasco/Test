import { useState, useEffect } from "react";
import RadarChart from "./createRadarChartData ";
import categorias from "./ni.json";

export default function Simulador() {
  const [niveles, setNiveles] = useState({
    TRL: 0,
    CRL: 0,
    BRL: 0,
    FRL: 0,
    IPRL: 0,
    TEAM: 0,
  });

  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);
  const [checkboxes, setCheckboxes] = useState({}); // Estructura más compleja para checkboxes
  const [showModal, setShowModal] = useState(true);

  const aumentarNivel = (nivel) => {
    setNiveles((prevState) => ({
      ...prevState,
      [nivel]: prevState[nivel],
    }));
    setNivelSeleccionado(nivel);
  };

  const handleCheckboxChange = (preguntaId, nombreCategoria, checked) => {
    // Actualizamos el estado de los checkboxes de manera independiente para cada pregunta y nivel
    setCheckboxes((prevState) => {
      const newState = {
        ...prevState,
        [nombreCategoria]: {
          ...prevState[nombreCategoria],
          [preguntaId]: checked,
        },
      };

      // Actualizar niveles de acuerdo con el estado del checkbox
      if (checked) {
        setNiveles((prevNiveles) => ({
          ...prevNiveles,
          [nombreCategoria]: prevNiveles[nombreCategoria] + 1,
        }));
      } else {
        setNiveles((prevNiveles) => ({
          ...prevNiveles,
          [nombreCategoria]: prevNiveles[nombreCategoria] - 1,
        }));
      }

      return newState;
    });
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Instrucciones</h2>

            <ul className="list-disc ml-5 mb-4">
              <li>Selecciona la característica KTH que desee evaluar</li>
              <li>
                Seleccione la casilla donde usted crea que su proyecto cumple de
                manera efectiva
              </li>
              <li>
                Observe el comportamiento de la gráfica y evalúe su proyecto
              </li>
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {!showModal && (
        <div className="text-white gap-8 mt-4 grid grid-cols-8">
          {/* Columna de botones a la izquierda (3/8) */}
          <div className="flex flex-col col-span-1 mr-3">
            <h2 className="mb-4 text-xl font-bold">Simulador</h2>
            <div className="flex flex-col space-y-4">
              {Object.keys(niveles).map((nivel) => (
                <button
                  key={nivel}
                  onClick={() => aumentarNivel(nivel)}
                  className="p-2 border border-white hover:bg-blue-500"
                >
                  {nivel}
                </button>
              ))}
            </div>
          </div>

          {/* Columna de preguntas (2/8) */}
          <div className="col-span-4 mr-8">
            {nivelSeleccionado && (
              <>
                <h3 className="text-xl font-bold">
                  Preguntas para {nivelSeleccionado}:{" "}
                  <span className="text-lg font-normal">
                    NIVEL ACTUAL {niveles[nivelSeleccionado]}
                  </span>
                </h3>
                <ul style={{ fontSize: "20px" }}>
                  {categorias[nivelSeleccionado].map((pregunta) => (
                    <li key={pregunta.nivel} className="mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            checkboxes[nivelSeleccionado]?.[pregunta.nivel] ||
                            false
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              pregunta.nivel,
                              nivelSeleccionado,
                              e.target.checked
                            )
                          }
                          className="mr-2 transform scale-150"
                        />
                        {pregunta.descripcion}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Columna de gráfico Radar (3/8) */}
          <div className="col-span-3 mr-8">
            <h3 className="text-xl font-bold">Gráfico Radar:</h3>
            <div id="radar-chart">
              <RadarChart niveles={niveles} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
