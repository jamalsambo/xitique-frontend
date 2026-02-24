<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

// PWA - Notificar quando há atualização
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    $q.notify({
      type: 'positive',
      message: 'App atualizado! Recarregue a página.',
      position: 'top'
    })
  })
}
</script>
