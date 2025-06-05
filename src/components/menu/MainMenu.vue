<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();

// Itens do menu
const menuItems = ref([
    { label: 'Início', icon: 'pi pi-home', to: '/landing' },
    { label: 'RH', icon: 'pi pi-users', to: '/rh' },
    { label: 'Meus Chamados', icon: 'pi pi-desktop', to: '/tickets' },
    { label: 'Campanhas', icon: 'pi pi-heart', to: '/campanhas' },
    { label: 'Documentos', icon: 'pi pi-folder', to: '/documentos' },
    { label: 'FAQ', icon: 'pi pi-question', to: '/comunicados' }
]);

const isActiveRoute = (menuItem) => {
    return route.path === menuItem.to || route.path.startsWith(menuItem.to + '/');
};
</script>

<template>
    <nav class="main-nav">
        <div class="nav-container">
            <Menubar :model="menuItems" class="main-menu">
                <template #item="{ item }">
                    <router-link v-if="item.to" :to="item.to" class="menu-link">
                        <Button :icon="item.icon" :label="item.label" class="p-button-text menu-button"
                            :class="{ 'active-menu-item': isActiveRoute(item) }" />
                    </router-link>
                    <Button v-else :icon="item.icon" :label="item.label" class="p-button-text menu-button" />
                </template>
            </Menubar>
        </div>
    </nav>
</template>

<style scoped>
.main-nav {
    @apply bg-white shadow-sm sticky top-0 z-40;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-container {
    @apply container mx-auto px-4;
}

.main-menu {
    @apply border-none bg-transparent h-16 flex items-center;
}

.menu-button {
    @apply px-4 py-3 mx-1 rounded-lg transition-all duration-200;
    color: #4b5563;
}

.menu-button:hover {
    @apply bg-blue-50 text-blue-600 shadow-sm;
}

.menu-button:focus {
    @apply shadow-none;
}

.active-menu-item {
    @apply text-blue-600 font-medium bg-blue-50;
    position: relative;
}

.active-menu-item::after {
    content: '';
    @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-500 rounded-full;
}

.menu-link {
    @apply no-underline;
}

/* Efeito de sublinhado animado */
.menu-button:not(.active-menu-item):hover::after {
    content: '';
    @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-blue-300 rounded-full;
    animation: underlineGrow 0.2s ease-out;
}

@keyframes underlineGrow {
    from {
        width: 0;
        opacity: 0;
    }

    to {
        width: 1rem;
        opacity: 1;
    }
}

/* Ícones */
.pi {
    @apply mr-2;
}

/* Responsividade */
@media (max-width: 768px) {
    .main-menu {
        @apply h-14;
    }

    .menu-button {
        @apply px-3 py-2 mx-0.5 text-sm;
    }

    .pi {
        @apply mr-1;
    }
}
</style>