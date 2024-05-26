<template>
  <section>
    <form @submit.prevent="salvar">
      <div class="field">
        <label for="nomeDoProjeto" class="label"> Nome do Projeto </label>
        <input
          type="text"
          class="input"
          v-model="nomeDoProjeto"
          id="nomeDoProjet"
        />
      </div>
      <div class="field">
        <button class="button" type="submit">Salvar</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, ref } from "vue";

import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from "@/store/tipo-acoes";
import { TipoNotificacao } from "@/interfaces/INotificacao";

import useNotificador from '@/hooks/notificador'
import IProjeto from "@/interfaces/IProjeto";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Formulario",
  props: {
    id: {
      type: String
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const { notificar } = useNotificador()

    const nomeDoProjeto = ref("")
    if(props.id) {
      const projeto = store.state.projeto.projetos.find((proj: IProjeto) => proj.id == props.id)
      nomeDoProjeto.value = projeto?.nome || ''
    }

    const salvar = () =>  {
      const retorno = props.id 
        ? store.dispatch(ALTERAR_PROJETO, {
            id: props.id,
            nome: nomeDoProjeto.value
          })
        : store.dispatch(CADASTRAR_PROJETO, nomeDoProjeto.value)

      retorno.then(() => alertar('sucesso')).catch(() => alertar('falha'))
    }

    const alertar = (tipo: string) => {
      if(tipo == 'sucesso') {
        nomeDoProjeto.value = "";
        notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!')
        router.push('/projetos')
      } else {
        nomeDoProjeto.value = "";
        notificar(TipoNotificacao.FALHA, 'Erro!', 'Não foi possível cadastrar o projeto!')
      }
    }
    return {
      nomeDoProjeto, salvar
    }
  }
});
</script>
