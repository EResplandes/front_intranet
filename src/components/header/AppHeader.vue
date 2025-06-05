<script setup>
import MainMenu from '../menu/MainMenu.vue';
import AutenticacaoService from '../../service/AutenticacaoService.js';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const usuarioLogado = ref(localStorage.getItem('token') ? true : false);
const nomeUsuarioLogado = ref(null);
const cargoUsuarioLogado = ref(null);

const formLogin = ref({
    email: '',
    password: ''
});

defineProps({
    menuItems: {
        type: Array,
        required: true
    }
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

const logout = () => {
    localStorage.clear();
    usuarioLogado.value = false;
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

            const user = JSON.parse(localStorage.getItem('user'));
            nomeUsuarioLogado.value = user.name;

            showSuccessToast('Login realizado com sucesso!');
        } else {
            showErrorToast('Credenciais inválidas! Verifique seu e-mail e senha.');
        }
    } catch (error) {
        showErrorToast('Credenciais inválidas! Verifique seu e-mail e senha.');
    }
};
</script>

<template>
    <Toast position="top-right" />

    <header class="app-header">
        <div class="header-main container mx-auto">
            <!-- Logo e Nome da Empresa -->
            <div class="logo-container flex items-center space-x-4">
                <img src="../../../public/img/logo_sem_fundo.png" alt="Logo da Empresa" class="logo h-12 md:h-16" />
            </div>

            <!-- Área do Usuário ou Login -->
            <div class="user-section">
                <!-- Estado: Usuário Logado -->
                <div v-if="usuarioLogado" class="user-area flex items-center space-x-4">

                    <div class="user-profile flex items-center space-x-3">
                        <Avatar icon="pi pi-user" shape="circle" size="large"
                            class="user-avatar bg-white/20 text-white border-2 border-white/30" />
                        <div class="user-info text-right hidden sm:block">
                            <span class="user-name block font-semibold text-white">{{
                                nomeUsuarioLogado ?? 'Usuário' }}</span>
                            <span class="user-role block text-sm text-white/80">{{ cargoUsuarioLogado }}</span>
                        </div>
                    </div>

                    <Button icon="pi pi-sign-out"
                        class="p-button-rounded p-button-text p-button-sm text-white hover:bg-white/10 logout-btn"
                        @click="logout" v-tooltip.top="'Sair'" />
                </div>

                <!-- Estado: Usuário Não Logado -->
                <div v-else class="login-form flex items-center space-x-4">
                    <div class="p-field mb-0">
                        <InputText v-model="formLogin.email" id="email" type="email" placeholder="E-mail"
                            class="w-40 md:w-48" />
                    </div>

                    <div class="p-field mb-0">
                        <Password v-model="formLogin.password" id="password" toggleMask placeholder="Senha"
                            inputClass="w-32 md:w-40" :feedback="false" />
                    </div>

                    <Button :disabled="!formLogin.email || !formLogin.password" label="Entrar" icon="pi pi-sign-in"
                        type="submit" class="p-button-primary p-button-sm md:p-button" @click="handleLogin" />
                </div>
            </div>
        </div>

        <MainMenu :menuItems="menuItems" @openTicketModal="showTicketModal = true" />
    </header>
</template>

<style scoped>
.app-header {
    @apply bg-gradient-to-r from-blue-900 to-blue-800 shadow-md sticky top-0 z-50;
}

.header-main {
    @apply flex justify-between items-center px-4 py-3 md:px-6 md:py-4;
}

.user-section {
    @apply flex items-center;
}

/* Estilos para o avatar do usuário */
.user-avatar {
    @apply transition-all duration-200 hover:scale-105 cursor-pointer;
}

/* Efeitos hover para os botões */
.logout-btn,
.notification-btn {
    @apply transition-colors duration-200;
}

/* Responsividade */
@media (max-width: 640px) {
    .login-form {
        @apply flex-col space-y-2 space-x-0;
    }

    .login-form .p-field {
        @apply w-full;
    }

    .login-form .p-inputtext {
        @apply w-full;
    }
}

/* Animações */
.logo {
    @apply transition-transform duration-300 hover:scale-105;
}
</style>

<style>
/* Estilos personalizados para os toasts */
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