
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../database/supabase";

type Candidato = {
  id: string;
  nombre_completo: string | null;
  email: string | null;
  telefono: string | null;
  educacion: string | null;
  experiencia: string | null;
  habilidades: string[] | null;
  cv_url: string | null;
};

type Vacante = {
  id: string;
  titulo: string | null;
  empresa: string | null;
  salario: number | null;
  ubicacion: string | null;
  descripcion: string | null;
  requisitos: string[] | null;
  activa: boolean;
};

type Analisis = {
  compatibility_score: number;
  strengths: string[];
  areas_to_evaluate: string[];
  summary: string;
};

export default function PerfilCandidato() {
  const [candidato, establecerCandidato] =
    useState<Candidato | null>(null);

  const [vacante, establecerVacante] =
    useState<Vacante | null>(null);

  const [analisis, establecerAnalisis] =
    useState<Analisis | null>(null);

  const [cargando, establecerCargando] = useState(true);
  const [analizando, establecerAnalizando] = useState(false);

  useEffect(() => {
    let componenteActivo = true;

    const cargarDatos = async () => {
      try {
        const { data: datosCandidato, error: errorCandidato } =
          await supabase
            .from("candidatos")
            .select(
              "id, nombre_completo, email, telefono, educacion, experiencia, habilidades, cv_url"
            )
            .limit(1)
            .maybeSingle();

        if (errorCandidato) {
          throw new Error(
            "No se pudo cargar el candidato: " +
              errorCandidato.message
          );
        }

        const { data: datosVacante, error: errorVacante } =
          await supabase
            .from("vacantes")
            .select(
              "id, titulo, empresa, salario, ubicacion, descripcion, requisitos, activa"
            )
            .eq("activa", true)
            .limit(1)
            .maybeSingle();

        if (errorVacante) {
          throw new Error(
            "No se pudo cargar la vacante: " +
              errorVacante.message
          );
        }

        if (componenteActivo) {
          establecerCandidato(datosCandidato as Candidato | null);
          establecerVacante(datosVacante as Vacante | null);
        }
      } catch (error) {
        if (componenteActivo) {
          Alert.alert(
            "Error al cargar",
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado."
          );
        }
      } finally {
        if (componenteActivo) {
          establecerCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const abrirCurriculum = async () => {
    const enlaceCurriculum = candidato?.cv_url?.trim();

    if (!enlaceCurriculum) {
      return;
    }

    try {
      await Linking.openURL(enlaceCurriculum);
    } catch {
      Alert.alert(
        "No se pudo abrir el currículum",
        "Verifica que el enlace al PDF sea válido."
      );
    }
  };

  const analizarCompatibilidad = async () => {
    if (!candidato || !vacante) {
      Alert.alert(
        "Información incompleta",
        "Se necesita un candidato y una vacante activa."
      );
      return;
    }

    const tieneDatosProfesionales =
      !!candidato.educacion?.trim() ||
      !!candidato.experiencia?.trim() ||
      !!candidato.habilidades?.some(
        (habilidad) =>
          typeof habilidad === "string" && !!habilidad.trim()
      );

    if (!tieneDatosProfesionales) {
      Alert.alert(
        "Falta información",
        "El candidato todavía no tiene formación, experiencia ni habilidades registradas."
      );
      return;
    }

    establecerAnalizando(true);
    establecerAnalisis(null);

    try {
      const { data: respuesta, error: errorFuncion } =
        await supabase.functions.invoke(
          "analizar-candidato",
          {
            body: {
              candidato: {
                educacion: candidato.educacion,
                experiencia: candidato.experiencia,
                habilidades: candidato.habilidades,
              },
              vacante: {
                titulo: vacante.titulo,
                empresa: vacante.empresa,
                descripcion: vacante.descripcion,
                requisitos: vacante.requisitos,
              },
            },
          }
        );

      if (errorFuncion) {
        throw new Error(
          "No se pudo consultar la IA: " +
            errorFuncion.message
        );
      }

      if (respuesta?.error) {
        throw new Error(respuesta.error);
      }

      const resultado = respuesta as Analisis | null;

      if (
        !resultado ||
        !Number.isInteger(resultado.compatibility_score) ||
        resultado.compatibility_score < 0 ||
        resultado.compatibility_score > 100 ||
        !Array.isArray(resultado.strengths) ||
        !resultado.strengths.every(
          (elemento) => typeof elemento === "string"
        ) ||
        !Array.isArray(resultado.areas_to_evaluate) ||
        !resultado.areas_to_evaluate.every(
          (elemento) => typeof elemento === "string"
        ) ||
        typeof resultado.summary !== "string"
      ) {
        throw new Error(
          "La IA devolvió un resultado con formato incorrecto."
        );
      }

      const { error: errorGuardar } = await supabase
        .from("analisis_ia")
        .insert({
          candidato_id: candidato.id,
          vacante_id: vacante.id,
          puntuacion_compatibilidad:
            resultado.compatibility_score,
          fortalezas: resultado.strengths,
          areas_por_evaluar: resultado.areas_to_evaluate,
          resumen: resultado.summary,
        });

      if (errorGuardar) {
        throw new Error(
          "El análisis se generó, pero no se pudo guardar: " +
            errorGuardar.message
        );
      }

      establecerAnalisis(resultado);
    } catch (error) {
      Alert.alert(
        "Error al analizar",
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      establecerAnalizando(false);
    }
  };

  if (cargando) {
    return (
      <View style={estilos.cargando}>
        <ActivityIndicator size="large" color="#087E8B" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!candidato) {
    return (
      <View style={estilos.cargando}>
        <Text style={estilos.tituloVacio}>
          No se encontró el candidato
        </Text>
        <Text style={estilos.textoSecundario}>
          Comprueba que exista un registro y que tengas permiso
          para consultarlo.
        </Text>
      </View>
    );
  }

  const nombreCandidato =
    candidato.nombre_completo?.trim() || "Candidato";

  const habilidadesCandidato =
    candidato.habilidades?.filter(
      (habilidad) =>
        typeof habilidad === "string" && !!habilidad.trim()
    ) ?? [];

  const requisitosVacante =
    vacante?.requisitos?.filter(
      (requisito) =>
        typeof requisito === "string" && !!requisito.trim()
    ) ?? [];

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenidoPantalla}
    >
      <View style={estilos.encabezado}>
        <Text style={estilos.marca}>KADAF</Text>
        <Text style={estilos.titulo}>Perfil de candidato</Text>
        <Text style={estilos.subtitulo}>
          Información y análisis de compatibilidad
        </Text>
      </View>

      <View style={estilos.tarjeta}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarTexto}>
            {nombreCandidato.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={estilos.nombre}>{nombreCandidato}</Text>

        {!!candidato.email?.trim() && (
          <Text style={estilos.dato}>{candidato.email}</Text>
        )}

        {!!candidato.telefono?.trim() && (
          <Text style={estilos.dato}>{candidato.telefono}</Text>
        )}

        {!!candidato.cv_url?.trim() && (
          <Pressable
            style={estilos.botonSecundario}
            onPress={abrirCurriculum}
          >
            <Text style={estilos.textoBotonSecundario}>
              Ver currículum PDF
            </Text>
          </Pressable>
        )}
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>
          Vacante para el análisis
        </Text>

        {vacante ? (
          <>
            {!!vacante.titulo?.trim() && (
              <Text style={estilos.nombreVacante}>
                {vacante.titulo}
              </Text>
            )}

            {!!vacante.empresa?.trim() && (
              <Text style={estilos.dato}>{vacante.empresa}</Text>
            )}

            {!!vacante.ubicacion?.trim() && (
              <Text style={estilos.dato}>
                {vacante.ubicacion}
              </Text>
            )}

            {vacante.salario !== null &&
              vacante.salario !== undefined && (
                <Text style={estilos.dato}>
                  Salario: {vacante.salario}
                </Text>
              )}

            {!!vacante.descripcion?.trim() && (
              <Text style={estilos.contenido}>
                {vacante.descripcion}
              </Text>
            )}

            {requisitosVacante.length > 0 && (
              <>
                <Text style={estilos.subtituloSeccion}>
                  Requisitos
                </Text>

                {requisitosVacante.map((requisito, indice) => (
                  <Text
                    key={`${indice}-${requisito}`}
                    style={estilos.contenido}
                  >
                    {"• "}{requisito}
                  </Text>
                ))}
              </>
            )}
          </>
        ) : (
          <Text style={estilos.contenido}>
            No hay una vacante activa disponible.
          </Text>
        )}
      </View>

      {!!candidato.educacion?.trim() && (
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>
            Formación académica
          </Text>
          <Text style={estilos.contenido}>
            {candidato.educacion}
          </Text>
        </View>
      )}

      {!!candidato.experiencia?.trim() && (
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>
            Experiencia profesional
          </Text>
          <Text style={estilos.contenido}>
            {candidato.experiencia}
          </Text>
        </View>
      )}

      {habilidadesCandidato.length > 0 && (
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Habilidades</Text>

          <View style={estilos.habilidades}>
            {habilidadesCandidato.map((habilidad, indice) => (
              <View
                key={`${indice}-${habilidad}`}
                style={estilos.etiqueta}
              >
                <Text style={estilos.etiquetaTexto}>
                  {habilidad}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>
          Análisis de compatibilidad
        </Text>

        <Text style={estilos.contenido}>
          Compara la información profesional con los requisitos
          de la vacante para generar un análisis orientativo.
        </Text>

        <Pressable
          style={[
            estilos.boton,
            (analizando || !vacante) &&
              estilos.botonDeshabilitado,
          ]}
          onPress={analizarCompatibilidad}
          disabled={analizando || !vacante}
        >
          {analizando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={estilos.textoBoton}>
              Analizar compatibilidad
            </Text>
          )}
        </Pressable>

        {analizando && (
          <Text style={estilos.textoEspera}>
            Analizando el perfil...
          </Text>
        )}

        {analisis && (
          <View style={estilos.resultado}>
            <Text style={estilos.tituloSeccion}>
              Compatibilidad
            </Text>

            <Text style={estilos.puntuacion}>
              {analisis.compatibility_score}%
            </Text>

            <View style={estilos.barraFondo}>
              <View
                style={[
                  estilos.barraProgreso,
                  {
                    width: `${analisis.compatibility_score}%`,
                  },
                ]}
              />
            </View>

            {!!analisis.summary.trim() && (
              <Text style={estilos.contenido}>
                {analisis.summary}
              </Text>
            )}

            {analisis.strengths.length > 0 && (
              <>
                <Text style={estilos.subtituloSeccion}>
                  Fortalezas
                </Text>

                {analisis.strengths
                  .filter((elemento) => !!elemento.trim())
                  .map((fortaleza, indice) => (
                    <Text
                      key={`${indice}-${fortaleza}`}
                      style={estilos.contenido}
                    >
                      {"• "}{fortaleza}
                    </Text>
                  ))}
              </>
            )}

            {analisis.areas_to_evaluate.length > 0 && (
              <>
                <Text style={estilos.subtituloSeccion}>
                  Áreas por evaluar
                </Text>

                {analisis.areas_to_evaluate
                  .filter((elemento) => !!elemento.trim())
                  .map((area, indice) => (
                    <Text
                      key={`${indice}-${area}`}
                      style={estilos.contenido}
                    >
                      {"• "}{area}
                    </Text>
                  ))}
              </>
            )}

            <Text style={estilos.aviso}>
              Resultado orientativo. No debe utilizarse como
              criterio único para decidir una contratación.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  contenidoPantalla: {
    paddingBottom: 28,
  },
  cargando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    backgroundColor: "#F3F6FA",
  },
  encabezado: {
    backgroundColor: "#17365D",
    padding: 24,
    paddingTop: 55,
  },
  marca: {
    color: "#4DD0C8",
    fontSize: 16,
    fontWeight: "bold",
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 12,
  },
  subtitulo: {
    color: "#DCE6F1",
    marginTop: 6,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#D8F1EF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTexto: {
    color: "#087E8B",
    fontSize: 30,
    fontWeight: "bold",
  },
  nombre: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#17365D",
    textAlign: "center",
  },
  dato: {
    color: "#667085",
    marginTop: 6,
  },
  textoSecundario: {
    color: "#667085",
    textAlign: "center",
    lineHeight: 22,
  },
  tituloVacio: {
    fontSize: 18,
    color: "#17365D",
    fontWeight: "bold",
    textAlign: "center",
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: "#087E8B",
    padding: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 16,
  },
  textoBotonSecundario: {
    color: "#087E8B",
    fontWeight: "bold",
  },
  seccion: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 14,
  },
  tituloSeccion: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#17365D",
    marginBottom: 10,
  },
  subtituloSeccion: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#17365D",
    marginTop: 14,
    marginBottom: 6,
  },
  nombreVacante: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#087E8B",
  },
  contenido: {
    color: "#475467",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 4,
  },
  habilidades: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  etiqueta: {
    backgroundColor: "#E5F4F3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  etiquetaTexto: {
    color: "#087E8B",
    fontSize: 13,
  },
  boton: {
    backgroundColor: "#087E8B",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    minHeight: 48,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textoEspera: {
    color: "#667085",
    textAlign: "center",
    marginTop: 10,
  },
  resultado: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EAECF0",
  },
  puntuacion: {
    color: "#087E8B",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  barraFondo: {
    height: 9,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
    overflow: "hidden",
    marginBottom: 14,
  },
  barraProgreso: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#087E8B",
  },
  aviso: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
});
