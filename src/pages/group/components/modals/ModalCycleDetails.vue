<template>

  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="rounded-20" style="min-width: 320px">
      <!-- Header -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="text-h6">
          Ciclo ddd {{ cycle?.cycleNumber }}
        </div>
        <div class="text-subtitle2 opacity-80">
          Detalhes do período
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-md">
        <q-list dense>
          <!-- Start Date -->
          <q-item class="q-px-none">
            <q-item-section>
              <q-item-label caption>Início do Ciclo</q-item-label>
              <q-item-label class="text-weight-bold">
                {{ formatDateFull(cycle?.cycleStartDate) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- End Date -->
          <q-item class="q-px-none">
            <q-item-section>
              <q-item-label caption>Fim do Ciclo</q-item-label>
              <q-item-label class="text-weight-bold">
                {{ formatDateFull(cycle?.cycleEndDate) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- Due Date -->
          <q-item class="q-px-none bg-orange-1 rounded-10 q-my-sm">
            <q-item-section>
              <q-item-label caption class="text-orange-9">
                Data Limite de Pagamento
              </q-item-label>
              <q-item-label class="text-weight-bolder text-orange-10">
                {{ formatDateFull(cycle?.dueEndDate) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="event_busy" color="orange-9" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="center" class="q-pb-md">
        <q-btn
          flat
          label="Fechar"
          color="primary"
          v-close-popup
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  cycle: {
    type: Object,
    default: null,
  },
});

defineEmits(['update:modelValue']);

const formatDateFull = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
</script>

<style scoped>
.rounded-10 {
  border-radius: 10px;
}

.rounded-20 {
  border-radius: 20px;
}
</style>
