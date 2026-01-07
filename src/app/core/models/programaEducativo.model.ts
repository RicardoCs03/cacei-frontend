import { AtributoEgreso } from "./atributoEgreso.model";
import { ExperienciaEducativa } from "./experienciaEducativa.model";
export interface ProgramaEducativo {
    id?: number;
    nombre: string;
    totalCreditos: number;
    tPermanenciaMin: number;
    tPermanenciaMax: number;
    fechaCreacion: string;
    contraccion: string;
    isActive: boolean;
    nivelEstudio: string; //TODO: MODIFICAR TIPO A INTERFACE NivelEstudio
    modalidad: string; // TODO: MODIFICAR TIPO A INTERFACE Modalidad
    atributosEgreso?: AtributoEgreso[];
    //atributosCacei?: AtributoCacei[];
    //objetivosEspecificos?: ObjetivoEspecifico[];
    experienciasEducativas?: ExperienciaEducativa[];
    //alumnos?: Alumno[];
    //coordinadorCacei?: CoordinadorCacei;
}  
