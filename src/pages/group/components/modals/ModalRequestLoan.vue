<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @before-hide="$emit('before-hide')"
  >
    <q-card class="rounded-20" style="min-width: 400px">
      <!-- Header -->
      <q-card-section class="bg-orange-9 text-white q-pa-lg">
        <div class="text-h6">Solicitar Empréstimo</div>
        <div class="text-subtitle2 opacity-80">
          Preencha os dados do empréstimo
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="column q-gutter-md">
          <!-- Loan Amount -->
          <q-input
            :model-value="form.amount"
            @update:model-value="
              $emit('update:form', { ...form, amount: $event });
              $emit('calculate-interest');
            "
            outlined
            label="Valor do Empréstimo (MT)"
            type="number"
            dense
            class="rounded-10"
            :rules="[
              (val) => (val && val > 0) || 'Valor deve ser maior que zero',
            ]"
            rounded
          />

          <!-- Interest Display -->
          <q-card flat class="bg-orange-1 rounded-10">
            <q-card-section class="q-pa-md">
              <div class="row justify-between items-center">
                <span class="text-weight-bold text-orange-9">
                  Juros {{ interestRate }}%:
                </span>
                <span class="text-h6 text-weight-bolder text-orange-10">
                  {{ form.interest }} MT
                </span>
              </div>
              <q-separator class="q-my-sm" />
              <div class="row justify-between items-center">
                <span class="text-weight-bold">Total a Pagar:</span>
                <span class="text-h6 text-weight-bolder text-primary">
                  {{ form.total }} MT
                </span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Duration -->
          <q-input
            :model-value="form.duration"
            @update:model-value="
              $emit('update:form', { ...form, duration: $event })
            "
            outlined
            label="Duração (meses)"
            type="number"
            min="1"
            dense
            class="rounded-10"
            :rules="[
              (val) => (val && val > 0) || 'Duração deve ser maior que zero',
            ]"
            rounded
          />

          <!-- Reason -->
          <q-input
            :model-value="form.reason"
            @update:model-value="
              $emit('update:form', { ...form, reason: $event })
            "
            outlined
            label="Motivo do Empréstimo"
            type="textarea"
            dense
            class="rounded-10"
            rounded
          />

          <!-- Status/Periodicity -->
          <q-select
            :model-value="form.status"
            @update:model-value="
              $emit('update:form', { ...form, status: $event });
              $emit('change-status');
            "
            :disable="!isOwner"
            :options="statusValues"
            label="Aprovação do estado"
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

      <q-separator />

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Solicitar Empréstimo"
          color="orange-9"
          @click="$emit('submit')"
          no-caps
          class="rounded-10"
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
  interestRate: {
    type: Number,
    required: true,
  },
  statusValues: {
    type: Array,
    default: () => ['Aprovado', 'Rejeitado'],
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

defineEmits([
  'update:modelValue',
  'before-hide',
  'update:form',
  'calculate-interest',
  'change-status',
  'submit',
]);
</script>

<style scoped>
.rounded-10 {
  border-radius: 10px;
}

.rounded-20 {
  border-radius: 20px;
}
</style>
