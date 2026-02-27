<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Header Section -->
  <div class="q-pa-md row items-center justify-between">
    <div class="text-subtitle1 text-weight-bold">Pedidos em Aberto</div>
    <div class="text-caption">
      Taxa de Juro:
      <q-badge color="orange-2" text-color="orange-9">
        {{ interestRate }}%
      </q-badge>
    </div>
  </div>

  <!-- Loans List -->
  <q-list separator>
    <q-expansion-item
      v-for="loan in loans"
      :key="loan.id"
      group="loans"
      header-class="q-py-md"
      expand-icon-class="text-grey-5"
    >
      <template v-slot:header>
        <q-item-section side class="q-ml-sm">
          <q-btn
            flat
            dense
            round
            icon="visibility"
            color="grey-7"
            @click.stop="$emit('toggle-loan', loan)"
          />
          <q-tooltip>Ver empréstimo</q-tooltip>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">
            {{ loan.member }}
          </q-item-label>

          <q-item-label caption>
            Solicitado em {{ loan?.created_at }}
          </q-item-label>

          <!-- Valores do empréstimo -->
          <q-item-label class="q-mt-xs text-primary text-weight-medium">
            💰 Solicitado: {{ formatMoney(loan.amount_requested) }}
          </q-item-label>

          <q-item-label class="text-negative text-weight-medium">
            💳 Total a pagar:
            {{ loan.totalToPay }}
          </q-item-label>

          <!-- Barra de progresso -->
          <div class="q-mt-sm" style="width: 80%">
            <q-linear-progress
              :value="
                loan.paid / (loan.amount_requested + (loan.interest || 0))
              "
              color="orange"
              rounded
            />
          </div>
        </q-item-section>

        <q-item-section side class="text-right">
          <div class="text-weight-bold text-grey-9">
            {{ loan.amount_requested }} MT
          </div>
          <q-badge
            :color="loan.status === 'Pendente' ? 'warning' : 'positive'"
            rounded
          >
            {{ loan.status }}
          </q-badge>
        </q-item-section>
      </template>

      <!-- Installments Details -->
      <q-card class="bg-grey-1" v-if="loan.member === user.phone">
        <q-card-section class="q-pa-sm">
          <div class="text-overline q-px-md text-grey-7">
            Plano de Pagamento
          </div>
          <q-list dense>
            <q-item
              v-for="(installment, index) in loan.installments"
              :key="index"
            >
              <q-item-section avatar>
                <q-icon
                  :name="
                    installment.status === 'Pago' ? 'check_circle' : 'pending'
                  "
                  :color="installment.status === 'Pago' ? 'positive' : 'grey-4'"
                  size="xs"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-caption text-weight-medium">
                  Parcela {{ index + 1 }} -
                  {{ formatDate(installment.dueDate) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-caption text-weight-bold text-grey-9">
                  {{ installment.amount }} MT
                </div>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  v-if="!installment.status"
                  color="primary"
                  label="Pagar"
                  unelevated
                  rounded
                  size="sm"
                  :disable="installment.status === 'Pendente'"
                  no-caps
                  @click="
                    $emit('pay-installment', {
                      loanId: installment.loadId,
                      amount: installment.amount,
                      number: index + 1,
                      status: installment.status,
                    })
                  "
                />
                <q-btn
                  v-else-if="
                    installment.status &&
                    installment.status.status === 'Pendente' &&
                    isOwner
                  "
                  color="info"
                  label="Pendente"
                  unelevated
                  rounded
                  size="sm"
                  :disable="installment.status === 'Pendente'"
                  no-caps
                  @click="
                    $emit('pay-installment', {
                      loanId: installment.loadId,
                      amount: installment.status,
                      number: index + 1,
                      status: installment.status,
                    })
                  "
                />

                <q-icon
                  v-else-if="installment.status?.status === 'Pendente'"
                  name="schedule"
                  color="warning"
                  size="sm"
                />

                <q-icon
                  v-else-if="installment.status?.status === 'Confirmado'"
                  name="verified"
                  color="positive"
                  size="sm"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Empty State -->
    <div v-if="loans.length === 0" class="text-center q-pa-xl text-grey-6">
      <q-icon name="history_edu" size="lg" class="q-mb-sm opacity-50" />
      <div>Nenhum empréstimo ativo neste grupo.</div>
    </div>
  </q-list>
</template>

<script setup>
defineProps({
  loans: {
    type: Array,
    required: true,
  },
  interestRate: {
    type: Number,
    required: false,
  },
  user: {
    type: Object,
    required: true,
    default: () => ({
      id: String,
      phone: String,
    }),
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  });
};

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
  }).format(value);
};

defineEmits(['toggle-loan', 'pay-installment']);
</script>

<style scoped>
/* Estilos específicos da aba de empréstimos */
</style>
