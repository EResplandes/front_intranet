<script setup>
import { ref } from 'vue';
import AppHeader from '../../components/header/AppHeader.vue';
import HighlightsSection from '../../components/highlights/HighlightsSection.vue';
import TicketModal from '../../components/abertura-ticket/TicketModal.vue';

// Banners para o carrossel
const banners = ref([
    {
        image: '../../../public/img/banners/docao_alimentos_banner.png',
        title: 'Campanha de Arrecadação de Alimentos',
        description: 'Participe e ganhe recompensas enquanto ajuda quem mais precisa',
        buttonText: 'Saiba Mais'
    },
    {
        image: '../../../public/img/banners/aviso_manutencao_banner.png',
        title: 'Corpus Christi',
        description: ' Isto significa que o feriado foi instaurado como uma forma de celebrar o corpo e o sangue de Jesus Cristo, honrando sua morte e ressurreição.',
        buttonText: 'Conhecer'
    }
]);

// Itens do menu principal
const menuItems = ref([
    {
        label: 'Comunicados',
        icon: 'pi pi-megaphone'
    },
    { label: 'RH', icon: 'pi pi-users' },
    {
        label: 'Abertura de Ticket',
        icon: 'pi pi-desktop',
        command: abrirModalTicket
    },
    { label: 'Treinamentos', icon: 'pi pi-book' },
    { label: 'Campanhas', icon: 'pi pi-heart' },
    { label: 'Documentos', icon: 'pi pi-folder' }
]);

// Opções para os dropdowns
const ticketTypes = ref([
    { label: 'Incidente', value: 'incident' },
    { label: 'Requisição', value: 'request' }
]);

const form = ref({
    ticketType: '',
    priority: '',
    requester: 'Usuário Atual', // substitua por lógica real se necessário
    title: '',
    description: '',
    attachments: []
});

const submitted = ref(false);

const submitForm = () => {
    submitted.value = true;

    if (!form.value.ticketType || !form.value.priority || !form.value.title || !form.value.description) {
        console.warn('Formulário incompleto.');
        return;
    }

    console.log('Chamado enviado com sucesso:', form.value);
    // Aqui pode-se chamar o método de envio ao backend
    closeModal();
};

const closeModal = () => {
    showTicketModal.value = false;
    submitted.value = false;
    form.value = {
        ticketType: '',
        priority: '',
        requester: 'Usuário Atual',
        title: '',
        description: '',
        attachments: []
    };
};

const onFileSelect = (event) => {
    const selectedFiles = event.files || [];
    form.value.attachments.push(...selectedFiles);
};

const removeFile = (index) => {
    form.value.attachments.splice(index, 1);
};

const priorities = ref([
    { label: 'Baixa', value: 'low' },
    { label: 'Média', value: 'medium' },
    { label: 'Alta', value: 'high' },
    { label: 'Crítica', value: 'critical' }
]);

function abrirModalTicket() {
    console.log('Abrindo modal de abertura de ticket');
    showTicketModal.value = true;
}

// Aniversariantes
const birthdays = ref([
    { name: 'Ana Silva', department: 'Marketing', date: '05/06', photo: 'https://picsum.photos/400/300' },
    { name: 'Carlos Oliveira', department: 'TI', date: '10/06', photo: 'https://picsum.photos/400/300' },
    { name: 'Mariana Santos', department: 'Financeiro', date: '15/06', photo: 'https://picsum.photos/400/300' }
]);

// Avisos importantes
const announcements = ref([
    {
        title: 'Manutenção Programada',
        summary: 'O sistema ficará indisponível no sábado das 8h às 12h para atualizações.',
        type: 'TI',
        severity: 'warning',
        date: '02/06/2025'
    },
    {
        title: 'Novo Plano de Saúde',
        summary: 'Confira as mudanças no plano de saúde a partir de julho.',
        type: 'RH',
        severity: 'info',
        date: '01/06/2025'
    },
    {
        title: 'Evento Beneficente',
        summary: 'Participe do nosso evento anual de arrecadação de alimentos.',
        type: 'Social',
        severity: 'success',
        date: '28/05/2025'
    }
]);

const handleTicketSubmit = (ticketData) => {
    console.log('Dados do chamado:', ticketData);
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
};
</script>

<template>
    <div class="intranet-container">
        <!-- Cabeçalho com Menu -->
        <AppHeader :menuItems="menuItems" />

        <!-- Banner -->
        <section class="banner-section">
            <Carousel :value="banners" :numVisible="1" :numScroll="1" circular autoplayInterval="5000">
                <template #item="slotProps">
                    <div class="banner-item" :style="{ backgroundImage: 'url(' + slotProps.data.image + ')' }">
                        <div class="banner-content">
                            <h2>{{ slotProps.data.title }}</h2>
                            <p>{{ slotProps.data.description }}</p>
                            <Button :label="slotProps.data.buttonText" icon="pi pi-arrow-right"
                                class="p-button-rounded banner-btn" />
                        </div>
                    </div>
                </template>
            </Carousel>
        </section>

        <!-- Modal de Abertura de Ticket -->
        <Dialog header="Abrir Chamado para o TI" v-model:visible="showTicketModal" :modal="true"
            :style="{ width: '800px' }">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <label class="font-semibold">Tipo de Chamado</label>
                        <Dropdown v-model="form.tipo" :options="tipos" optionLabel="label"
                            placeholder="Selecione o tipo" class="w-full" />
                    </div>
                    <div class="flex-1">
                        <label class="font-semibold">Criticidade</label>
                        <Dropdown v-model="form.criticidade" :options="criticidades" optionLabel="label"
                            placeholder="Selecione a criticidade" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="font-semibold">Requisitante</label>
                    <InputText v-model="form.requisitante" placeholder="Seu nome" class="w-full" />
                </div>

                <div>
                    <label class="font-semibold">Título</label>
                    <InputText v-model="form.titulo" placeholder="Título do chamado" class="w-full" />
                </div>

                <div>
                    <label class="font-semibold">Descrição</label>
                    <Textarea v-model="form.descricao" rows="4" placeholder="Descreva o problema ou solicitação"
                        class="w-full" autoResize />
                </div>

                <div>
                    <label class="font-semibold mb-2">Anexos</label>
                    <FileUpload mode="basic" name="file" url="./upload" accept=".jpg,.png,.pdf,.docx" :auto="true"
                        chooseLabel="Selecionar Arquivo" class="p-button p-button-sm p-button-outlined p-button-primary"
                        chooseIcon="pi pi-upload" />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
                <Button label="Enviar" icon="pi pi-check" @click="enviarChamado" />
            </template>
        </Dialog>

        <HighlightsSection :birthdays="birthdays" :announcements="announcements" />
    </div>
</template>

<style scoped>
/* Estilos Gerais */
.intranet-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8fafc;
}

/* Carrossel */
.banner-section {
    padding: 0 2rem;
    margin: 1.5rem 0;
}

.banner-item {
    height: 350px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-position: center;
}

.banner-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 2.5rem;
    padding-top: 5rem;
}

.banner-content h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.banner-content p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    max-width: 60%;
}

.banner-btn {
    background-color: #3b82f6 !important;
    border: none;
    padding: 0.75rem 1.5rem;
}

@media (max-width: 992px) {
    .banner-section {
        padding: 0 1rem;
    }

    .banner-item {
        height: 250px;
    }

    .banner-content {
        padding: 1.5rem;
        padding-top: 3rem;
    }

    .banner-content h2 {
        font-size: 1.5rem;
    }

    .banner-content p {
        max-width: 100%;
        font-size: 1rem;
    }
}

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
