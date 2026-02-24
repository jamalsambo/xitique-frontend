<template>
  <q-layout class="dashboard-layout">
    <q-page-container>
      <q-page class="dashboard-page q-pa-lg">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Loading State -->
        <div v-if="dashboardStore.loading" class="loading-container">
          <q-spinner size="80px" color="primary" />
          <p class="q-mt-md text-grey-7">Carregando seu dashboard...</p>
        </div>

        <!-- Dashboard Content -->
        <div
          v-else
          class="dashboard-content"
          style="position: relative; z-index: 10"
        >
          <!-- Header Section -->
          <div class="header-section q-mb-lg">
            <div class="row items-center justify-between">
              <div>
                <h1 class="page-title">
                  Olá, {{ userStore.user?.name?.split(' ')[0] }} 👋
                </h1>
                <p class="page-subtitle">{{ currentDate }}</p>
              </div>
              <q-btn
                round
                flat
                icon="tune"
                color="primary"
                class="settings-btn"
                size="lg"
              >
                <q-tooltip>Configurações</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Main Grid -->
          <div class="row q-col-gutter-lg">
            <!-- Left Column: Balance Card & Loans -->
            <div class="col-12 col-lg-7">
              <!-- Balance Card -->
              <q-card class="balance-card">
                <q-card-section class="q-pa-xl">
                  <div class="row justify-between items-start q-mb-lg">
                    <div>
                      <div class="balance-label">Saldo Total Disponível</div>
                      <div class="balance-amount">
                        {{ formatCurrency(total) }}
                        <span class="balance-currency">MT</span>
                      </div>
                    </div>
                    <div class="balance-icon">
                      <q-icon name="account_balance_wallet" size="48px" />
                    </div>
                  </div>

                  <!-- Stats Row -->
                  <div class="row q-gutter-md">
                    <div class="stat-box">
                      <div class="stat-label">Em Dívida</div>
                      <div class="stat-value stat-debt">
                        {{ formatCurrency(InDebt) }}
                      </div>
                    </div>
                    <div class="stat-box">
                      <div class="stat-label">Grupos Ativos</div>
                      <div class="stat-value stat-active">
                        {{ activeGroupsCount }}
                      </div>
                    </div>
                    <div class="stat-box">
                      <div class="stat-label">Taxa Pagamento</div>
                      <div class="stat-value stat-rate">{{ paymentRate }}%</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Loans Section -->
              <div class="q-mt-lg">
                <div class="section-header q-mb-md">
                  <h3 class="section-title">Meus Empréstimos</h3>
                  <q-btn
                    flat
                    color="primary"
                    label="Ver Todos"
                    no-caps
                    size="sm"
                  />
                </div>

                <div v-if="loans.length > 0" class="loans-container">
                  <q-card
                    v-for="loan in loans"
                    :key="loan.id"
                    class="loan-card q-mb-md"
                  >
                    <q-card-section class="q-pa-md">
                      <div class="row items-center justify-between q-mb-sm">
                        <div class="loan-name text-weight-bold">
                          {{ loan.group.name }}
                        </div>
                        <q-badge
                          :color="loan.progress > 80 ? 'negative' : 'primary'"
                          rounded
                          outline
                          class="progress-badge"
                        >
                          {{ loan.paidInstallments }}/{{ loan.installments }}
                        </q-badge>
                      </div>

                      <div class="q-my-md">
                        <q-linear-progress
                          :value="loan.progress / 100"
                          color="primary"
                          rounded
                          class="loan-progress"
                        />
                      </div>

                      <div class="row justify-between items-center">
                        <div class="loan-remaining">
                          <span class="text-caption text-grey-7">Faltam:</span>
                          <span class="text-weight-bold text-primary">
                            {{
                              formatCurrency(
                                loan.amount_requested - loan.totalPaid
                              )
                            }}
                            MT
                          </span>
                        </div>
                        <div class="loan-total">
                          <span class="text-caption text-grey-7">Total:</span>
                          <span class="text-weight-bold text-dark">
                            {{ formatCurrency(loan.amount_requested) }} MT
                          </span>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <div v-else class="empty-state">
                  <q-icon name="savings" size="48px" class="empty-icon" />
                  <p class="empty-text">Nenhum empréstimo ativo</p>
                </div>
              </div>
            </div>

            <!-- Right Column: Next Payments & Activity -->
            <div class="col-12 col-lg-5">
              <!-- Next Payments Card -->
              <div class="q-mb-lg">
                <div class="section-header q-mb-md">
                  <h3 class="section-title">Próximos Vencimentos</h3>
                  <q-icon name="schedule" size="20px" color="primary" />
                </div>

                <q-card class="next-payments-card">
                  <q-card-section class="q-pa-md">
                    <!-- Group Payment -->
                    <div class="payment-item q-mb-md">
                      <div class="payment-header q-mb-sm">
                        <div class="payment-type">
                          <q-avatar
                            color="blue-1"
                            text-color="primary"
                            icon="payments"
                            size="md"
                          />
                          <div class="q-ml-sm">
                            <div class="payment-name">
                              {{ nextPayments.payment?.groupType }}
                            </div>
                            <div class="payment-detail">
                              {{ nextPayments.payment?.groupName }}
                            </div>
                          </div>
                        </div>
                        <div class="payment-amount">
                          {{ formatCurrency(nextPayments.payment?.amountPaid) }}
                          MT
                        </div>
                      </div>
                      <div class="payment-date">
                        ⏰ Vence em {{ nextPayments.payment?.cycleDate }} dias
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <!-- Loan Payment -->
                    <div class="payment-item">
                      <div class="payment-header q-mb-sm">
                        <div class="payment-type">
                          <q-avatar
                            color="orange-1"
                            text-color="orange-9"
                            icon="trending_down"
                            size="md"
                          />
                          <div class="q-ml-sm">
                            <div class="payment-name">Prestação Empréstimo</div>
                            <div class="payment-detail">
                              Juro ({{
                                nextPayments.loanPayment?.interestRate
                              }}%)
                            </div>
                          </div>
                        </div>
                        <div class="payment-amount payment-amount-warning">
                          {{ formatCurrency(nextPayments.loanPayment?.amount) }}
                          MT
                        </div>
                      </div>
                      <div class="payment-date">
                        ⏰ Vence em {{ nextPayments.loanPayment?.dueDate }} dias
                      </div>
                    </div>

                    <q-btn
                      unelevated
                      color="primary"
                      label="Pagar Prestações"
                      icon="send"
                      class="full-width q-mt-lg action-btn"
                      no-caps
                    />
                  </q-card-section>
                </q-card>
              </div>

              <!-- Recent Activity Card -->
              <div>
                <div class="section-header q-mb-md">
                  <h3 class="section-title">Atividade Recente</h3>
                  <q-btn
                    flat
                    color="primary"
                    label="Ver Tudo"
                    no-caps
                    size="sm"
                  />
                </div>

                <q-card class="activity-card">
                  <q-list separator>
                    <q-item
                      v-for="activity in contributions"
                      :key="activity.id"
                      class="activity-item"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          :color="getActivityColor(activity.type)"
                          :text-color="getActivityTextColor(activity.type)"
                          :icon="getActivityIcon(activity.type)"
                          size="md"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="activity-title">
                          {{ activity.group }}
                        </q-item-label>
                        <q-item-label caption class="activity-description">
                          {{ activity.createdAt }} • {{ activity.label }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <div
                          :class="getActivityAmountColor(activity.type)"
                          class="activity-amount"
                        >
                          {{ getActivitySign(activity.type)
                          }}{{ formatCurrency(activity.amount) }}
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, } from 'vue';
import { useDashboardStore } from '../stores';
import { useLoanStore } from '../../loan/store';
import { useAuthStore } from 'src/pages/auth/stores';

// Stores
const dashboardStore = useDashboardStore();
const loanStore = useLoanStore();
const userStore = useAuthStore();

// Data
const contributions = computed(() => userStore.logs);

// Computed
const total = computed(() => dashboardStore.formattedBalance);
const activeGroupsCount = computed(() => dashboardStore.activeGroupsCount);
const InDebt = computed(
  () =>
    dashboardStore.totals.loansRequested - dashboardStore.totals.loanPayments
);
const nextPayments = computed(() => dashboardStore.nextPayments);
const loans = computed(() => loanStore.loans);
const currentDate = computed(() => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('pt-PT', options).format(date);
});

const paymentRate = computed(() => {
  if (dashboardStore.totals.payments === 0) return 0;
  return Math.round(
    (dashboardStore.totals.receivals / dashboardStore.totals.payments) * 100
  );
});

// Methods
const formatCurrency = (value: number | string): string => {
  if (!value) return '0.00';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    recebimento: 'south_west',
    emprestimo: 'trending_down',
    parcela_emprestimo: 'north_east',
  };
  return icons[type] || 'circle';
};

const getActivityColor = (type: string): string => {
  const colors: Record<string, string> = {
    recebimento: 'green-1',
    emprestimo: 'orange-1',
    parcela_emprestimo: 'blue-1',
  };
  return colors[type] || 'grey-1';
};

const getActivityTextColor = (type: string): string => {
  const colors: Record<string, string> = {
    recebimento: 'positive',
    emprestimo: 'orange-9',
    parcela_emprestimo: 'primary',
  };
  return colors[type] || 'grey-9';
};

const getActivityAmountColor = (type: string): string => {
  const colors: Record<string, string> = {
    recebimento: 'text-positive',
    emprestimo: 'text-orange-9',
    parcela_emprestimo: 'text-primary',
  };
  return colors[type] || 'text-grey-9';
};

const getActivitySign = (type: string): string => {
  const signs: Record<string, string> = {
    recebimento: '+',
    emprestimo: '-',
    parcela_emprestimo: '-',
  };
  return signs[type] || '';
};

// Lifecycle
onMounted(() => {
  dashboardStore.fetchDashboard();
  loanStore.fetchLoans(3);
  userStore.fetchLogs(3);
});
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$primary-light: #f0f2ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.dashboard-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.dashboard-page {
  position: relative;
  min-height: 100vh;
}

// ============== BACKGROUND ==============
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(91, 114, 255, 0.05) 0%,
    rgba(0, 217, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 0;
}

// ============== ORBS ==============
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  z-index: 0;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, $primary, $secondary);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, $secondary, $primary);
  bottom: 10%;
  right: -50px;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, $primary, #a78bfa);
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

// ============== CONTENT ==============
.dashboard-content {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// ============== HEADER ==============
.header-section {
  animation: slideInDown 0.6s ease-out;

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 0 0;
    font-weight: 500;
  }

  .settings-btn {
    transition: all 0.3s ease;
    background: white !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba($primary, 0.15);
    }
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== BALANCE CARD ==============
.balance-card {
  background: linear-gradient(135deg, $primary, #7c3aed);
  border: none;
  border-radius: 24px;
  color: white;
  box-shadow: 0 15px 40px rgba($primary, 0.2);
  position: relative;
  overflow: hidden;
  animation: slideInLeft 0.7s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 8s ease-in-out infinite;
  }

  .balance-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .balance-amount {
    font-size: 48px;
    font-weight: 700;
    color: white;
    letter-spacing: -2px;

    .balance-currency {
      font-size: 20px;
      font-weight: 500;
      margin-left: 8px;
      opacity: 0.9;
    }
  }

  .balance-icon {
    opacity: 0.2;
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ============== STATS ==============
.stat-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .stat-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: white;

    &.stat-debt {
      color: #fbbf24;
    }

    &.stat-active {
      color: #86efac;
    }

    &.stat-rate {
      color: #93c5fd;
    }
  }
}

// ============== SECTION HEADER ==============
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }
}

// ============== CARDS ==============
.next-payments-card,
.activity-card,
.loan-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba($primary, 0.2);
    box-shadow: 0 15px 40px rgba($primary, 0.1);
  }
}

// ============== PAYMENT ITEMS ==============
.payment-item {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-type {
  display: flex;
  align-items: center;
  flex: 1;
}

.payment-name {
  font-size: 14px;
  font-weight: 600;
  color: $dark;
}

.payment-detail {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.payment-amount {
  font-size: 16px;
  font-weight: 700;
  color: $primary;
  text-align: right;

  &.payment-amount-warning {
    color: #f59e0b;
  }
}

.payment-date {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
}

// ============== ACTION BUTTON ==============
.action-btn {
  background: linear-gradient(135deg, $primary, #4f5ae4);
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba($primary, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba($primary, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

// ============== LOAN CARD ==============
.loan-card {
  animation: slideInUp 0.5s ease-out;
}

.loan-name {
  font-size: 14px;
  color: $dark;
}

.progress-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
}

.loan-progress {
  border-radius: 8px;
  height: 6px;

  :deep(.q-linear-progress__track) {
    background: rgba($primary, 0.1);
  }
}

.loan-remaining,
.loan-total {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  span {
    line-height: 1.2;
  }
}

// ============== ACTIVITY ==============
.activity-item {
  padding: 16px 0 !important;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba($primary, 0.05);
    padding-left: 8px !important;
  }

  .activity-title {
    font-size: 14px;
    font-weight: 600;
    color: $dark;
  }

  .activity-description {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
  }

  .activity-amount {
    font-size: 14px;
    font-weight: 700;
  }
}

// ============== EMPTY STATE ==============
.empty-state {
  text-align: center;
  padding: 40px 20px;

  .empty-icon {
    color: rgba($primary, 0.2);
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
}

// ============== LOADING ==============
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}

// ============== RESPONSIVE ==============
@media (max-width: 1024px) {
  .balance-amount {
    font-size: 36px;
  }

  .page-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }

  .balance-amount {
    font-size: 28px;
  }

  .stat-box {
    padding: 12px;

    .stat-value {
      font-size: 16px;
    }
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 24px;
}

:deep(.q-item__section--side) {
  padding-right: 0;
}

:deep(.q-linear-progress) {
  border-radius: 8px;
}
</style>
