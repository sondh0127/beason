<script lang="ts" setup>

</script>

<template>
  <div>
    <button class="btn" @click="() => signIn()">
      Login
    </button>
    <button class="btn" @click="() => signIn('github')">
      Login with Github
    </button>
    <button class="btn" @click="() => signIn('line', { callbackUrl: 'http://next-auth.local/api/auth/callback/line' })">
      Login with Line
    </button>
  </div>
</template>
