<script setup lang="ts">

    import { useAttrs } from 'vue'

    const attrs = useAttrs()

</script>

<template>
    <input v-bind="attrs">
</template>

<style scoped lang="scss">

    input {
        background: transparent;
        border: solid 1px var(--bdc-primary);
        border-radius: var(--bdr-2);
        padding: var(--gap-2);
        box-sizing: border-box;
        width: 100%;
        &:active, &:focus {
            outline: solid 1px var(--bdc-focus);
        }
    }

</style>