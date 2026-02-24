<template>
  <q-layout class="history-layout">
    <q-page-container>
      <q-page class="history-page q-pa-lg">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Header Section -->
        <div
          class="header-section q-mb-xl"
          style="position: relative; z-index: 10"
        >
          <h1 class="page-title">Histórico de Transações</h1>
          <p class="page-subtitle">
            Acompanhe suas contribuições, recebimentos e empréstimos
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="loading-container"
          style="position: relative; z-index: 10"
        >
          <q-spinner size="80px" color="primary" />
          <p class="q-mt-md text-grey-7">Carregando histórico...</p>
        </div>

        <!-- Content -->
        <div
          v-else
          class="content-section"
          style="position: relative; z-index: 10"
        >
          <!-- Latest Transaction Card -->
          <q-card v-if="latestTransaction" class="latest-card q-mb-lg">
            <q-card-section class="q-pa-lg">
              <div class="latest-header">
                <div class="latest-content">
                  <div class="latest-label">Última Transação</div>
                  <div class="latest-amount">
                    {{ getAmountSign(latestTransaction?.type)
                    }}{{ formatCurrency(latestTransaction?.amount) }}
                    <span class="latest-currency">MZN</span>
                  </div>
                  <div class="latest-group">{{ latestTransaction?.group }}</div>
                  <div class="latest-type">
                    {{ getTransactionTypeLabel(latestTransaction?.type) }}
                  </div>
                </div>
                <div class="latest-icon">
                  <q-icon
                    :name="getTransactionIcon(latestTransaction?.type)"
                    size="64px"
                  />
                </div>
              </div>

              <!-- Latest Stats -->
              <div class="latest-stats q-mt-lg">
                <div class="stat-box">
                  <span class="stat-label">Total Mês</span>
                  <span class="stat-value"
                    >{{ formatCurrency(monthlyTotal) }} MZN</span
                  >
                </div>
                <q-separator vertical />
                <div class="stat-box">
                  <span class="stat-label">Transações</span>
                  <span class="stat-value">{{ transactions.length }}</span>
                </div>
                <q-separator vertical />
                <div class="stat-box">
                  <span class="stat-label">Saldo Líquido</span>
                  <span
                    class="stat-value"
                    :class="{
                      'text-positive': liquidBalance >= 0,
                      'text-danger': liquidBalance < 0,
                    }"
                  >
                    {{ formatCurrency(liquidBalance) }} MZN
                  </span>
                </div>
              </div>

              <!-- Date Info -->
              <div class="date-info q-mt-md">
                <q-icon name="schedule" color="primary" size="sm" />
                <span>{{ formatDate(latestTransaction.createdAt) }}</span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Filters & Search -->
          <div class="filters-section q-mb-lg">
            <q-card class="filters-card">
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="searchQuery"
                      outlined
                      dense
                      placeholder="Pesquisar grupo..."
                      prefix-icon="search"
                      clearable
                      class="search-input"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="selectedMonth"
                      :options="monthOptions"
                      outlined
                      dense
                      emit-value
                      map-options
                      clearable
                      placeholder="Todos os meses"
                      class="filter-select"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calendar_month" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="selectedType"
                      :options="typeOptions"
                      outlined
                      dense
                      emit-value
                      map-options
                      clearable
                      placeholder="Todos os tipos"
                      class="filter-select"
                    >
                      <template v-slot:prepend>
                        <q-icon name="filter_alt" />
                      </template>
                    </q-select>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Transactions List -->
          <div
            v-if="filteredTransactions.length > 0"
            class="transactions-section"
          >
            <q-card class="list-card">
              <q-virtual-scroll
                :items="filteredTransactions"
                virtual-scroll-item-size="80"
              >
                <template v-slot="{ item: transaction, index }">
                  <div class="transaction-item">
                    <q-item class="item-content">
                      <!-- Avatar -->
                      <q-item-section avatar>
                        <q-avatar
                          rounded
                          :color="getTransactionColor(transaction.type)"
                          text-color="white"
                          :icon="getTransactionIcon(transaction.type)"
                          size="md"
                          class="avatar-shadow"
                        />
                      </q-item-section>

                      <!-- Content -->
                      <q-item-section>
                        <q-item-label class="item-title">
                          {{ transaction.group }}
                        </q-item-label>
                        <q-item-label caption class="item-description">
                          {{ transaction.description }}
                        </q-item-label>
                        <q-item-label caption class="item-date">
                          {{ formatDate(transaction.createdAt) }} •
                          {{ getTransactionTypeLabel(transaction.type) }}
                        </q-item-label>
                      </q-item-section>

                      <!-- Amount & Status -->
                      <q-item-section side>
                        <div class="amount-section">
                          <div
                            class="item-amount"
                            :class="getAmountClass(transaction.type)"
                          >
                            {{ getAmountSign(transaction.type)
                            }}{{ formatCurrency(transaction.amount) }}
                          </div>
                          <q-badge
                            v-if="transaction.status"
                            :color="getStatusColor(transaction.status)"
                            :text-color="getStatusTextColor(transaction.status)"
                            rounded
                            outline
                            class="status-badge"
                          >
                            {{ transaction.status }}
                          </q-badge>
                        </div>
                      </q-item-section>
                    </q-item>

                    <!-- Separator -->
                    <q-separator
                      v-if="index !== filteredTransactions.length - 1"
                      inset="item"
                      class="item-separator"
                    />
                  </div>
                </template>
              </q-virtual-scroll>
            </q-card>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <q-card class="empty-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="inbox" size="80px" class="empty-icon" />
                <h3 class="empty-title">Nenhuma Transação</h3>
                <p class="empty-message">
                  {{
                    searchQuery || selectedMonth || selectedType
                      ? 'Nenhuma transação encontrada com estes filtros'
                      : 'Você ainda não tem histórico de transações'
                  }}
                </p>
              </q-card-section>
            </q-card>
          </div>

          <!-- Statistics Section -->
          <div v-if="transactions.length > 0" class="stats-section q-mt-lg">
            <div class="section-header q-mb-md">
              <h3 class="section-title">Estatísticas</h3>
            </div>

            <div class="row q-col-gutter-lg">
              <!-- Total Contributed -->
              <div class="col-12 col-md-3">
                <q-card class="stat-card">
                  <q-card-section class="q-pa-md">
                    <div class="stat-header">
                      <q-icon name="trending_up" color="primary" size="md" />
                      <span class="stat-label">Contribuições</span>
                    </div>
                    <div class="stat-value">
                      {{ formatCurrency(totalContribucoes) }} MZN
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Total Received -->
              <div class="col-12 col-md-3">
                <q-card class="stat-card">
                  <q-card-section class="q-pa-md">
                    <div class="stat-header">
                      <q-icon name="south_west" color="success" size="md" />
                      <span class="stat-label">Recebimentos</span>
                    </div>
                    <div class="stat-value text-positive">
                      {{ formatCurrency(totalRecebimentos) }} MZN
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Total Loans -->
              <div class="col-12 col-md-3">
                <q-card class="stat-card">
                  <q-card-section class="q-pa-md">
                    <div class="stat-header">
                      <q-icon name="account_balance" color="orange" size="md" />
                      <span class="stat-label">Empréstimos</span>
                    </div>
                    <div class="stat-value text-danger">
                      {{ formatCurrency(totalEmprestimos) }} MZN
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Total Installments -->
              <div class="col-12 col-md-3">
                <q-card class="stat-card">
                  <q-card-section class="q-pa-md">
                    <div class="stat-header">
                      <q-icon name="payment" color="blue" size="md" />
                      <span class="stat-label">Parcelas</span>
                    </div>
                    <div class="stat-value">
                      {{ formatCurrency(totalParcelas) }} MZN
                    </div>
                  </q-card-section>
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
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from './auth/stores';

const auth = useAuthStore();
// Variables
const loading = ref(false);
const searchQuery = ref('');
const selectedMonth = ref<string | null>(null);
const selectedType = ref<string | null>(null);

const transactions = computed(() => auth.logs);

onMounted(async () => {
  await auth.fetchLogs(1000);
});

const monthOptions = [
  { label: 'Janeiro 2026', value: '2026-01' },
  { label: 'Dezembro 2025', value: '2025-12' },
  { label: 'Novembro 2025', value: '2025-11' },
];

const typeOptions = [
  { label: 'Contribuição', value: 'contribuicao' },
  { label: 'Recebimento', value: 'recebimento' },
  { label: 'Empréstimo', value: 'emprestimo' },
  { label: 'Parcela de Empréstimo', value: 'parcela_emprestimo' },
];

// Computed
const latestTransaction = computed(() => transactions.value[0]);

const filteredTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const matchesSearch = t.group;

    const matchesMonth =
      !selectedMonth.value || t.createdAt.startsWith(selectedMonth.value);
    const matchesType = !selectedType.value || t.type === selectedType.value;
    return matchesSearch && matchesMonth && matchesType;
  });
});

const totalContribucoes = computed(() => {
  return transactions.value.reduce((sum, t) => {
    if (t.type === 'contribuicao') sum += t.amount;
    return sum;
  }, 0);
});

const totalRecebimentos = computed(() => {
  return transactions.value.reduce((sum, t) => {
    if (t.type === 'recebimento') sum += t.amount;
    return sum;
  }, 0);
});

const totalEmprestimos = computed(() => {
  return transactions.value.reduce((sum, t) => {
    if (t.type === 'emprestimo') sum += t.amount;
    return sum;
  }, 0);
});

const totalParcelas = computed(() => {
  return transactions.value.reduce((sum, t) => {
    if (t.type === 'parcela_emprestimo') sum += t.amount;
    return sum;
  }, 0);
});

const liquidBalance = computed(() => {
  return (
    totalContribucoes.value +
    totalRecebimentos.value -
    (totalEmprestimos.value + totalParcelas.value)
  );
});

const monthlyTotal = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return transactions.value.reduce((sum, t) => {
    if (t.createdAt.startsWith(currentMonth)) {
      if (
        t.type === 'contribuicao' ||
        t.type === 'recebimento' ||
        t.type === 'parcela_emprestimo'
      ) {
        sum += t.amount;
      } else if (t.type === 'emprestimo') {
        sum -= t.amount;
      }
    }
    return sum;
  }, 0);
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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const getTransactionIcon = (type: string): string => {
  const icons: Record<string, string> = {
    contribuicao: 'north_east',
    recebimento: 'south_west',
    emprestimo: 'account_balance',
    parcela_emprestimo: 'payment',
  };
  return icons[type] || 'circle';
};

const getTransactionColor = (type: string): string => {
  const colors: Record<string, string> = {
    contribuicao: 'primary',
    recebimento: 'success',
    emprestimo: 'orange-9',
    parcela_emprestimo: 'blue-8',
  };
  return colors[type] || 'grey-7';
};

const getTransactionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    contribuicao: 'Contribuição',
    recebimento: 'Recebimento',
    emprestimo: 'Empréstimo',
    parcela_emprestimo: 'Parcela Empréstimo',
  };
  return labels[type] || 'Transação';
};

const getAmountSign = (type: string): string => {
  const signs: Record<string, string> = {
    contribuicao: '-',
    recebimento: '+',
    emprestimo: '-',
    parcela_emprestimo: '-',
  };
  return signs[type] || '';
};

const getAmountClass = (type: string): string => {
  const classes: Record<string, string> = {
    contribuicao: 'amount-contribuicao',
    recebimento: 'amount-recebimento',
    emprestimo: 'amount-emprestimo',
    parcela_emprestimo: 'amount-parcela',
  };
  return classes[type] || '';
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Confirmado: 'positive',
    Processado: 'info',
    Aprovado: 'positive',
    Pendente: 'warning',
    Rejeitado: 'negative',
  };
  return colors[status] || 'grey-4';
};

const getStatusTextColor = (status: string): string => {
  return status === 'Confirmado' ||
    status === 'Processado' ||
    status === 'Aprovado'
    ? 'white'
    : 'grey-9';
};
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.history-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.history-page {
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
    margin: 8px 0 0 0;
    font-weight: 500;
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

// ============== CONTENT ==============
.content-section {
  max-width: 1000px;
  margin: 0 auto;
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

// ============== LOADING ==============
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

// ============== LATEST CARD ==============
.latest-card {
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, $primary 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 20px 50px rgba($primary, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 8s ease-in-out infinite;
  }

  .q-card__section {
    position: relative;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 30px 60px rgba($primary, 0.3);
  }

  .latest-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;

    .latest-content {
      flex: 1;

      .latest-label {
        font-size: 13px;
        font-weight: 600;
        opacity: 0.85;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .latest-amount {
        font-size: 40px;
        font-weight: 700;
        margin-top: 8px;

        .latest-currency {
          font-size: 18px;
          font-weight: 500;
          margin-left: 8px;
          opacity: 0.9;
        }
      }

      .latest-group {
        font-size: 13px;
        opacity: 0.8;
        margin-top: 8px;
      }

      .latest-type {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .latest-icon {
      opacity: 0.15;
      animation: float 6s ease-in-out infinite;
    }
  }

  .latest-stats {
    display: flex;
    justify-content: space-around;
    gap: 16px;

    .stat-box {
      flex: 1;
      text-align: center;

      .stat-label {
        font-size: 11px;
        opacity: 0.75;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
        display: block;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        margin-top: 6px;
        display: block;

        &.text-positive {
          color: #86efac;
        }

        &.text-danger {
          color: #fca5a5;
        }
      }
    }

    :deep(.q-separator--vertical) {
      opacity: 0.2;
    }
  }

  .date-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    opacity: 0.85;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

// ============== FILTERS ==============
.filters-section {
  animation: slideInUp 0.6s ease-out;
}

.filters-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  .search-input,
  .filter-select {
    :deep(.q-field__control) {
      border-radius: 12px;
    }
  }
}

// ============== LIST ==============
.transactions-section {
  animation: fadeIn 0.5s ease-out;
}

.list-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;

  .transaction-item {
    animation: slideInCard 0.5s ease-out;

    .item-content {
      padding: 16px 20px;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(
          135deg,
          rgba($primary, 0.03),
          rgba($secondary, 0.03)
        );
        padding-left: 24px;
      }

      .item-title {
        font-size: 14px;
        font-weight: 700;
        color: $dark;
      }

      .item-description {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 4px;
      }

      .item-date {
        font-size: 11px;
        color: #d1d5db;
        margin-top: 4px;
      }

      .avatar-shadow {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .amount-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;

        .item-amount {
          font-size: 15px;
          font-weight: 700;

          &.amount-contribuicao {
            color: #3b82f6;
          }

          &.amount-recebimento {
            color: $success;
          }

          &.amount-emprestimo {
            color: #f97316;
          }

          &.amount-parcela {
            color: #0ea5e9;
          }
        }

        .status-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
        }
      }
    }

    .item-separator {
      opacity: 0.05;
    }
  }
}

@keyframes slideInCard {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ============== EMPTY STATE ==============
.empty-state {
  animation: fadeIn 0.5s ease-out;
}

.empty-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  .empty-icon {
    color: rgba($primary, 0.15);
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 700;
    color: $dark;
    margin: 12px 0;
  }

  .empty-message {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
}

// ============== STATISTICS ==============
.stats-section {
  animation: slideInUp 0.6s ease-out;
}

.section-header {
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }
}

.stat-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  animation: slideInCard 0.5s ease-out;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($primary, 0.2);
    box-shadow: 0 15px 40px rgba($primary, 0.1);
  }

  .q-card__section {
    .stat-header {
      display: flex;
      align-items: center;
      gap: 12px;

      .stat-label {
        font-size: 12px;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: $dark;
      margin-top: 12px;

      &.text-positive {
        color: $success;
      }

      &.text-danger {
        color: $danger;
      }
    }
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .header-section {
    .page-title {
      font-size: 24px;
    }
  }

  .latest-card {
    .latest-header {
      flex-direction: column;
      text-align: center;

      .latest-amount {
        font-size: 32px;
      }

      .latest-icon {
        opacity: 0.1;
      }
    }

    .latest-stats {
      flex-wrap: wrap;

      :deep(.q-separator--vertical) {
        display: none;
      }
    }
  }

  .stat-card {
    .q-card__section {
      .stat-value {
        font-size: 18px;
      }
    }
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 24px;
}

:deep(.q-item) {
  padding: 0;

  &:hover {
    background: transparent;
  }
}

:deep(.q-virtual-scroll__content) {
  gap: 0;
}
</style>
