<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Add Member Button -->
  <q-card-section class="bg-blue-1 q-pa-md border-bottom">
    <q-btn
      color="primary"
      unelevated
      class="full-width rounded-15 no-caps"
      icon="person_add"
      label="Adicionar Membro"
      @click="$emit('add-member')"
    />
  </q-card-section>
  <!-- Members List -->
  <q-list separator>
    <q-item v-for="m in members" :key="m.id" class="q-py-md">
      <q-item-section avatar>
        <q-avatar :color="m.paid ? 'green-1' : 'orange-1'">
          <img
            v-if="m.avatar"
            :src="m.avatar || 'https://cdn.quasar.dev/img/avatar1.jpg'"
          />
          <q-icon
            v-else
            :name="m.paid ? 'check' : 'priority_high'"
            :color="m.paid ? 'positive' : 'warning'"
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold">
          {{ m.member }}
        </q-item-label>
        <q-item-label class="text-weight-light">
          {{ m.phone }}
        </q-item-label>
        <q-item-label
          caption
          v-if="m.paid"
          class="text-positive text-weight-medium"
        >
          Pago em {{ m.payment_date }}
        </q-item-label>
        <q-item-label caption v-else class="text-warning text-weight-medium">
          Aguardando pagamento
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          v-if="!m.payoutPaid"
          color="primary"
          label="Confirmar"
          unelevated
          rounded
          size="sm"
          no-caps
           @click="$emit('confirm-payout', m)"
        />
        <q-icon v-else name="verified" color="positive" size="sm" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
defineProps({
  members: {
    type: Array,
    required: true,
  }
});

defineEmits(['add-member', 'confirm-payout']);
</script>

<style scoped>
.rounded-15 {
  border-radius: 15px;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
