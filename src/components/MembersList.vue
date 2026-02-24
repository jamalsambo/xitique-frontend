<template>
  <q-list separator>
    <q-item v-for="member in members" :key="member.id" class="q-py-md">
      <!-- Avatar -->
      <q-item-section avatar>
        <q-avatar
          :color="getStatusColor(member.status)"
          text-color="white"
          size="48px"
        >
          <img v-if="member.avatar" :src="member.avatar" :alt="member.member" />
          <q-icon v-else name="person" size="24px" />
        </q-avatar>
      </q-item-section>

      <!-- Info do Membro -->
      <q-item-section>
        <q-item-label class="text-weight-bold text-subtitle2">
          {{ member.member }}
        </q-item-label>
        <q-item-label caption class="text-grey-7">
          {{ member.phone }}
        </q-item-label>
        <q-item-label
          v-if="member.paymentDate"
          caption
          :class="getStatusTextClass(member.status)"
          class="text-weight-medium q-mt-xs"
        >
          <q-icon name="check_circle" size="xs" class="q-mr-xs" />
          {{ getStatusLabel(member.status) }} em {{ member.paymentDate }}
        </q-item-label>
        <q-item-label
          v-else
          caption
          :class="getStatusTextClass(member.status)"
          class="text-weight-medium q-mt-xs"
        >
          <q-icon name="schedule" size="xs" class="q-mr-xs" />
          {{ getStatusLabel(member.status) }}
        </q-item-label>

        <!-- Notas -->
        <div v-if="member.notes && member.notes.length > 0" class="q-mt-md">
          <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">
            Observações:
          </div>
          <div
            v-for="(note, idx) in member.notes"
            :key="idx"
            class="bg-grey-1 rounded-8 q-pa-sm q-mb-xs text-caption"
          >
            <div class="text-weight-bold">{{ note.text }}</div>
            <div class="text-grey-6 text-xs">{{ note.date }}</div>
          </div>
        </div>
      </q-item-section>

      <!-- Valor e Status -->
      <q-item-section side>
        <div class="text-right">
          <div class="text-h6 text-weight-bold q-mb-sm">
            {{ member.amount || 0 }} MT
          </div>
          <q-badge
            :color="getStatusColor(member.status)"
            text-color="white"
            :label="getStatusLabel(member.status)"
            rounded
            class="text-weight-bold"
          />
        </div>
      </q-item-section>

      <!-- Ações (Admin) -->
      <q-item-section side v-if="hasAdminAccess" class="q-ml-md">
        <div class="row items-center q-gutter-xs">
          <!-- Confirmar Pagamento -->
          <q-btn
            v-if="member.status !== PAYMENT_STATUS.PAID && isOwner"
            flat
            round
            dense
            icon="check_circle"
            size="md"
            color="positive"
            @click="$emit('confirm-payment', member.id)"
          >
            <q-tooltip>Confirmar Pagamento</q-tooltip>
          </q-btn>

          <!-- Adicionar Nota -->
          <q-btn
            flat
            round
            dense
            icon="note_add"
            size="md"
            color="info"
            @click="selectedRowPaidLoan"
          >
            <q-tooltip>Adicionar Observação</q-tooltip>
          </q-btn>

          <!-- Menu Adicional -->
          <q-btn flat round dense icon="more_vert" size="md" color="grey-7">
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup>
                  <q-item-section icon="edit" />
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section icon="phone" />
                  <q-item-section>Contactar</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup class="text-negative">
                  <q-item-section icon="person_remove" />
                  <q-item-section>Remover</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>

    <!-- Mensagem Vazia -->
    <div v-if="!members || members.length === 0" class="text-center q-pa-lg">
      <q-icon
        name="person_outline"
        size="64px"
        color="grey-4"
        class="q-mb-md"
      />
      <div class="text-h6 text-grey-7">Nenhum membro encontrado</div>
      <div class="text-caption text-grey-6">
        Adicione membros para começar a gerenciar o ciclo
      </div>
    </div>
  </q-list>
  <modal-payment-proof
    v-model="showPaidLoadModal"
    :form="paidLoadForm"
    :show-status="false"
    @update:form="paidLoadForm = $event"
    @save="onSave"
  />
</template>

<script setup lang="js">
import ModalPaymentProof from 'src/pages/group/components/modals/ModalPaymentProof.vue';
import { defineProps, defineEmits, ref } from 'vue'

defineProps({
  members: {
    type: Array,
    default: () => []
  },
  cycle: {
    type: Object,
    default: () => ({})
  },
  hasAdminAccess: {
    type: Boolean,
    default: false
  },
  isOwner: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const showPaidLoadModal = ref(false);
const paidLoadForm = ref({
  proof_url: '',
  status: '',
});

const selectedRowPaidLoan = () => {
  showPaidLoadModal.value = true

}

const onSave = () => {
  try {
    console.log('kdjkjds')
  } catch (error) {

  }
}


const PAYMENT_STATUS = {
  PAID: 'Pago',
  PENDING: 'Pendente',
  OVERDUE: 'Atrasado',
};

defineEmits(['confirm-payment', 'add-note'])

// Cores por Status
const getStatusColor = (status) => {
  const colors = {
    Pago: 'positive',
    Pendente: 'warning',
    Atrasado: 'negative'
  }
  return colors[status] || 'grey'
}

// Labels por Status
const getStatusLabel = (status) => {
  const labels = {
    paid: PAYMENT_STATUS.PAID,
    pending: PAYMENT_STATUS.PENDING,
    overdue: PAYMENT_STATUS.OVERDUE
  }
  return labels[status] || status
}

// Classe de texto por Status
const getStatusTextClass = (status) => {
  const classes = {
    paid: 'text-positive',
    pending: 'text-warning',
    overdue: 'text-negative'
  }
  return classes[status] || 'text-grey-7'
}
</script>

<style scoped>
.rounded-8 {
  border-radius: 8px;
}

.text-xs {
  font-size: 11px;
}

.q-item__section--side {
  min-width: auto;
}
</style>
