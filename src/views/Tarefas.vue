<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div class="lista">
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Digite para filtrar" v-model="filtro" />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <Box v-if="semTarefas">
      Você não está muito produtivo hoje <span class="has-text-weight-bold">:(</span>
    </Box>
    <Tarefa @aoTarefaClicada="tarefaClicada" class="clicavel" v-for="(tarefa, index) in tarefas" :tarefa="tarefa"
      :key="index" />
  </div>
  <Modal :mostrar="tarefaSelecionada != null" v-if="tarefaSelecionada">
    <template v-slot:cabecalho>
      <p class="modal-card-title">Editar Tarefa</p>
      <button @click="fecharModal" class="delete" aria-label="close"></button>
    </template>
    <template v-slot:corpo>
      <div class="field">
        <label for="descricaoTarefa" class="label"> Descrição </label>
        <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoTarefa" />
      </div>
    </template>
    <template v-slot:rodape>
      <div class="buttons">
        <button @click="alterarTarefa" class="button is-success">Salvar altereções</button>
        <button @click="fecharModal" class="button">Cancelar</button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import Modal from "../components/Modal.vue";
import ITarefa from "../interfaces/ITarefa"
import { useStore } from "@/store";
import { OBTER_TAREFAS, OBTER_PROJETOS, CADASTRAR_TAREFA, ALTERAR_TAREFA, } from "@/store/tipo-acoes";

export default defineComponent({
  name: "App",
  components: {
    Formulario,
    Tarefa,
    Box,
    Modal
  },
  data() {
    return {
      tarefaSelecionada: null as ITarefa | null
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa): void {
      this.store.dispatch(CADASTRAR_TAREFA, tarefa)
    },
    alterarTarefa(): void {
      this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada).then(() => {
        this.fecharModal()
      })
    },
    tarefaClicada(tarefa: ITarefa): void {
      this.tarefaSelecionada = tarefa
    },
    fecharModal(): void {
      this.tarefaSelecionada = null
    }
  },
  computed: {
    semTarefas(): boolean {
      return this.tarefas.length == 0
    }
  },
  setup() {
    const store = useStore()
    store.dispatch(OBTER_TAREFAS)
    store.dispatch(OBTER_PROJETOS)

    const filtro = ref("")
    watchEffect(() => store.dispatch(OBTER_TAREFAS, filtro.value))

    return {
      tarefas: computed(() => store.state.tarefa.tarefas),
      filtro,
      store
    }
  }
});
</script>
<style scoped>
.clicavel {
  cursor: pointer;
}
</style>
