<template>
  <q-card flat bordered class="rounded-20 bg-white relative-position">
    <!-- Header -->
    <q-card-section class="bg-secondary text-white q-pa-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6">Meu Perfil Financeiro</div>
          <div class="text-subtitle2 opacity-80">{{ user.name }}</div>
        </div>
        <q-avatar
          size="48px"
          color="secondary-light"
          text-color="secondary"
          :src="user.avatar"
        >
          <q-icon name="account_circle" />
        </q-avatar>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Financial Stats -->
    <q-card-section class="q-pa-md">
      <div class="column q-gutter-y-md">
        <!-- Total Balance -->
        <div class="row justify-between items-center q-pa-sm rounded-10 bg-green-1">
          <span class="text-caption text-weight-bold text-green-9">Saldo Total</span>
          <span class="text-weight-bolder text-h6 text-positive">
            {{ formatCurrency(stats.totalBalance) }} MT
          </span>
        </div>

        <!-- Total Contributed -->
        <div class="row justify-between items-center q-pa-sm rounded-10 bg-blue-1">
          <span class="text-caption text-weight-bold text-blue-9">Total Contribuído</span>
          <span class="text-weight-bolder text-h6 text-primary">
            {{ formatCurrency(stats.totalContributed) }} MT
          </span>
        </div>

        <!-- Total Received -->
        <div class="row justify-between items-center q-pa-sm rounded-10 bg-orange-1">
          <span class="text-caption text-weight-bold text-orange-9">Total Recebido</span>
          <span class="text-weight-bolder text-h6 text-orange-10">
            {{ formatCurrency(stats.totalReceived) }} MT
          </span>
        </div>

        <!-- Loans Requested -->
        <div class="column q-gutter-xs q-pa-sm rounded-10 bg-red-1">
          <div class="row justify-between items-center">
            <span class="text-caption text-weight-bold text-red-9">Empréstimos Solicitados</span>
            <span class="text-weight-bolder text-red-10">
              {{ formatCurrency(stats.loansRequested) }} MT
            </span>
          </div>
          <div class="row justify-between items-center">
            <span class="text-caption text-grey-7">Juros Acumulados</span>
            <span class="text-caption text-weight-bold text-red-8">
              {{ formatCurrency(stats.interestAccumulated) }} MT
            </span>
          </div>
          <q-separator spaced />
          <div class="row justify-between items-center">
            <span class="text-caption text-weight-bold text-red-9">Total com Juros</span>
            <span class="text-weight-bolder text-red-10">
              {{ formatCurrency(stats.totalLoansWithInterest) }} MT
            </span>
          </div>
        </div>

        <!-- Loans Paid -->
        <div class="row justify-between items-center q-pa-sm rounded-10 bg-purple-1">
          <span class="text-caption text-weight-bold text-purple-9">Empréstimos Pagos</span>
          <span class="text-weight-bolder text-h6 text-purple-10">
            {{ formatCurrency(stats.loansPaid) }} MT
          </span>
        </div>

        <!-- Remaining Debt -->
        <div
          :class="stats.remainingDebt >= 0 ? 'bg-positive' : 'bg-negative'"
          class="row justify-between items-center q-pa-sm rounded-10"
        >
          <span class="text-caption text-weight-bold text-white">Dívida Restante</span>
          <span class="text-weight-bolder text-h6 text-white">
            {{ formatCurrency(stats.remainingDebt) }} MT
          </span>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Active Groups Info -->
    <q-card-section class="q-pa-md">
      <div class="text-subtitle2 text-weight-bold q-mb-md">Grupos Ativos</div>
      <div class="row q-gutter-sm">
        <q-badge
          v-if="stats.activeGroupsCount > 0"
          color="primary"
          text-color="white"
          class="q-px-md"
        >
          {{ stats.activeGroupsCount }} grupo(s)
        </q-badge>
        <q-badge
          v-if="stats.pendingPaymentsCount > 0"
          color="orange"
          text-color="white"
          class="q-px-md"
        >
          {{ stats.pendingPaymentsCount }} pagamento(s) pendente(s)
        </q-badge>
        <q-badge
          v-if="stats.pendingLoansCount > 0"
          color="red"
          text-color="white"
          class="q-px-md"
        >
          {{ stats.pendingLoansCount }} empréstimo(s) ativo(s)
        </q-badge>
      </div>
    </q-card-section>

    <!-- Quick Stats -->
    <q-card-section class="q-pa-md">
      <div class="text-subtitle2 text-weight-bold q-mb-md">Resumo Rápido</div>
      <div class="column q-gutter-xs">
        <!-- Credit Score -->
        <div class="row justify-between items-center">
          <span class="text-caption text-weight-bold">Score de Confiabilidade</span>
          <div class="row items-center q-gutter-xs">
            <q-linear-progress
              :value="stats.creditScore / 100"
              :color="creditScoreColor(stats.creditScore)"
              size="8px"
              class="col"
              style="max-width: 100px"
            />
            <span class="text-weight-bold text-caption">
              {{ stats.creditScore }}%
            </span>
          </div>
        </div>

        <!-- Default Rate -->
        <div class="row justify-between items-center">
          <span class="text-caption text-weight-bold">Taxa de Adimplência</span>
          <span class="text-weight-bold text-caption text-positive">
            {{ stats.defaultRate }}%
          </span>
        </div>

        <!-- Average Payment Delay -->
        <div class="row justify-between items-center">
          <span class="text-caption text-weight-bold">Atraso Médio de Pagamento</span>
          <span class="text-weight-bold text-caption">
            {{ stats.avgPaymentDelay }} dias
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>

defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      avatar: '',
      email: '',
    }),
  },
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalBalance: 0,
      totalContributed: 0,
      totalReceived: 0,
      loansRequested: 0,
      interestAccumulated: 0,
      totalLoansWithInterest: 0,
      loansPaid: 0,
      remainingDebt: 0,
      activeGroupsCount: 0,
      pendingPaymentsCount: 0,
      pendingLoansCount: 0,
      creditScore: 0,
      defaultRate: 100,
      avgPaymentDelay: 0,
    }),
  },
});

const formatCurrency = (value) => {
  if (!value) return '0.00';
  return parseFloat(value).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const creditScoreColor = (score) => {
  if (score >= 80) return 'positive';
  if (score >= 60) return 'warning';
  return 'negative';
};
</script>

<style scoped>
.rounded-10 {
  border-radius: 10px;
}

.rounded-20 {
  border-radius: 20px;
}

.bg-secondary-light {
  background-color: #f0f0f0;
}

.text-secondary {
  color: #666;
}
</style>
