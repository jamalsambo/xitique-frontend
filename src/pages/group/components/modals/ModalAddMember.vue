<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @before-hide="$emit('before-hide')"
  >
    <q-card
      class="rounded-20 q-pa-sm shadow-24 modal-responsive"
      style="min-width: 400px; max-width: 500px"
    >
      <!-- Header -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="text-h6">Adicionar Membro ao Grupo</div>
        <div class="text-subtitle2 opacity-80">
          Busque um membro ou crie um novo
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <!-- Search Input -->
        <div class="q-mb-lg">
          <q-input
            :model-value="searchQuery"
            @update:model-value="$emit('search-query-changed', $event)"
            outlined
            label="Buscar membro por nome ou telefone"
            dense
            class="rounded-10"
            prefix-icon="search"
            clearable
          />

          <!-- Search Results -->
          <div v-if="searchQuery.length > 0" class="q-mt-md">
            <!-- Loading -->
            <div v-if="loading" class="text-center q-py-md">
              <q-spinner size="40px" color="primary" />
            </div>

            <!-- Results Found -->
            <div
              v-else-if="results.length > 0"
              class="column q-gutter-xs max-height-300 scroll"
            >
              <q-item
                v-for="result in results"
                :key="result.id"
                clickable
                class="bg-grey-1 rounded-10 q-pa-md hover-highlight"
                @click="$emit('select-member', result)"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="40px"
                    color="primary-light"
                    text-color="primary"
                  >
                    <img v-if="result.avatar" :src="result.avatar" />
                    <q-icon v-else name="person" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ result.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ result.phone }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="add_circle"
                    @click="$emit('add-member', result.id)"
                    color="primary"
                    size="sm"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- No Results -->
            <div v-else class="text-center q-py-md text-grey-6">
              <q-icon name="search_off" size="32px" class="q-mb-sm" />
              <div class="text-caption">Nenhum membro encontrado</div>
            </div>
          </div>

          <!-- Initial Hint -->
          <div
            v-else
            class="text-center q-py-md text-grey-5 text-caption italic"
          >
            Digite o nome ou telefone para buscar
          </div>
        </div>

        <q-separator />
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
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
  searchQuery: {
    type: String,
    default: '',
  },
  results: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  'update:modelValue',
  'before-hide',
  'search-query-changed',
  'select-member',
  'add-member',
]);
</script>

<style scoped>
.rounded-10 {
  border-radius: 10px;
}

.rounded-20 {
  border-radius: 20px;
}

.modal-responsive {
  width: 95vw;
  max-width: 500px;
}

.max-height-300 {
  max-height: 300px;
  overflow-y: auto;
}

.scroll {
  overflow-y: auto;
}

.hover-highlight {
  transition: all 0.3s ease;
}

.hover-highlight:hover {
  background-color: #e3f2fd !important;
  transform: translateX(4px);
}

.bg-primary-light {
  background-color: #eef2ff;
}
</style>
