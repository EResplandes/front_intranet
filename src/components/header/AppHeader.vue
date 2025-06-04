<script setup>
import MainMenu from '../menu/MainMenu.vue';

defineProps({
    menuItems: {
        type: Array,
        required: true
    }
});

const logout = () => {
    // Lógica de logout
};
</script>

<template>
    <header class="app-header">
        <div class="header-main">
            <div class="logo-container">
                <img src="../../../public/img/logo_sem_fundo.png" alt="Logo da Empresa" class="logo" />
            </div>

            <div class="user-area">
                <div class="notifications">
                    <Button icon="pi pi-bell" class="p-button-rounded p-button-text notification-btn" />
                    <span class="badge">3</span>
                </div>
                <Avatar icon="pi pi-user" shape="circle" size="xlarge" class="user-avatar" />
                <div class="user-info">
                    <span class="user-name">Usuário</span>
                    <span class="user-role">Colaborador</span>
                    <Button icon="pi pi-sign-out" label="Sair" class="p-button-text p-button-sm logout-btn" @click="logout" />
                </div>
            </div>
        </div>

        <MainMenu :menuItems="menuItems" @openTicketModal="showTicketModal = true" />
    </header>
</template>

<style scoped>
/* Estilos do header (copie os estilos relevantes do CSS original) */
.app-header {
    background-color: white;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, #1e3a8a 0%, #014585 100%);
    color: white;
    min-height: 60px;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo {
    height: 60px;
}

.user-area {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.notifications {
    position: relative;
    display: flex;
    align-items: center;
}

.notification-btn {
    color: white !important;
    font-size: 1.2rem;
}

.badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-avatar {
    background-color: #93c5fd;
    color: #1e3a8a;
    font-size: 1.5rem;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.user-role {
    font-size: 0.9rem;
    opacity: 0.9;
}

.logout-btn {
    color: white !important;
    margin-top: 0.5rem;
}

@media (max-width: 992px) {
    .header-main {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        min-height: auto;
    }

    .logo-container {
        flex-direction: column;
        text-align: center;
    }

    .user-area {
        width: 100%;
        justify-content: space-between;
    }
}
</style>
