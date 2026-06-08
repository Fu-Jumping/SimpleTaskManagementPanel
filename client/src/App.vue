<template>
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
const themeConfig = {
  token: {
    colorPrimary: '#00bfa5',
    borderRadius: 8
  }
};
</script>

