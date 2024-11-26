<script setup lang="ts">

</script> 

<template class="login">
    <div class="card">
        <slot/>
    </div>
</template>

<style scoped>

    .card {
        border: solid 1px var(--bdc-primary);
        border-radius: var(--bdr-2);
        padding: var(--gap-2);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

</style>
