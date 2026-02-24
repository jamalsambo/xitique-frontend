<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="rounded-20 q-pa-sm shadow-24 modal-responsive">
      <!-- Header -->
      <q-card-section>
        <div class="text-h6 text-weight-bold">Criar novo Xitique 💰</div>
        <div class="text-caption text-grey-7">
          Configure as regras e valores do grupo.
        </div>
      </q-card-section>

      <q-separator />

      <!-- Form Section -->
      <q-card-section class="q-pa-lg">
        <div class="column q-gutter-md">
          <!-- Payment Proof URL -->
          <q-input
            :model-value="form.proof_url"
            @update:model-value="$emit('update:form', { ...form, proof_url: $event })"
            label="Comprovativo de pagamento"
            type="textarea"
            outlined
            rounded
            dense
            rows="3"
          />

          <!-- Status Selection -->
          <q-select
            v-if="showStatus"
            :model-value="form.status"
            @update:model-value="$emit('update:form', { ...form, status: $event })"
            :options="statusOptions"
            label="Estado"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            rounded
            dense
            class="col-12 col-sm-6"
          />
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Pagar Parcela"
          color="primary"
          rounded
          class="q-px-lg shadow-2"
          @click="$emit('save')"
          :disable="!form.proof_url"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  statusOptions: {
    type: Array,
    default: () => [
      { label: 'Confirmado', value: 'Confirmado' },
      { label: 'Rejeitado', value: 'Rejeitado' },
    ],
  },
});

defineEmits(['update:modelValue', 'update:form', 'save']);
</script>

<style scoped>
.rounded-20 {
  border-radius: 20px;
}

.modal-responsive {
  width: 95vw;
  max-width: 500px;
}
</style>
