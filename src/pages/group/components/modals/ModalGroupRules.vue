<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="rounded-20"
  >
    <q-card class="rounded-20" style="min-width: 400px; max-width: 600px">
      <!-- Header -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="text-h6">Regras do Grupo</div>
        <div class="text-subtitle2 opacity-80">
          {{ groupName }}
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-lg">
        <!-- Rules Content -->
        <div v-if="rules" class="text-body2 text-grey-8 line-height-lg">
          <div v-html="rules" class="rules-content"></div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center q-py-lg text-grey-6">
          <q-icon name="info" size="48px" class="q-mb-md opacity-50" />
          <div class="text-caption">
            Nenhuma regra definida para este grupo ainda.
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Actions -->
      <q-card-actions align="center" class="q-pa-md">
        <q-btn flat label="Fechar" color="primary" v-close-popup no-caps />
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
  rules: {
    type: String,
    default: null,
  },
  groupName: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.rounded-20 {
  border-radius: 20px;
}

.rules-content {
  line-height: 1.8;
}

.rules-content p {
  margin-bottom: 12px;
}

.rules-content ul,
.rules-content ol {
  margin: 12px 0;
  padding-left: 24px;
}

.rules-content li {
  margin-bottom: 8px;
}

.line-height-lg {
  line-height: 1.8;
}
</style>
