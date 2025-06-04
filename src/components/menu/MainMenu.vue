<script setup>
defineProps({
    menuItems: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <nav class="main-nav">
        <Menubar :model="menuItems" class="main-menu">
            <template #start>
                <Button icon="pi pi-home" label="Início" class="p-button-text active" />
            </template>
        </Menubar>
    </nav>
</template>

<style scoped>
.main-nav {
    background-color: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 2rem;
}

.main-menu {
    border: none;
    background: transparent;
}
</style>
