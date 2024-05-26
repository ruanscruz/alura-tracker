import { Module } from "vuex";
import http from "@/http";
import { Estado } from "..";
import { ADICIONA_TAREFA, ALTERA_TAREFA, DEFINIR_TAREFAS } from "../tipo-mutacoes";
import { ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_TAREFAS } from "../tipo-acoes";
import ITarefa from "@/interfaces/ITarefa";

export interface EstadoTarefa {
    tarefas: ITarefa[]
}

export const tarefa: Module<EstadoTarefa, Estado> = {
    state: {
        tarefas: []
    },
    mutations: {
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa) {
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa) {
            const index = state.tarefas.findIndex((t: ITarefa) => t.id == tarefa.id)
            state.tarefas[index] = tarefa
        },
    },
    actions: {
        [OBTER_TAREFAS]({ commit }, filtro?: string) {
            const url = filtro ? `tarefas?descricao=${filtro}` : 'tarefas'
            http.get(url).then(({data}) => commit(DEFINIR_TAREFAS, data))
        },
        [CADASTRAR_TAREFA]({commit}, tarefa: ITarefa) {
            http.post('/tarefas', tarefa).then(() => commit(ADICIONA_TAREFA, tarefa))
        },
        [ALTERAR_TAREFA]({commit}, tarefa: ITarefa) {
            return http.put(`/tarefas/${tarefa.id}`, tarefa).then(() => commit(ALTERA_TAREFA, tarefa))
        },
    }
}