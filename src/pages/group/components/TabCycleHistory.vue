<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-list separator>
    <q-item-label header class="row items-center justify-between">
      <span class="text-weight-bold text-uppercase font-10 text-grey-7">
        Cronograma de Ciclos
      </span>
      <q-btn
        flat
        dense
        size="sm"
        :label="showAllCycles ? 'Ver menos' : 'Ver todos'"
        color="primary"
        @click="showAllCycles = !showAllCycles"
        no-caps
      />
    </q-item-label>

    <q-item
      v-for="cycle in visibleCycles"
      :key="cycle.cycleNumber"
      class="q-py-md"
    >
      <q-item-section avatar>
        <q-avatar
          :color="isCurrentCycle(cycle.cycleStartDate) ? 'primary' : 'grey-2'"
          :text-color="
            isCurrentCycle(cycle.cycleStartDate) ? 'white' : 'grey-7'
          "
          size="40px"
          class="text-weight-bold"
        >
          {{ cycle.cycleNumber }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label
          class="text-weight-bold"
          :class="{
            'text-primary': isCurrentCycle(cycle.cycleStartDate),
          }"
        >
          {{ formatDate(cycle.cycleStartDate) }} -
          {{ formatDate(cycle.cycleEndDate) }}
          <q-badge
            v-if="isCurrentCycle(cycle.cycleStartDate)"
            label="Actual"
            class="q-ml-sm"
          />
        </q-item-label>
        <q-item-label caption>
          Pagamento até:
          <span class="text-weight-bold text-grey-9">
            {{ formatDate(cycle.dueEndDate) }}
          </span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          v-if="canPayCycle(cycle)"
          unelevated
          color="positive"
          label="Paguei"
          icon="payment"
          size="sm"
          no-caps
          class="pay-btn"
          @click="$emit('pay-cycle', cycle)"
        >
          <q-tooltip>Contribuir a este ciclo</q-tooltip>
        </q-btn>

        <q-btn
          v-else-if="isOwner && isCyclePendent(cycle)"
          unelevated
          color="positive"
          label="Confirmar"
          icon="payment"
          size="sm"
          no-caps
          class="pay-btn"
          @click="$emit('pay-confirmation', cycle)"
        >
          <q-tooltip>Confirmar pagemento</q-tooltip>
        </q-btn>

        <!-- Paid Badge -->
        <q-badge
          v-else-if="isCyclePaid(cycle)"
          label="Pago"
          color="positive"
          class="paid-badge"
        />

        <!-- Paid Badge -->
        <q-badge
          v-else-if="isCyclePendent(cycle)"
          label="Pendente"
          color="warning"
          class="paid-badge"
        />

       
        <!-- Details Button -->
        <q-btn
          flat
          round
          icon="chevron_right"
          color="grey-6"
          size="sm"
          @click="$emit('view-cycle', cycle)"
          class="details-btn"
        >
          <q-tooltip>Ver detalhes</q-tooltip>
        </q-btn>

      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cycles: {
    type: Array,
    required: true,
  },
   isOwner: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['view-cycle', 'pay-cycle', 'pay-confirmation']);

const showAllCycles = ref(false);

const isCycleExpired = (cycle) => {
  if (!cycle.dueEndDate) return false;
  const today = new Date();
  const dueDate = new Date(cycle.dueEndDate);
  return today > dueDate;
};

const isCyclePaid = (cycle) => {
  if (!cycle) return false;

  console.log(cycle)

  return (
    cycle.paid === 'Pago'
  );
};

const isCyclePendent = (cycle) => {
  if (!cycle) return false;

  return (
    cycle.paid === 'Pendente'
  );
};


const canPayCycle = (cycle) => {
  // Pode pagar se:
  // 1. O ciclo é atual
  // 2. Não foi pago ainda
  // 3. Não expirou
  return (
    isCurrentCycle(cycle.cycleStartDate) &&
    !isCyclePaid(cycle) &&
    !isCycleExpired(cycle) &&
    !isCyclePendent(cycle)
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  });
};

const isCurrentCycle = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);
  return (
    now.getMonth() === start.getMonth() &&
    now.getFullYear() === start.getFullYear()
  );
};

const visibleCycles = computed(() => {
  const all = props.cycles || [];
  if (showAllCycles.value) return all;

  const now = new Date();
  return all.filter((c) => new Date(c.cycleStartDate) <= now);
});
</script>

<style scoped>
/* Estilos específicos da aba de histórico */
</style>
