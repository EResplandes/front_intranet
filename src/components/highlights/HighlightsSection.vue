<script setup>
import { ref, onMounted } from 'vue';
import IntranetService from '../../service/IntranetService.js';

const aniversariantes = ref([]);
const avisos = ref([]);
const isLoading = ref(true);

const intranetService = new IntranetService();

onMounted(async () => {
    try {
        const response = await intranetService.informacoes();
        aniversariantes.value = response.aniversariantes;
        avisos.value = response.avisos;
    } catch (error) {
        console.error('Erro ao buscar informações da intranet:', error);
    } finally {
        isLoading.value = false;
    }
});

const formataData = (data) => {
    const date = new Date(data);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
</script>

<template>
    <section class="highlights-section px-4 py-6">
        <div class="flex flex-wrap gap-6 justify-between">
            <!-- Aniversariantes -->
            <div class="w-full lg:w-[32%] transform transition-all hover:scale-[1.02]">
                <Card class="highlight-card birthday-card h-full border-0">
                    <template #title>
                        <div class="card-title flex items-center gap-3">
                            <div class="icon-wrapper bg-pink-100 p-2 rounded-full">
                                <i class="pi pi-gift text-pink-600"></i>
                            </div>
                            <span class="text-lg font-bold text-gray-800">Aniversariantes do Mês</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="birthday-list">
                            <Skeleton v-if="isLoading" height="80px" class="mb-3" borderRadius="12px" v-for="i in 3" />
                            <div v-for="person in aniversariantes"
                                class="birthday-person flex items-center gap-4 mb-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <Avatar :label="person.name.charAt(0)" shape="circle" size="large"
                                    class="bg-gradient-to-r from-pink-500 to-purple-500 text-white" />
                                <div class="birthday-info flex-1">
                                    <span class="name font-bold text-gray-800">{{ person.name }}</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <i class="pi pi-briefcase text-xs text-gray-400"></i>
                                        <span class="department text-sm text-gray-600">{{ person.setor.setor }}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mt-1">
                                        <i class="pi pi-calendar text-xs text-gray-400"></i>
                                        <span class="date text-xs text-blue-500 font-medium">{{ person.aniversario
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!isLoading && aniversariantes.length === 0"
                                class="text-center py-4 text-gray-500">
                                Nenhum aniversariante este mês
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Avisos Importantes -->
            <div class="w-full lg:w-[32%] transform transition-all hover:scale-[1.02]">
                <Card class="highlight-card announcements-card h-full border-0">
                    <template #title>
                        <div class="card-title flex items-center gap-3">
                            <div class="icon-wrapper bg-amber-100 p-2 rounded-full">
                                <i class="pi pi-megaphone text-amber-600"></i>
                            </div>
                            <span class="text-lg font-bold text-gray-800">Avisos Importantes</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="announcements-list">
                            <Skeleton v-if="isLoading" height="100px" class="mb-3" borderRadius="12px" v-for="i in 2" />
                            <div v-for="aviso in avisos"
                                class="announcement-item mb-4 p-4 rounded-lg bg-gradient-to-r from-amber-50 to-white hover:shadow-sm transition-all">
                                <div class="announcement-header flex items-center justify-between mb-2">
                                    <Tag :value="aviso.categoria" severity="warning" class="text-xs" />
                                    <span class="date text-xs text-gray-400">{{ formataData(aviso.data_criacao)
                                        }}</span>
                                </div>
                                <h4 class="font-bold text-gray-800 mb-2">{{ aviso.titulo }}</h4>
                                <p class="text-sm text-gray-600 mb-3">{{ aviso.texto }}</p>
                                <div class="flex items-center gap-2">
                                    <Avatar :label="aviso.usuario.name.charAt(0)" shape="circle" size="small"
                                        class="bg-gradient-to-r from-amber-500 to-orange-500 text-white" />
                                    <span class="text-xs text-gray-500">Por: {{ aviso.usuario.name }}</span>
                                </div>
                            </div>
                            <div v-if="!isLoading && avisos.length === 0" class="text-center py-4 text-gray-500">
                                Nenhum aviso recente
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Campanha em Destaque -->
            <div class="w-full lg:w-[32%] transform transition-all hover:scale-[1.02]">
                <Card class="highlight-card campaign-card h-full border-0">
                    <template #title>
                        <div class="card-title flex items-center gap-3">
                            <div class="icon-wrapper bg-red-100 p-2 rounded-full">
                                <i class="pi pi-heart text-red-600"></i>
                            </div>
                            <span class="text-lg font-bold text-gray-800">Campanha Social</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="campaign-content text-center">
                            <Skeleton v-if="isLoading" height="150px" class="mb-4" borderRadius="12px" />
                            <img v-else src="../../../public/img/comunicados/doacao_alimentos_comunicado.png"
                                alt="Campanha de Doação"
                                class="campaign-image mx-auto mb-4 rounded-xl shadow-md w-full h-40 object-cover" />

                            <h3 class="text-xl font-bold mb-2 text-gray-800">Alimente uma Vida</h3>
                            <p class="text-sm text-gray-600 mb-4 px-2">Doe 1kg de alimento não perecível e ganhe 10
                                pontos na
                                plataforma de benefícios!</p>

                            <div class="campaign-stats flex justify-around mb-4 bg-gray-50 p-3 rounded-xl">
                                <div class="stat-item text-center">
                                    <span
                                        class="stat-value text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">245</span>
                                    <span class="stat-label text-xs text-gray-500 mt-1 block">Participantes</span>
                                </div>
                                <div class="stat-item text-center">
                                    <span
                                        class="stat-value text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">1.2T</span>
                                    <span class="stat-label text-xs text-gray-500 mt-1 block">Alimentos Doados</span>
                                </div>
                            </div>

                            <Button label="Participar" icon="pi pi-plus"
                                class="p-button-rounded participate-btn shadow-md hover:shadow-lg transition-shadow"
                                severity="danger" />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </section>
</template>

<style scoped>
.highlights-section {
    padding: 0 2rem;
    margin-bottom: 2rem;
}

.highlight-card {
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
    background: white;
}

.highlight-card:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

.card-title {
    display: flex;
    align-items: center;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
    transition: transform 0.3s ease;
}

.highlight-card:hover .icon-wrapper {
    transform: rotate(-10deg) scale(1.1);
}

/* Aniversariantes */
.birthday-card {
    border-top: 4px solid #ec4899;
}

.birthday-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;
}

.birthday-list::-webkit-scrollbar {
    width: 6px;
}

.birthday-list::-webkit-scrollbar-thumb {
    background-color: rgba(236, 72, 153, 0.3);
    border-radius: 3px;
}

.birthday-list::-webkit-scrollbar-track {
    background-color: rgba(236, 72, 153, 0.1);
}

/* Avisos */
.announcements-card {
    border-top: 4px solid #f59e0b;
}

.announcements-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;
}

.announcements-list::-webkit-scrollbar {
    width: 6px;
}

.announcements-list::-webkit-scrollbar-thumb {
    background-color: rgba(245, 158, 11, 0.3);
    border-radius: 3px;
}

.announcements-list::-webkit-scrollbar-track {
    background-color: rgba(245, 158, 11, 0.1);
}

/* Campanha */
.campaign-card {
    border-top: 4px solid #ef4444;
}

.participate-btn {
    background: linear-gradient(to right, #ef4444, #f97316) !important;
    border: none;
    padding: 0.75rem 2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.participate-btn:hover {
    background: linear-gradient(to right, #dc2626, #ea580c) !important;
    transform: translateY(-2px);
}

@media (max-width: 992px) {
    .highlights-section {
        padding: 0 1rem;
    }

    .highlight-card {
        margin-bottom: 1.5rem;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.highlight-card {
    animation: fadeIn 0.5s ease-out forwards;
}

.highlight-card:nth-child(2) {
    animation-delay: 0.1s;
}

.highlight-card:nth-child(3) {
    animation-delay: 0.2s;
}
</style>