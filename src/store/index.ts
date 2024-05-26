import { createStore, Store, useStore as vuexUseStore } from "vuex"
import { InjectionKey } from 'vue'
import { INotificacao } from "@/interfaces/INotificacao";
import { NOTIFICAR } from "./tipo-mutacoes";
import { EstadoProjeto, projeto } from "./modulos/projeto";
import { EstadoTarefa, tarefa } from "./modulos/tarefa";

export interface Estado {
    projeto: EstadoProjeto,
    tarefa: EstadoTarefa,
    notificacoes: INotificacao[]
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state: {
        projeto: {
            projetos: []
        },
        tarefa: {
            tarefas: []
        },
        notificacoes: []
    },
    mutations: {
        [NOTIFICAR] (state, novaNotificacao: INotificacao) {
            novaNotificacao.id = new Date().getTime()
            state.notificacoes.push(novaNotificacao)

            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter((notificacao: INotificacao) => notificacao.id != novaNotificacao.id)
            }, 3000)
        },
    },
    actions: {},
    modules: {
        projeto,
        tarefa
    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key)
}