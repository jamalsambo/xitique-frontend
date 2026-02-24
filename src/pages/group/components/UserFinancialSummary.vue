<template>
  <div class="financial-summary">
    <!-- Main Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Balance Card (Featured) -->
      <div class="col-12">
        <q-card class="balance-card featured-card">
          <q-card-section class="q-pa-lg">
            <div class="balance-content">
              <div class="balance-header">
                <div>
                  <div class="balance-label">Saldo Total Disponível</div>
                  <div class="balance-amount">
                    {{ formatCurrency(stats.totalBalance) }}
                    <span class="balance-currency">MT</span>
                  </div>
                </div>
                <div class="balance-icon">
                  <q-icon name="account_balance_wallet" size="48px" />
                </div>
              </div>

              <!-- Sub Stats -->
              <div class="sub-stats q-mt-lg">
                <div class="sub-stat">
                  <div class="sub-stat-label">Contribuído</div>
                  <div class="sub-stat-value">
                    {{ formatCurrency(stats.totalContributed) }}
                  </div>
                </div>
                <q-separator vertical class="sub-stat-separator" />
                <div class="sub-stat">
                  <div class="sub-stat-label">Recebido</div>
                  <div class="sub-stat-value">
                    {{ formatCurrency(stats.totalReceived) }}
                  </div>
                </div>
                <q-separator vertical class="sub-stat-separator" />
                <div class="sub-stat">
                  <div class="sub-stat-label">Grupos</div>
                  <div class="sub-stat-value">
                    {{ stats.activeGroupsCount }}
                  </div>
                </div>
              </div>

              <!-- Status Message -->
              <div class="status-message q-mt-lg">
                <q-icon name="check_circle" color="positive" size="sm" />
                <span>✓ Disponível para saque</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Secondary Cards Grid -->
      <div class="col-12">
        <div class="row q-col-gutter-lg">
          <!-- Contributed Card -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card contributed-card">
              <q-card-section class="card-content">
                <div class="card-header">
                  <q-avatar
                    rounded
                    color="blue-1"
                    text-color="primary"
                    icon="trending_up"
                    size="md"
                  />
                  <div class="card-title">Total Contribuído</div>
                </div>

                <div class="card-value">
                  {{ formatCurrency(stats.totalContributed) }}
                </div>

                <div class="card-subtitle">
                  Acumulado em {{ stats.activeGroupsCount }} grupo(s)
                </div>

                <!-- Progress Bar -->
                <div class="progress-section q-mt-md">
                  <div class="progress-label">Participação</div>
                  <q-linear-progress
                    :value="getContributionRatio()"
                    color="primary"
                    rounded
                    class="progress-bar"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Received Card -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card received-card">
              <q-card-section class="card-content">
                <div class="card-header">
                  <q-avatar
                    rounded
                    color="green-1"
                    text-color="positive"
                    icon="south_west"
                    size="md"
                  />
                  <div class="card-title">Total Recebido</div>
                </div>

                <div class="card-value">
                  {{ formatCurrency(stats.totalReceived) }}
                </div>

                <div class="card-subtitle">
                  De ciclos completados
                </div>

                <!-- Badge -->
                <q-badge
                  color="positive"
                  text-color="white"
                  outline
                  rounded
                  class="badge-success q-mt-md"
                >
                  ✓ Ciclos completados
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <!-- Debt Card -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card
              class="stat-card debt-card"
              :class="stats.remainingDebt > 0 ? 'debt-active' : 'debt-clear'"
            >
              <q-card-section class="card-content">
                <div class="card-header">
                  <q-avatar
                    rounded
                    :color="stats.remainingDebt > 0 ? 'red-1' : 'green-1'"
                    :text-color="stats.remainingDebt > 0 ? 'danger' : 'positive'"
                    :icon="stats.remainingDebt > 0 ? 'warning' : 'check_circle'"
                    size="md"
                  />
                  <div class="card-title">
                    {{ stats.remainingDebt > 0 ? 'Dívida Restante' : 'Sem Dívidas' }}
                  </div>
                </div>

                <div
                  class="card-value"
                  :class="stats.remainingDebt > 0 ? 'text-danger' : 'text-positive'"
                >
                  {{ formatCurrency(Math.abs(stats.remainingDebt)) }}
                </div>

                <div class="card-subtitle">
                  {{ stats.remainingDebt > 0
                    ? '⚠️ Pagamentos pendentes'
                    : '✓ Tudo quitado' }}
                </div>

                <!-- Status Indicator -->
                <div
                  v-if="stats.remainingDebt > 0"
                  class="alert-box q-mt-md"
                >
                  <q-icon name="info" size="xs" />
                  <span>Regularize seus pagamentos</span>
                </div>
                <div v-else class="success-box q-mt-md">
                  <q-icon name="check" size="xs" />
                  <span>Todas as obrigações quitadas</span>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Active Groups Card -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card groups-card">
              <q-card-section class="card-content">
                <div class="card-header">
                  <q-avatar
                    rounded
                    color="orange-1"
                    text-color="orange-9"
                    icon="hub"
                    size="md"
                  />
                  <div class="card-title">Grupos Ativos</div>
                </div>

                <div class="card-value groups-value">
                  {{ stats.activeGroupsCount }}
                </div>

                <div class="card-subtitle">
                  Participação ativa
                </div>

                <!-- Group Stats -->
                <div class="group-stats q-mt-md">
                  <div class="stat-item">
                    <span class="stat-label">Pagamentos</span>
                    <span class="stat-count">{{ stats.pendingPaymentsCount }}</span>
                  </div>
                  <q-separator />
                  <div class="stat-item">
                    <span class="stat-label">Empréstimos</span>
                    <span class="stat-count">{{ stats.pendingLoansCount }}</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalBalance: 0,
      totalContributed: 0,
      totalReceived: 0,
      remainingDebt: 0,
      activeGroupsCount: 0,
      pendingPaymentsCount: 0,
      pendingLoansCount: 0,
    }),
  },
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

const getContributionRatio = (): number => {
  if (!props.stats.totalContributed || !props.stats.totalBalance) return 0;
  const ratio = props.stats.totalContributed / (props.stats.totalContributed + props.stats.totalReceived);
  return Math.min(ratio, 1);
};
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$warning: #f59e0b;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== CONTAINER ==============
.financial-summary {
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

// ============== FEATURED BALANCE CARD ==============
.featured-card {
  background: linear-gradient(135deg, $primary 0%, #7c3aed 100%);
  border: none;
  color: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba($primary, 0.2);
  transition: all 0.3s ease;
  animation: slideInDown 0.6s ease-out;
  overflow: hidden;

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

  .balance-content {
    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .balance-label {
        font-size: 13px;
        font-weight: 600;
        opacity: 0.85;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .balance-amount {
        font-size: 48px;
        font-weight: 700;
        margin-top: 8px;
        letter-spacing: -1px;

        .balance-currency {
          font-size: 20px;
          font-weight: 500;
          margin-left: 8px;
          opacity: 0.9;
        }
      }

      .balance-icon {
        opacity: 0.15;
        animation: float 6s ease-in-out infinite;
      }
    }

    .sub-stats {
      display: flex;
      justify-content: space-around;
      gap: 16px;

      .sub-stat {
        flex: 1;
        text-align: center;

        .sub-stat-label {
          font-size: 11px;
          opacity: 0.75;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .sub-stat-value {
          font-size: 18px;
          font-weight: 700;
          margin-top: 6px;
        }
      }

      .sub-stat-separator {
        opacity: 0.2;
      }
    }

    .status-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

// ============== STAT CARDS ==============
.stat-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: slideInCard 0.5s ease-out forwards;
  opacity: 0;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba($primary, 0.2);
    box-shadow: 0 15px 40px rgba($primary, 0.1);
  }

  .card-content {
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .card-title {
        font-size: 12px;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .card-value {
      font-size: 24px;
      font-weight: 700;
      color: $dark;
      margin: 12px 0;
      transition: color 0.3s ease;

      &.text-positive {
        color: $success;
      }

      &.text-danger {
        color: $danger;
      }
    }

    .card-subtitle {
      font-size: 12px;
      color: #9ca3af;
      font-weight: 500;
    }
  }
}

@keyframes slideInCard {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== CARD VARIANTS ==============
.contributed-card {
  .card-value {
    color: $primary;
  }

  .progress-section {
    .progress-label {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      display: block;
    }

    .progress-bar {
      border-radius: 8px;
      height: 6px;

      :deep(.q-linear-progress__track) {
        background: rgba($primary, 0.1);
      }
    }
  }
}

.received-card {
  .card-value {
    color: $success;
  }

  .badge-success {
    font-size: 11px;
    font-weight: 600;
    padding: 6px 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.debt-card {
  &.debt-active {
    border-color: rgba($danger, 0.2);
    background: linear-gradient(
      135deg,
      rgba($danger, 0.03),
      rgba($danger, 0.01)
    );

    .card-value {
      color: $danger;
    }
  }

  &.debt-clear {
    border-color: rgba($success, 0.2);
    background: linear-gradient(
      135deg,
      rgba($success, 0.03),
      rgba($success, 0.01)
    );

    .card-value {
      color: $success;
    }
  }

  .alert-box,
  .success-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }

  .alert-box {
    background: linear-gradient(
      135deg,
      rgba($danger, 0.1),
      rgba($danger, 0.05)
    );
    color: #991b1b;
    border: 1px solid rgba($danger, 0.2);
  }

  .success-box {
    background: linear-gradient(
      135deg,
      rgba($success, 0.1),
      rgba($success, 0.05)
    );
    color: #065f46;
    border: 1px solid rgba($success, 0.2);
  }
}

.groups-card {
  .groups-value {
    font-size: 32px;
    color: $primary;
  }

  .group-stats {
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 12px;

      .stat-label {
        color: #9ca3af;
        font-weight: 600;
      }

      .stat-count {
        color: $primary;
        font-weight: 700;
        font-size: 14px;
      }
    }

    :deep(.q-separator) {
      opacity: 0.1;
    }
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 1024px) {
  .featured-card {
    .balance-content {
      .balance-header {
        .balance-amount {
          font-size: 40px;
        }
      }

      .sub-stats {
        flex-wrap: wrap;
      }
    }
  }
}

@media (max-width: 768px) {
  .featured-card {
    .balance-content {
      .balance-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;

        .balance-amount {
          font-size: 32px;
        }

        .balance-icon {
          opacity: 0.1;
        }
      }

      .sub-stats {
        flex-direction: column;
        gap: 12px;

        .sub-stat-separator {
          display: none;
        }
      }
    }
  }

  .stat-card {
    .card-content {
      padding: 16px;
    }
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 24px;
}

:deep(.q-separator) {
  opacity: 0.1;
}

:deep(.q-avatar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
