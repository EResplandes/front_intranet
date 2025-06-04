<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits(['close', 'submit']);

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

// Opções para os dropdowns
const ticketTypes = ref([
  { label: 'Incidente', value: 'incident' },
  { label: 'Requisição', value: 'request' }
]);

const priorities = ref([
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Crítica', value: 'critical' }
]);

// Formulário
const form = ref({
  ticketType: null,
  priority: null,
  requester: '',
  title: '',
  description: '',
  attachments: []
});

const submitted = ref(false);

// Carrega o nome do usuário do localStorage
onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  form.value.requester = userData.name || 'Usuário não identificado';
});

// Manipulação de arquivos
const onFileSelect = (event) => {
  form.value.attachments = [...form.value.attachments, ...event.files];
};

const removeFile = (index) => {
  form.value.attachments.splice(index, 1);
};

// Fechar modal
const closeModal = () => {
  resetForm();
  emit('close');
};

// Resetar formulário
const resetForm = () => {
  form.value = {
    ticketType: null,
    priority: null,
    requester: form.value.requester, // Mantém o requisitante
    title: '',
    description: '',
    attachments: []
  };
  submitted.value = false;
};

// Submeter formulário
const submitForm = () => {
  submitted.value = true;

  // Validação simples
  if (!form.value.ticketType || !form.value.priority || !form.value.title || !form.value.description) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Preencha todos os campos obrigatórios',
      life: 3000
    });
    return;
  }

  // Aqui você pode adicionar a lógica para enviar o chamado
  console.log('Chamado enviado:', form.value);
  
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Chamado aberto com sucesso',
    life: 3000
  });

  // Emitir evento e resetar formulário
  emit('submit', form.value);
  resetForm();
  emit('close');
};
</script>

<template>
<Dialog
  :visible="props.visible"
  @update:visible="emit('close')"
  modal
  header="Abertura de Chamado"
  :style="{ width: '50vw' }"
  :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
>
    <form @submit.prevent="submitForm">
      <div class="grid formgrid p-fluid">
        <!-- Tipo de Chamado -->
        <div class="field col-12 md:col-6">
          <label for="ticketType">Tipo de Chamado *</label>
          <Dropdown
            id="ticketType"
            v-model="form.ticketType"
            :options="ticketTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione o tipo"
            :class="{ 'p-invalid': submitted && !form.ticketType }"
          />
          <small v-if="submitted && !form.ticketType" class="p-error">Campo obrigatório</small>
        </div>

        <!-- Criticidade -->
        <div class="field col-12 md:col-6">
          <label for="priority">Criticidade *</label>
          <Dropdown
            id="priority"
            v-model="form.priority"
            :options="priorities"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione a criticidade"
            :class="{ 'p-invalid': submitted && !form.priority }"
          />
          <small v-if="submitted && !form.priority" class="p-error">Campo obrigatório</small>
        </div>

        <!-- Requisitante (desabilitado) -->
        <div class="field col-12">
          <label for="requester">Requisitante</label>
          <InputText
            id="requester"
            v-model="form.requester"
            disabled
          />
        </div>

        <!-- Título -->
        <div class="field col-12">
          <label for="title">Título *</label>
          <InputText
            id="title"
            v-model="form.title"
            placeholder="Resumo do chamado"
            :class="{ 'p-invalid': submitted && !form.title }"
          />
          <small v-if="submitted && !form.title" class="p-error">Campo obrigatório</small>
        </div>

        <!-- Descrição -->
        <div class="field col-12">
          <label for="description">Descrição *</label>
          <Textarea
            id="description"
            v-model="form.description"
            rows="5"
            placeholder="Descreva detalhadamente o problema ou solicitação"
            :class="{ 'p-invalid': submitted && !form.description }"
          />
          <small v-if="submitted && !form.description" class="p-error">Campo obrigatório</small>
        </div>

        <!-- Anexos -->
        <div class="field col-12">
          <label for="attachments">Anexos</label>
          <FileUpload
            id="attachments"
            name="attachments"
            :multiple="true"
            :maxFileSize="10000000" <!-- 10MB -->
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            :auto="true"
            :customUpload="true"
            @select="onFileSelect"
            chooseLabel="Selecionar Arquivos"
          >
            <template #empty>
              <p>Arraste arquivos aqui ou clique para selecionar</p>
            </template>
          </FileUpload>
          <div v-if="form.attachments.length > 0" class="file-list mt-2">
            <div v-for="(file, index) in form.attachments" :key="index" class="file-item flex align-items-center">
              <span class="file-name">{{ file.name }}</span>
              <Button
                icon="pi pi-times"
                class="p-button-rounded p-button-text p-button-danger ml-2"
                @click="removeFile(index)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeModal"
        />
        <Button
          label="Abrir Chamado"
          icon="pi pi-check"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.file-list {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
}

.file-item {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-size: 0.9rem;
  flex-grow: 1;
}
</style>