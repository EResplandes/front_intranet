<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '../../../components/header/AppHeader.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const activeTab = ref('abrir');
const showTicketModal = ref(false);

// Dados do formulário
const form = ref({
    tipo: null,
    prioridade: null,
    titulo: '',
    descricao: '',
    anexos: []
});

// Opções para os dropdowns
const tiposChamado = ref([
    { label: 'Problema Técnico', value: 'tecnico' },
    { label: 'Solicitação de Software', value: 'software' },
    { label: 'Problema de Hardware', value: 'hardware' },
    { label: 'Acesso/Senha', value: 'acesso' }
]);

const prioridades = ref([
    { label: 'Baixa', value: 'baixa', severity: 'info' },
    { label: 'Média', value: 'media', severity: 'warning' },
    { label: 'Alta', value: 'alta', severity: 'danger' },
    { label: 'Crítica', value: 'critica', severity: 'critical' }
]);

// Chamados em aberto (mock data)
const chamados = ref([
    {
        id: 'CH-2023-001',
        titulo: 'Problema com acesso ao sistema',
        tipo: 'acesso',
        prioridade: 'alta',
        dataAbertura: '15/06/2023',
        status: 'Em andamento',
        ultimaAtualizacao: 'Hoje, 10:30'
    },
    {
        id: 'CH-2023-002',
        titulo: 'Computador não liga',
        tipo: 'hardware',
        prioridade: 'critica',
        dataAbertura: '14/06/2023',
        status: 'Aguardando peça',
        ultimaAtualizacao: 'Ontem, 15:45'
    }
]);

// Funções
const abrirChamado = () => {
    showTicketModal.value = true;
};

const enviarChamado = () => {
    // Validação
    if (!form.value.tipo || !form.value.prioridade || !form.value.titulo || !form.value.descricao) {
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Preencha todos os campos obrigatórios',
            life: 5000
        });
        return;
    }

    // Simular envio
    const novoChamado = {
        id: `CH-2023-${chamados.value.length + 100}`,
        titulo: form.value.titulo,
        tipo: form.value.tipo.value,
        prioridade: form.value.prioridade.value,
        dataAbertura: new Date().toLocaleDateString('pt-BR'),
        status: 'Aberto',
        ultimaAtualizacao: 'Agora mesmo'
    };

    chamados.value.unshift(novoChamado);

    // Resetar formulário
    form.value = {
        tipo: null,
        prioridade: null,
        titulo: '',
        descricao: '',
        anexos: []
    };

    showTicketModal.value = false;

    toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Chamado aberto com sucesso!',
        life: 5000
    });
};

const onFileSelect = (event) => {
    form.value.anexos.push(...event.files);
};

const removerAnexo = (index) => {
    form.value.anexos.splice(index, 1);
};

// Obter ícone por tipo de chamado
const getTipoIcon = (tipo) => {
    const icons = {
        tecnico: 'pi pi-cog',
        software: 'pi pi-code',
        hardware: 'pi pi-desktop',
        acesso: 'pi pi-key'
    };
    return icons[tipo] || 'pi pi-question-circle';
};

// Obter classe de prioridade
const getPrioridadeClass = (prioridade) => {
    const classes = {
        baixa: 'bg-blue-100 text-blue-800',
        media: 'bg-yellow-100 text-yellow-800',
        alta: 'bg-orange-100 text-orange-800',
        critica: 'bg-red-100 text-red-800'
    };
    return classes[prioridade] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
    <div class="chamados-container">
        <!-- Header com Menu -->
        <AppHeader :menuItems="menuItems" />

        <!-- Conteúdo Principal -->
        <main class="main-content">
            <div class="container mx-auto px-4 py-6">
                <!-- Título e Abas -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Abertura de Chamados</h1>

                    <div class="tabs-container bg-white p-1 rounded-lg shadow-sm">
                        <Button label="Abrir Chamado" icon="pi pi-plus" class="p-button-text p-button-sm md:p-button"
                            :class="{ 'active-tab': activeTab === 'abrir' }" @click="activeTab = 'abrir'" />

                        <Button label="Meus Chamados" icon="pi pi-list"
                            class="p-button-text p-button-sm md:p-button ml-2"
                            :class="{ 'active-tab': activeTab === 'lista' }" @click="activeTab = 'lista'" />
                    </div>
                </div>

                <!-- Conteúdo das Abas -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <!-- Aba: Abrir Chamado -->
                    <div v-if="activeTab === 'abrir'" class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Chamado *</label>
                                <Dropdown v-model="form.tipo" :options="tiposChamado" optionLabel="label"
                                    placeholder="Selecione o tipo" class="w-full" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Prioridade *</label>
                                <Dropdown v-model="form.prioridade" :options="prioridades" optionLabel="label"
                                    placeholder="Selecione a prioridade" class="w-full" />
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                            <InputText v-model="form.titulo" placeholder="Descreva resumidamente o problema"
                                class="w-full" />
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
                            <Textarea v-model="form.descricao" rows="5"
                                placeholder="Descreva com detalhes o problema ou solicitação" class="w-full"
                                autoResize />
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
                            <FileUpload name="anexos" :multiple="true" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                :maxFileSize="10000000" chooseLabel="Selecionar Arquivos" class="file-uploader"
                                @select="onFileSelect">
                                <template #empty>
                                    <div
                                        class="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg border-gray-300">
                                        <i class="pi pi-cloud-upload text-3xl text-gray-400 mb-2"></i>
                                        <span class="text-gray-500">Arraste arquivos aqui ou clique para
                                            selecionar</span>
                                    </div>
                                </template>
                            </FileUpload>

                            <div v-if="form.anexos.length > 0" class="mt-3 space-y-2">
                                <div v-for="(file, index) in form.anexos" :key="index"
                                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <i class="pi pi-file text-gray-500"></i>
                                        <span class="text-sm">{{ file.name }}</span>
                                    </div>
                                    <Button icon="pi pi-times" class="p-button-text p-button-sm p-button-danger"
                                        @click="removerAnexo(index)" />
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <Button label="Enviar Chamado" icon="pi pi-send" class="p-button-primary"
                                @click="enviarChamado" />
                        </div>
                    </div>

                    <!-- Aba: Meus Chamados -->
                    <div v-if="activeTab === 'lista'" class="p-0">
                        <DataTable :value="chamados" :paginator="true" :rows="10"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} chamados"
                            :rowsPerPageOptions="[5, 10, 20, 50]" class="p-datatable-sm chamados-table"
                            responsiveLayout="scroll">

                            <Column field="id" header="ID" :sortable="true" style="min-width: 120px">
                                <template #body="{ data }">
                                    <span
                                        class="font-mono font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                                        {{ data.id }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="titulo" header="Título" :sortable="true" style="min-width: 200px">
                                <template #body="{ data }">
                                    <div class="flex items-center space-x-3">
                                        <div :class="getTipoIcon(data.tipo)"
                                            class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
                                        </div>
                                        <div>
                                            <div class="font-medium text-gray-900">{{ data.titulo }}</div>
                                            <div class="text-xs text-gray-500">{{ data.ultimaAtualizacao }}</div>
                                        </div>
                                    </div>
                                </template>
                            </Column>

                            <Column field="prioridade" header="Prioridade" :sortable="true" style="min-width: 120px">
                                <template #body="{ data }">
                                    <div class="flex items-center">
                                        <Tag :value="data.prioridade.toUpperCase()"
                                            :class="getPrioridadeClass(data.prioridade)"
                                            class="rounded-md font-medium px-3 py-1 text-xs" />
                                    </div>
                                </template>
                            </Column>

                            <Column field="dataAbertura" header="Abertura" :sortable="true" style="min-width: 100px">
                                <template #body="{ data }">
                                    <div class="text-sm font-medium text-gray-700">{{ data.dataAbertura }}</div>
                                </template>
                            </Column>

                            <Column field="status" header="Status" :sortable="true" style="min-width: 140px">
                                <template #body="{ data }">
                                    <div class="flex items-center">
                                        <span class="status-badge flex items-center" :class="{
                                            'bg-green-100 text-green-800': data.status === 'Resolvido',
                                            'bg-blue-100 text-blue-800': data.status === 'Em andamento',
                                            'bg-yellow-100 text-yellow-800': data.status === 'Aguardando',
                                            'bg-gray-100 text-gray-800': data.status === 'Aberto',
                                            'bg-purple-100 text-purple-800': data.status === 'Em análise'
                                        }">
                                            <span class="w-2 h-2 rounded-full mr-2" :class="{
                                                'bg-green-500': data.status === 'Resolvido',
                                                'bg-blue-500': data.status === 'Em andamento',
                                                'bg-yellow-500': data.status === 'Aguardando',
                                                'bg-gray-500': data.status === 'Aberto',
                                                'bg-purple-500': data.status === 'Em análise'
                                            }"></span>
                                            {{ data.status }}
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <Column header="Ações" style="min-width: 100px">
                                <template #body>
                                    <div class="flex space-x-2">
                                        <Button icon="pi pi-eye"
                                            class="p-button-text p-button-sm p-button-rounded hover:bg-blue-100 text-blue-500"
                                            v-tooltip.top="'Ver detalhes'" />
                                        <Button icon="pi pi-comment"
                                            class="p-button-text p-button-sm p-button-rounded hover:bg-green-100 text-green-500"
                                            v-tooltip.top="'Adicionar comentário'" />
                                    </div>
                                </template>
                            </Column>

                            <template #empty>
                                <div class="flex flex-col items-center justify-center py-10">
                                    <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                                    <h3 class="text-lg font-medium text-gray-700">Nenhum chamado encontrado</h3>
                                    <p class="text-gray-500 text-sm">Você não possui chamados abertos no momento</p>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.chamados-container {
    @apply flex flex-col min-h-screen bg-gray-50;
}

.main-content {
    @apply pt-16;
    margin: 40px;
    /* Compensar o header fixo */
}

.tabs-container {
    @apply flex border border-gray-200 rounded-lg;
}

.active-tab {
    @apply bg-blue-50 text-blue-600 font-medium;
}

.file-uploader :deep(.p-fileupload-content) {
    @apply p-0 border-0;
}

.file-uploader :deep(.p-fileupload-buttonbar) {
    @apply hidden;
}

.status-badge {
    @apply px-3 py-1 rounded-full text-xs font-medium;
}

/* Estilos para a tabela */
:deep(.p-datatable) {
    @apply border-none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    @apply bg-gray-50 text-gray-600 font-semibold border-b border-gray-200;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    @apply border-b border-gray-100;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    @apply bg-blue-50;
}

/* Responsividade */
@media (max-width: 768px) {
    .tabs-container {
        @apply w-full;
    }

    .tabs-container button {
        @apply flex-1 justify-center;
    }
}

/* Estilos aprimorados para a tabela */
.chamados-table :deep(.p-datatable-wrapper) {
    @apply border border-gray-200 rounded-lg overflow-hidden;
}

.chamados-table :deep(.p-datatable-thead > tr > th) {
    @apply bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider border-b border-gray-200 px-4 py-3;
}

.chamados-table :deep(.p-datatable-tbody > tr > td) {
    @apply px-4 py-3 border-b border-gray-100 text-sm;
}

.chamados-table :deep(.p-datatable-tbody > tr:hover) {
    @apply bg-blue-50;
}

.chamados-table :deep(.p-paginator) {
    @apply bg-white border-t border-gray-200 px-4 py-3 rounded-b-lg;
}

.chamados-table :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
    @apply bg-blue-600 text-white;
}

.chamados-table :deep(.p-paginator .p-dropdown) {
    @apply border-gray-300;
}

.status-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
}

/* Efeito de hover nos botões de ação */
.chamados-table :deep(.p-button.p-button-text:hover) {
    @apply bg-opacity-20;
}

/* Responsividade */
@media (max-width: 768px) {
    .chamados-table :deep(.p-datatable-thead) {
        @apply hidden;
    }

    .chamados-table :deep(.p-datatable-tbody > tr) {
        @apply flex flex-col mb-4 border border-gray-200 rounded-lg p-4;
    }

    .chamados-table :deep(.p-datatable-tbody > tr > td) {
        @apply border-0 px-0 py-1 before:content-[attr(data-label)] before:block before:text-xs before:text-gray-500 before:font-medium;
    }

    .chamados-table :deep(.p-column-title) {
        @apply hidden;
    }
}
</style>