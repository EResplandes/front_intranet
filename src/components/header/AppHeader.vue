<script setup>
import MainMenu from '../menu/MainMenu.vue';
import AutenticacaoService from '../../service/AutenticacaoService.js';
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const usuarioLogado = ref(localStorage.getItem('token') ? true : false);
const nomeUsuarioLogado = ref(null);
const cargoUsuarioLogado = ref(null);
const showUserDropdown = ref(false);

const formLogin = ref({
    email: '',
    password: ''
});

const userStorage = localStorage.getItem('user');
if (userStorage) {
    try {
        const user = JSON.parse(userStorage);
        nomeUsuarioLogado.value = user.name;
        cargoUsuarioLogado.value = user.cargo;
    } catch (e) {
        nomeUsuarioLogado.value = 'Usuário';
    }
}

const initials = computed(() => {
    if (!nomeUsuarioLogado.value) return 'U';
    const names = nomeUsuarioLogado.value.split(' ');
    return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`
        : names[0][0];
});

const logout = () => {
    localStorage.clear();
    usuarioLogado.value = false;
    showUserDropdown.value = false;
    showSuccessToast('Logout realizado com sucesso!');
};

const showErrorToast = (message) => {
    toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: message,
        life: 5000,
        closable: true,
        styleClass: 'custom-toast-error'
    });
};

const showSuccessToast = (message) => {
    toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: message,
        life: 5000,
        closable: true,
        styleClass: 'custom-toast-success'
    });
};

const handleLogin = async () => {
    try {
        const response = await new AutenticacaoService().login(formLogin.value);

        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.usuario));
            usuarioLogado.value = true;
            nomeUsuarioLogado.value = response.usuario.name;
            cargoUsuarioLogado.value = response.usuario.cargo;

            showSuccessToast('Login realizado com sucesso!');
            formLogin.value = { email: '', password: '' };
        } else {
            showErrorToast('Credenciais inválidas!');
        }
    } catch (error) {
        showErrorToast(error.response?.data?.message || 'Erro ao realizar login');
    }
};
</script>

<template>
    <Toast position="top-right" />

    <header class="app-header">
        <div class="header-main container mx-auto">
            <!-- Logo e Nome da Empresa -->
            <div class="logo-container flex items-center">
                <router-link to="/" class="flex items-center hover:opacity-90 transition-opacity">
                    <img src="../../../public/img/logo_sem_fundo.png" alt="Logo da Empresa"
                        class="logo h-10 md:h-12 transition-all duration-300" />
                </router-link>
            </div>

            <!-- Área do Usuário ou Login -->
            <div class="user-section relative">
                <!-- Estado: Usuário Logado -->
                <div v-if="usuarioLogado" class="user-area flex items-center space-x-3">
                    <div class="user-profile flex items-center cursor-pointer"
                        @click="showUserDropdown = !showUserDropdown">
                        <div class="relative">
                            <Avatar :label="initials" shape="circle" size="normal"
                                class="user-avatar bg-gradient-to-br from-blue-400 to-blue-600 text-white border border-white/20 shadow-sm" />
                        </div>
                        <div class="user-info text-right hidden md:block ml-2">
                            <span class="user-name block font-medium text-white text-sm leading-tight">
                                {{ nomeUsuarioLogado ?? 'Usuário' }}
                            </span>
                            <span class="user-role block text-xs text-white/80 font-light">
                                {{ cargoUsuarioLogado }}
                            </span>
                        </div>
                    </div>

                    <Button icon="pi pi-sign-out"
                        class="p-button-rounded p-button-text p-button-sm text-white hover:bg-white/10 logout-btn ml-1"
                        @click="logout" v-tooltip.top="'Sair'" />

                    <transition name="fade">
                        <div v-if="showUserDropdown" class="user-dropdown absolute right-0 top-full mt-1 w-56 z-50">
                            <div class="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                                <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    <div class="font-medium text-sm">{{ nomeUsuarioLogado }}</div>
                                    <div class="text-xs opacity-80">{{ cargoUsuarioLogado }}</div>
                                </div>
                                <div class="py-1">
                                    <router-link to="/perfil"
                                        class="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        <i class="pi pi-user mr-3 text-blue-500 text-xs"></i> Meu Perfil
                                    </router-link>
                                    <div class="border-t border-gray-100"></div>
                                    <button @click="logout"
                                        class="dropdown-item w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                                        <i class="pi pi-sign-out mr-3 text-red-500 text-xs"></i> Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- Estado: Usuário Não Logado -->
                <div v-else class="login-form flex items-center space-x-2">
                    <div class="p-field mb-0">
                        <InputText v-model="formLogin.email" id="email" type="email" placeholder="E-mail"
                            class="w-40 md:w-48 h-[36px] text-sm" />
                    </div>

                    <div class="p-field mb-0">
                        <Password v-model="formLogin.password" id="password" toggleMask placeholder="Senha"
                            inputClass="w-32 md:w-40 h-[36px] text-sm" :feedback="false" />
                    </div>

                    <Button :disabled="!formLogin.email || !formLogin.password" label="Entrar" icon="pi pi-sign-in"
                        type="submit" class="p-button-primary p-button-sm h-[36px] md:p-button" @click="handleLogin" />
                </div>
            </div>
        </div>

        <MainMenu :menuItems="menuItems" @openTicketModal="showTicketModal = true" />
    </header>
</template>

<style scoped>
.app-header {
    @apply bg-gradient-to-r from-blue-800 to-blue-700 shadow-sm sticky top-0 z-50;
    height: 56px;
    /* Altura reduzida */
}

.header-main {
    @apply flex justify-between items-center px-4 h-full;
    /* Removido padding vertical */
}

.user-section {
    @apply flex items-center h-full;
}

.user-avatar {
    @apply transition-all duration-300;
    width: 32px !important;
    height: 32px !important;
    font-size: 0.75rem !important;
}

.user-dropdown {
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Manter o tamanho original do formulário de login */
.login-form {
    @apply h-[36px];
    /* Altura fixa para manter o form do mesmo tamanho */
}

/* Responsividade */
@media (max-width: 640px) {
    .login-form {
        @apply flex-col space-y-2 space-x-0 h-auto;
    }

    .login-form .p-field {
        @apply w-full;
    }

    .login-form .p-inputtext,
    .login-form .p-password {
        @apply w-full;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<style>
/* Estilos personalizados para os toasts (mantidos iguais) */
.custom-toast-error .p-toast-message {
    background-color: #fff1f1;
    border-color: #ffcccc;
    color: #cc0000;
}

.custom-toast-error .p-toast-message-icon {
    color: #cc0000;
}

.custom-toast-success .p-toast-message {
    background-color: #f0fff0;
    border-color: #ccffcc;
    color: #006600;
}

.custom-toast-success .p-toast-message-icon {
    color: #006600;
}

.p-toast .p-toast-message .p-toast-message-content {
    @apply p-4;
}

.p-toast .p-toast-message .p-toast-message-content .p-toast-detail {
    @apply mt-1;
}
</style>