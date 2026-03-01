<template>
  <q-list separator>
    <!-- Header -->
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

    <!-- Cycles List -->
    <q-item
      v-for="cycle in visibleCycles"
      :key="cycle.cycleNumber"
      class="cycle-item q-py-md"
    >
      <!-- Avatar with Cycle Number -->
      <q-item-section avatar>
        <q-avatar
          :color="isCurrentCycle(cycle.cycleStartDate) ? 'primary' : 'grey-2'"
          :text-color="
            isCurrentCycle(cycle.cycleStartDate) ? 'white' : 'grey-7'
          "
          size="48px"
          class="text-weight-bold cycle-avatar"
        >
          {{ cycle.cycleNumber }}
        </q-avatar>
      </q-item-section>

      <!-- Cycle Info -->
      <q-item-section>
        <q-item-label
          class="text-weight-bold cycle-dates"
          :class="{
            'text-primary': isCurrentCycle(cycle.cycleStartDate),
          }"
        >
          <q-icon name="event" size="xs" class="q-mr-xs" />
          {{ formatDate(cycle.cycleStartDate) }} -
          {{ formatDate(cycle.cycleEndDate) }}
          <q-badge
            v-if="isCurrentCycle(cycle.cycleStartDate)"
            label="Atual"
            color="primary"
            class="q-ml-sm"
          />
        </q-item-label>
        <q-item-label caption class="cycle-due-date">
          <q-icon name="schedule" size="xs" class="q-mr-xs" />
          Pagamento até:
          <span class="text-weight-bold text-grey-9">
            {{ formatDate(cycle.dueEndDate) }}
          </span>
        </q-item-label>
      </q-item-section>

      <!-- Actions Section -->
      <q-item-section side>
        <div class="actions-container">
          <!-- Pay Button -->
          <q-btn
            v-if="canPayCycle(cycle)"
            unelevated
            rounded
            color="positive"
            label="Paguei"
            icon="check_circle"
            size="sm"
            no-caps
            class="pay-btn"
            @click="$emit('pay-cycle', cycle)"
          >
            <q-tooltip>Contribuir a este ciclo</q-tooltip>
          </q-btn>

          <!-- Confirm Button (Admin) -->
          <q-btn
            v-else-if="isOwner && isCyclePendent(cycle)"
            unelevated
            rounded
            color="info"
            label="Confirmar"
            icon="verified"
            size="sm"
            no-caps
            class="confirm-btn"
            @click="$emit('pay-confirmation', cycle)"
          >
            <q-tooltip>Confirmar pagamento</q-tooltip>
          </q-btn>

          <q-badge
            v-else-if="isCyclePendent(cycle)"
            label="Pendente"
            color="warning"
            rounded
            class="status-badge pending-badge"
          />

           <!-- Status Badges -->
          <q-badge
            v-else-if="isCyclePaid(cycle)"
            label="Pago"
            color="positive"
            rounded
            class="paid-badge"
          />

          <!-- Details Button -->
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            size="sm"
            class="details-btn"
            @click="$emit('view-cycle', cycle)"
          >
            <q-tooltip>Ver detalhes do ciclo</q-tooltip>
          </q-btn>
        </div>
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

// ============== METHODS ==============
const isCycleExpired = (cycle) => {
  if (!cycle.dueEndDate) return false;
  const today = new Date();
  const dueDate = new Date(cycle.dueEndDate);
  return today > dueDate;
};

const isCyclePaid = (cycle) => {
  console.log(cycle)
  if (!cycle) return false;
  return (cycle.paid==='Pago');
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
  // 4. Não está pendente
  return (
    !isCyclePaid(cycle) &&
    !isCycleExpired(cycle) &&
    !isCyclePendent(cycle) &&
    cycle.paid === null
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

// ============== COMPUTED ==============
const visibleCycles = computed(() => {
  const all = props.cycles || [];
  if (showAllCycles.value) return all;

  const now = new Date();
  return all.filter((c) => new Date(c.cycleStartDate) <= now);
});
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$positive: #10b981;
$warning: #f59e0b;
$info: #0891b2;
$grey-6: #9ca3af;
$grey-7: #6b7280;
$grey-9: #111827;

// ============== CYCLE ITEM ==============
.cycle-item {
  border-radius: 12px;
  margin: 8px 0;
  transition: all 0.3s ease;
  background: linear-gradient(
    135deg,
    rgba(91, 114, 255, 0.02) 0%,
    rgba(0, 217, 255, 0.02) 100%
  );

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(91, 114, 255, 0.05) 0%,
      rgba(0, 217, 255, 0.05) 100%
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateX(4px);
  }
}

// ============== AVATAR ==============
.cycle-avatar {
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(91, 114, 255, 0.15);
  transition: all 0.3s ease;

  .cycle-item:hover & {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(91, 114, 255, 0.25);
  }
}

// ============== CYCLE INFO ==============
.cycle-dates {
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: color 0.3s ease;

  :deep(.q-icon) {
    font-size: 14px;
  }
}

.cycle-due-date {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;

  :deep(.q-icon) {
    font-size: 12px;
  }
}

// ============== ACTIONS CONTAINER ==============
.actions-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

// ============== BUTTONS ==============
.pay-btn,
.confirm-btn {
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  :deep(.q-icon) {
    margin-right: 4px;
  }
}

.pay-btn {
  background: linear-gradient(135deg, $positive, #059669);
  color: white;

  &:hover {
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
}

.confirm-btn {
  background: linear-gradient(135deg, $info, #0369a1);
  color: white;

  &:hover {
    box-shadow: 0 4px 16px rgba(8, 145, 178, 0.3);
  }
}

// ============== STATUS BADGES ==============
.status-badge {
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  transition: all 0.3s ease;

  &.paid-badge {
    background-color: rgba($positive, 0.15);
    color: $positive;

    :deep(.q-badge__content) {
      font-weight: 700;
    }
  }

  &.pending-badge {
    background-color: rgba($warning, 0.15);
    color: $warning;

    :deep(.q-badge__content) {
      font-weight: 700;
    }
  }
}

// ============== DETAILS BUTTON ==============
.details-btn {
  color: $grey-6;
  transition: all 0.3s ease;

  &:hover {
    color: $primary;
    background: rgba($primary, 0.1);
    transform: translateX(2px);
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .actions-container {
    flex-direction: column;
    gap: 6px;
    width: 100%;
    margin-top: 8px;

    .pay-btn,
    .confirm-btn,
    .details-btn {
      width: 100%;
    }
  }

  .cycle-dates {
    font-size: 13px;
  }

  .cycle-due-date {
    font-size: 11px;
  }
}

// ============== TRANSITIONS ==============
@media (prefers-reduced-motion: reduce) {
  .cycle-item,
  .cycle-avatar,
  .pay-btn,
  .confirm-btn,
  .details-btn {
    transition: none;
    transform: none;
  }
}
</style>