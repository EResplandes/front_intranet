<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '../../components/header/AppHeader.vue';
import HighlightsSection from '../../components/highlights/HighlightsSection.vue';
import TicketModal from '../../components/abertura-ticket/TicketModal.vue';
import IntranetService from '../../service/IntranetService.js';

const intranetService = new IntranetService();
const banners = ref([]);

onMounted(async () => {
    try {
        const response = await intranetService.informacoes();
        banners.value = response.banners;
    } catch (error) {
        console.error('Erro ao buscar informações da intranet:', error);
    } finally {
        isLoading.value = false;
    }
});

// Itens do menu principal
const menuItems = ref([
    {
        label: 'Comunicados',
        icon: 'pi pi-megaphone',
        to: '/comunicados'
    },
    {
        label: 'RH',
        icon: 'pi pi-users',
        to: '/rh'
    },
    {
        label: 'Abertura de Ticket',
        icon: 'pi pi-desktop',
        command: abrirModalTicket
    },
    {
        label: 'Treinamentos',
        icon: 'pi pi-book',
        to: '/treinamentos'
    },
    {
        label: 'Campanhas',
        icon: 'pi pi-heart',
        to: '/campanhas'
    },
    {
        label: 'Documentos',
        icon: 'pi pi-folder',
        to: '/documentos'
    }
]);

const showTicketModal = ref(false);
const form = ref({
    tipo: null,
    criticidade: null,
    requisitante: '',
    titulo: '',
    descricao: '',
    anexos: []
});

const tipos = ref([
    { label: 'Problema Técnico', value: 'tecnico' },
    { label: 'Solicitação de Software', value: 'software' },
    { label: 'Problema de Hardware', value: 'hardware' },
    { label: 'Acesso/Senha', value: 'acesso' }
]);

const criticidades = ref([
    { label: 'Baixa', value: 'baixa', severity: 'info' },
    { label: 'Média', value: 'media', severity: 'warning' },
    { label: 'Alta', value: 'alta', severity: 'danger' },
    { label: 'Crítica', value: 'critica', severity: 'critical' }
]);

function abrirModalTicket() {
    showTicketModal.value = true;
}

function enviarChamado() {
    showTicketModal.value = false;
    form.value = {
        tipo: null,
        criticidade: null,
        requisitante: '',
        titulo: '',
        descricao: '',
        anexos: []
    };
}

const currentBannerIndex = ref(0);
const bannerProgress = ref(0);

onMounted(() => {
    setInterval(() => {
        bannerProgress.value += 1;
        if (bannerProgress.value >= 100) {
            currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length;
            bannerProgress.value = 0;
        }
    }, 50);
});
</script>

<template>
    <div class="intranet-container">
        <!-- Cabeçalho com Menu -->
        <AppHeader />

        <!-- Banner Principal -->
        <section style="margin-top: 80px;" class="banner-section relative">
            <Carousel :value="banners" :numVisible="1" :numScroll="1" circular autoplayInterval="5000"
                @page="currentBannerIndex = $event.page" class="main-carousel">
                <template #item="slotProps">
                    <div class="banner-item relative h-[400px] md:h-[500px] overflow-hidden rounded-xl mx-4">
                        <img :src="slotProps.data.imagem" :alt="slotProps.data.titulo"
                            class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000" />
                        <div class="banner-overlay absolute inset-0"
                            :style="{ background: `linear-gradient(to right, rgba(99, 102, 241, 0.85), transparent)` }">
                        </div>

                        <div class="banner-content absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                            <div class="max-w-2xl">
                                <Tag :value="slotProps.data.type" severity="info" class="mb-4" />
                                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    {{ slotProps.data.titulo }}
                                </h2>
                                <p class="text-lg md:text-xl mb-6 opacity-90 max-w-lg">
                                    {{ slotProps.data.descricao }}
                                </p>
                                <Button :label="slotProps.data.buttonText" icon="pi pi-arrow-right"
                                    class="p-button-rounded p-button-lg banner-btn shadow-lg hover:shadow-xl transition-all" />
                            </div>
                        </div>
                    </div>
                </template>
            </Carousel>
        </section>

        <!-- Modal de Abertura de Ticket -->
        <Dialog header="Abrir Chamado para o TI" v-model:visible="showTicketModal" :modal="true"
            :style="{ width: 'min(800px, 90vw)' }" :breakpoints="{ '960px': '90vw', '640px': '95vw' }">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Chamado</label>
                        <Dropdown v-model="form.tipo" :options="tipos" optionLabel="label"
                            placeholder="Selecione o tipo" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Criticidade</label>
                        <Dropdown v-model="form.criticidade" :options="criticidades" optionLabel="label"
                            placeholder="Selecione a criticidade" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Requisitante</label>
                    <InputText v-model="form.requisitante" placeholder="Seu nome" class="w-full" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <InputText v-model="form.titulo" placeholder="Título do chamado" class="w-full" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <Textarea v-model="form.descricao" rows="5"
                        placeholder="Descreva detalhadamente o problema ou solicitação" class="w-full" autoResize />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
                    <FileUpload name="anexos" :multiple="true" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        :maxFileSize="10000000" chooseLabel="Selecionar Arquivos" class="file-uploader"
                        @select="files => form.anexos.push(...files)">
                        <template #empty>
                            <div
                                class="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg border-gray-300">
                                <i class="pi pi-cloud-upload text-3xl text-gray-400 mb-2"></i>
                                <span class="text-gray-500">Arraste arquivos aqui ou clique para selecionar</span>
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
                                @click="form.anexos.splice(index, 1)" />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showTicketModal = false" />
                <Button label="Enviar Chamado" icon="pi pi-check" class="p-button-primary" @click="enviarChamado" />
            </template>
        </Dialog>

        <HighlightsSection />
    </div>
</template>

<style scoped>
/* Estilos Gerais */
.intranet-container {
    @apply flex flex-col min-h-screen bg-gray-50;
}

/* Banner Principal */
.banner-section {
    @apply relative mb-8;
}

.banner-item {
    @apply shadow-xl;
}

.banner-overlay {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
}

.banner-content {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner-btn {
    @apply bg-white text-blue-600 font-semibold px-6 py-3 hover:bg-blue-50 hover:shadow-xl transition-all;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

.main-carousel :deep(.p-carousel-indicators) {
    @apply hidden;
}

/* Modal */
:deep(.p-dialog .p-dialog-header) {
    @apply border-b border-gray-200;
}

:deep(.p-dialog .p-dialog-content) {
    @apply pb-0;
}

.file-uploader :deep(.p-fileupload-content) {
    @apply p-0 border-0;
}

.file-uploader :deep(.p-fileupload-buttonbar) {
    @apply hidden;
}

/* Responsividade */
@media (max-width: 768px) {
    .banner-content {
        @apply p-6;
    }

    .banner-content h2 {
        @apply text-2xl;
    }

    .banner-content p {
        @apply text-base;
    }

    .banner-btn {
        @apply px-4 py-2 text-sm;
    }
}
</style>