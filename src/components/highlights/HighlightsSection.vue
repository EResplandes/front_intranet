<script setup>
defineProps({
    birthdays: {
        type: Array,
        required: true
    },
    announcements: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <section class="highlights-section px-4 py-6">
        <div class="flex flex-wrap gap-4 justify-between">
            <!-- Aniversariantes -->
            <div class="w-full lg:w-[32%]">
                <Card class="highlight-card birthday-card h-full">
                    <template #title>
                        <div class="card-title flex items-center gap-2">
                            <i class="pi pi-gift"></i>
                            <span>Aniversariantes do Mês</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="birthday-list">
                            <div v-for="person in birthdays" :key="person.name" class="birthday-person flex items-center gap-3 mb-3">
                                <Avatar :image="person.photo" shape="circle" size="large" />
                                <div class="birthday-info">
                                    <span class="name font-bold">{{ person.name }}</span
                                    ><br />
                                    <span class="department text-sm">{{ person.department }}</span
                                    ><br />
                                    <span class="date text-xs text-gray-500">{{ person.date }}</span>
                                </div>
                            </div>
                        </div>
                        <Button label="Ver Todos" icon="pi pi-users" class="p-button-text see-all-btn mt-4" />
                    </template>
                </Card>
            </div>

            <!-- Avisos Importantes -->
            <div class="w-full lg:w-[32%]">
                <Card class="highlight-card announcements-card h-full">
                    <template #title>
                        <div class="card-title flex items-center gap-2">
                            <i class="pi pi-megaphone"></i>
                            <span>Avisos Importantes</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="announcements-list">
                            <div v-for="(announcement, index) in announcements" :key="index" class="announcement-item mb-4">
                                <div class="announcement-header flex items-center justify-between mb-1">
                                    <Tag :value="announcement.type" :severity="announcement.severity" />
                                    <span class="date text-sm text-gray-500">{{ announcement.date }}</span>
                                </div>
                                <h4 class="font-semibold">{{ announcement.title }}</h4>
                                <p class="text-sm text-gray-700">{{ announcement.summary }}</p>
                            </div>
                        </div>
                        <Button label="Ver Todos" icon="pi pi-list" class="p-button-text see-all-btn mt-4" />
                    </template>
                </Card>
            </div>

            <!-- Campanha em Destaque -->
            <div class="w-full lg:w-[32%]">
                <Card class="highlight-card campaign-card h-full">
                    <template #title>
                        <div class="card-title flex items-center gap-2">
                            <i class="pi pi-heart"></i>
                            <span>Campanha Social</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="campaign-content text-center">
                            <img src="../../../public/img/comunicados/doacao_alimentos_comunicado.png" alt="Campanha de Doação" class="campaign-image mx-auto mb-3" />
                            <h3 class="text-lg font-bold mb-1">Alimente uma Vida</h3>
                            <p class="text-sm text-gray-700 mb-4">Doe 1kg de alimento não perecível e ganhe 10 pontos na plataforma de benefícios!</p>
                            <div class="campaign-stats flex justify-around mb-4">
                                <div class="stat-item text-center">
                                    <span class="stat-value text-xl font-bold">245</span><br />
                                    <span class="stat-label text-xs">Participantes</span>
                                </div>
                                <div class="stat-item text-center">
                                    <span class="stat-value text-xl font-bold">1.2T</span><br />
                                    <span class="stat-label text-xs">Alimentos Doados</span>
                                </div>
                            </div>
                            <Button label="Participar" icon="pi pi-plus" class="p-button-rounded participate-btn" />
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
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: none;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.card-title i {
    font-size: 1.2rem;
}

/* Aniversariantes */
.birthday-card .card-title i {
    color: #ec4899;
}

.birthday-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.birthday-person {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.birthday-info {
    display: flex;
    flex-direction: column;
}

.birthday-info .name {
    font-weight: 600;
}

.birthday-info .department {
    font-size: 0.85rem;
    color: #6b7280;
}

.birthday-info .date {
    font-size: 0.8rem;
    color: #3b82f6;
    font-weight: 500;
}

.see-all-btn {
    margin-top: 1rem;
    color: #014585 !important;
}

/* Avisos */
.announcements-card .card-title i {
    color: #f59e0b;
}

.announcements-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.announcement-item {
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
}

.announcement-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.announcement-item h4 {
    margin: 0.25rem 0;
    color: #1e3a8a;
}

.announcement-item p {
    margin: 0;
    font-size: 0.9rem;
    color: #4b5563;
}

.announcement-item .date {
    font-size: 0.8rem;
    color: #9ca3af;
}

/* Campanha */
.campaign-card .card-title i {
    color: #ef4444;
}

.campaign-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.campaign-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.campaign-content h3 {
    color: #1e3a8a;
    margin: 0.5rem 0;
}

.campaign-content p {
    color: #4b5563;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.campaign-stats {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 1rem 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e3a8a;
}

.stat-label {
    font-size: 0.8rem;
    color: #6b7280;
}

.participate-btn {
    background-color: #014585 !important;
    border: none;
    padding: 0.75rem 1.5rem;
    margin-top: 0.5rem;
}

@media (max-width: 992px) {
    .highlights-section {
        padding: 0 1rem;
    }
}
</style>
