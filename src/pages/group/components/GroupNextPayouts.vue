<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-card flat class="rounded-20 q-mt-md bg-primary text-white">
    <q-card-section>
      <div class="text-subtitle2 opacity-80">Próximo(s) a receber</div>

      <!-- 🔄 LOADING -->
      <div v-if="loading" class="q-mt-md">
        <div v-for="i in 2" :key="i" class="row items-center q-mb-sm">
          <q-skeleton type="QAvatar" size="40px" />
          <q-skeleton class="q-ml-md" width="60%" />
        </div>
      </div>

      <!-- ❌ ERRO -->
      <div v-else-if="error" class="q-mt-md text-caption text-red-2">
        {{ error }}
      </div>

      <!-- 📭 SEM DADOS -->
      <div
        v-else-if="!nextReceived || nextReceived.length === 0"
        class="q-mt-md text-caption opacity-80 italic"
      >
        Nenhum membro definido para os próximos ciclos
      </div>

      <!-- ✅ LISTA -->
      <div v-else class="q-mt-sm">
        <div
          v-for="item in nextReceived"
          :key="item.id"
          class="row items-center q-mb-md"
        >
          <q-avatar size="40px" class="bg-white-transparent shadow-1">
            <img
              :src="item.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
            />
          </q-avatar>

          <div class="q-ml-md">
            <div class="text-weight-bold text-subtitle1">
              {{ item.member.phone }}
            </div>

            <div class="text-caption opacity-80 italic">
              Data prevista: {{ item.payout_date }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  nextReceived: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
.rounded-20 {
  border-radius: 20px;
}

.bg-white-transparent {
  background: rgba(255, 255, 255, 0.2);
}
</style>
