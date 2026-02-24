<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-card flat bordered class="rounded-20 bg-white relative-position">
    <!-- Settings Button -->
    <div class="absolute-top-right q-pa-xs z-top">
      <q-btn
        flat
        dense
        round
        icon="settings"
        color="grey-7"
        size="sm"
        @click="$emit('go-to-settings')"
      >
        <q-tooltip class="bg-primary text-white">
          Configurações e Regras
        </q-tooltip>
      </q-btn>
    </div>

    <!-- Group Header Section -->
    <q-card-section class="text-center q-pa-md q-mt-xs">
      <q-avatar
        size="64px"
        color="primary-light"
        text-color="primary"
        icon="groups"
      />

      <div class="text-subtitle1 text-weight-bold q-mt-sm">
        {{ group.name }}
      </div>

      <div class="text-caption text-grey-7">
        Criado em {{ formatDateFull(group.created_at) }}
      </div>

      <q-badge
        class="q-mt-xs"
        color="positive"
        :label="`Ciclo ${group.currentCycle} de ${group.cicle_number}`"
        padding="xs sm"
        rounded
      />
    </q-card-section>

    <q-separator />

    <!-- Financial Stats -->
    <q-card-section class="q-pa-md">
      <div class="column q-gutter-y-sm">
        <!-- Payments and Receivals -->
        <div class="row justify-between">
          <span class="text-caption text-grey-7">Total Pago</span>
          <span class="text-weight-bold text-blue-9">
            {{ totals?.payments }} MT
          </span>
        </div>

        <div class="row justify-between">
          <span class="text-caption text-grey-7">Total Recebido</span>
          <span class="text-weight-bold text-positive">
            {{ totals?.receivals }} MT
          </span>
        </div>

        <!-- Loans Section -->
        <div class="column">
          <div class="row justify-between">
            <span class="text-caption text-grey-7">Empréstimos (Capital)</span>
            <span class="text-weight-bold">
              {{ totals?.loanPrincipal }} MT
            </span>
          </div>

          <div class="row justify-between">
            <span class="text-caption text-grey-6">Juros</span>
            <span class="text-caption text-orange-8">
              {{ totals?.loanInterest }} MT
            </span>
          </div>

          <q-separator spaced />

          <div class="row justify-between">
            <span class="text-caption text-grey-7">Total</span>
            <span class="text-weight-bold text-orange-9">
              {{ totals?.loansRequested }} MT
            </span>
          </div>
        </div>

        <div class="row justify-between">
          <span class="text-caption text-grey-7">Dívida Amortizada</span>
          <span class="text-weight-bold text-grey-9">
            {{ totals?.loanPayments }} MT
          </span>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- Quick Stats -->
    <q-card-section class="q-pa-sm">
      <div class="column q-gutter-xs">
        <div
          class="row justify-between items-center bg-grey-1 q-pa-sm rounded-10"
        >
          <span class="text-body2 text-weight-bold">Pago no mês</span>
          <span class="text-weight-bolder text-primary">
            {{ totals?.currentMonthPayments }} MT
          </span>
        </div>

        <div
          class="row justify-between items-center bg-grey-1 q-pa-sm rounded-10"
        >
          <span class="text-body2 text-weight-bold">Posição Líquida</span>
          <span
            :class="balance >= 0 ? 'text-positive' : 'text-negative'"
            class="text-weight-bolder text-subtitle2"
          >
            {{ balance }} MT
          </span>
        </div>
      </div>
    </q-card-section>

    <!-- Action Buttons -->
    <q-card-section class="q-pa-md">
      <div class="column q-gutter-sm">
        <q-btn
          color="orange-9"
          unelevated
          outline
          class="full-width rounded-15 no-caps"
          icon="add_circle"
          label="Solicitar Empréstimo"
          @click="$emit('show-loan-modal')"
        />
        <q-btn
          color="primary"
          unelevated
          outline
          class="full-width rounded-15 no-caps"
          icon="shopping_cart"
          label="Meus Itens"
          @click="$emit('show-items-modal')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

defineEmits(['go-to-settings', 'show-loan-modal', 'show-items-modal']);

const totals = computed(() => props.group.totals);

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
.bg-primary-light {
  background-color: #eef2ff;
}

.rounded-10 {
  border-radius: 10px;
}

.rounded-15 {
  border-radius: 15px;
}

.rounded-20 {
  border-radius: 20px;
}

.z-top {
  z-index: 10;
  pointer-events: all !important;
}

.relative-position {
  position: relative;
}
</style>
