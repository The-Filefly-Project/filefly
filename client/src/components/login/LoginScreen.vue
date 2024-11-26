<script setup lang="ts">

    import Card from '../container/Card.vue'
    import TextInput from '../input/TextInput.vue'

</script>

<template class="login">
    <div class="login-screen">

        <div class="prompt">
            <Card>
                <form>

                    <label for="username">Username</label>
                    <TextInput name="username"/>

                    <label for="password">Password</label>
                    <TextInput name="password"/>

                </form>
            </Card>
        </div>

    </div>
</template>

<style scoped lang="scss">

    .login-screen {
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;           
    }

    .prompt {
        max-width: 320px;
        max-height: 450px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        padding-top: 5rem;

        label {
            display: block;
        }
    }

</style>
