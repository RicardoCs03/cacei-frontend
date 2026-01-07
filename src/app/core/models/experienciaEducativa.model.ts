import { ProgramaEducativo } from "./programaEducativo.model";

export interface ExperienciaEducativa {
    id?: number;
    nombre: string;
    horasCienciasBasicas: number;
    horasCienciasIngenieria: number;
    horasDisenoIngenieria: number;
    horasCSociales: number;
    horasCEconomicas: number;
    horasOtros: number;
    creditos: number;
    programaEducativo: string;
    areaExperienciaEducativa: string;
    objetivoGeneral: string;
    isActive: boolean;
    nrc: string;
    preRequisitosExperiencias: number[];
    atributosEgresoExperiencias: number[];
}

export interface ExperienciaEducativaModelSpringBoot {
    id?: number;
    nombre: string;
    horasCienciasBasicas: number;
    horasCienciasIngenieria: number;
    horasDisenoIngenieria: number;
    horasCSociales: number;
    horasCEconomicas: number;
    horasOtros: number;
    creditos: number;
    programaEducativo: ProgramaEducativo;
    areaExperienciaEducativa: string;
    objetivoGeneral: string;
    isActive: boolean;
    nrc: string;
    preRequisitosExperiencias: number[];
    atributosEgresoExperiencias: number[];
}
