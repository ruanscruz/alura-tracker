import { Module } from "vuex";
import http from "@/http";
import IProjeto from "@/interfaces/IProjeto";
import { Estado } from "..";
import { DEFINIR_PROJETOS, ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUI_PROJETO } from "../tipo-mutacoes";
import { OBTER_PROJETOS, CADASTRAR_PROJETO, ALTERAR_PROJETO, EXCLUIR_PROJETO } from "../tipo-acoes";

export interface EstadoProjeto {
    projetos: IProjeto[]
}

export const projeto: Module<EstadoProjeto, Estado> = {
    mutations: {
        [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
            state.projetos = projetos
        },
        [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
            const projeto = {
                id: new Date().toISOString(),
                nome: nomeDoProjeto
            } as IProjeto
            state.projetos.push(projeto)
        },
        [ALTERA_PROJETO](state, projeto: IProjeto) {
            const index = state.projetos.findIndex((proj: IProjeto) => proj.id == projeto.id)
            state.projetos[index] = projeto
        },
        [EXCLUI_PROJETO](state, id: string) {
            state.projetos = state.projetos.filter((proj: IProjeto) => proj.id != id)
        },
    },
    actions: {
        [OBTER_PROJETOS]({ commit }) {
            http.get('projetos').then(({data}) => commit(DEFINIR_PROJETOS, data))
        },
        [CADASTRAR_PROJETO](_, nomeDoProjeto: string) {
            return http.post('/projetos', { nome: nomeDoProjeto })
        },
        [ALTERAR_PROJETO](_, projeto: IProjeto) {
            return http.put(`/projetos/${projeto.id}`, projeto)
        },
        [EXCLUIR_PROJETO]({ commit }, id: string) {
            http.delete(`/projetos/${id}`).then(() => commit(EXCLUI_PROJETO, id))
        },
    }
}