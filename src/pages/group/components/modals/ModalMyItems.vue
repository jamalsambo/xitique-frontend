<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @before-hide="handleBeforeHide"
  >
    <q-card
      class="rounded-20 q-pa-sm shadow-24 modal-responsive"
      style="min-width: 400px; max-width: 600px"
    >
      <!-- Header -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h6">Meus Itens Desejados</div>
            <div class="text-subtitle2 opacity-80">
              {{ items.length }} item(ns) adicionado(s)
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="add_circle"
            size="lg"
            color="white"
            @click="showForm = !showForm"
          >
            <q-tooltip>Novo Item</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-lg">
        <!-- Formulário -->
        <q-expansion-item
          v-model="showForm"
          class="q-mb-md"
          header-class="bg-blue-1 rounded-10"
          expand-icon-class="text-primary"
        >
          <template #header>
            <q-item-section avatar>
              <q-icon name="add_box" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">
                Adicionar Novo Item
              </q-item-label>
            </q-item-section>
          </template>

          <div class="column q-gutter-md q-pa-md bg-grey-1 rounded-10">
            <!-- Nome -->
            <q-input
              :model-value="newItem.product_name"
              @update:model-value="
                emit('update:newItem', {
                  ...newItem,
                  product_name: $event,
                })
              "
              outlined
              dense
              label="Nome do Item"
              :rules="[(v) => !!v || 'Campo obrigatório']"
            />

            <!-- Categoria -->
            <q-select
              :model-value="newItem.category"
              @update:model-value="
                emit('update:newItem', {
                  ...newItem,
                  category: $event,
                })
              "
              :options="categories"
              emit-value
              map-options
              outlined
              dense
              label="Categoria"
            />

            <!-- Quantidade -->
            <q-input
              :model-value="newItem.target_quantity"
              @update:model-value="
                emit('update:newItem', {
                  ...newItem,
                  target_quantity: $event,
                })
              "
              type="number"
              outlined
              dense
              label="Quantidade"
            />

            <!-- Preço -->
            <q-input
              :model-value="newItem.price"
              @update:model-value="handleChangePrice"
              type="number"
              outlined
              dense
              label="Preço"
            />

            <div class="row q-gutter-sm">
              <q-btn
                class="col"
                color="primary"
                icon="add"
                label="Adicionar"
                unelevated
                :disable="
                  !newItem.product_name || !newItem.category || !balanceValue
                "
                @click="handleAddItem"
              />

              <q-btn
                class="col"
                flat
                label="Cancelar"
                color="grey"
                @click="showForm = false"
              />
            </div>
          </div>
        </q-expansion-item>

        <!-- Lista -->
        <div v-if="items.length">
          <q-list separator>
            <q-item
              v-for="(item, index) in items"
              :key="index"
              class="hover-item rounded-10"
            >
              <q-item-section avatar>
                <q-avatar
                  :icon="getCategoryIcon(item.category)"
                  :color="getCategoryColor(item.category)"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ item.product_name }}
                </q-item-label>
                <q-item-label caption>
                  {{ item.category }}
                </q-item-label>
                <q-item-label caption v-if="item.price">
                  💵 {{ formatCurrency(item.price) }} MT
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  round
                  dense
                  flat
                  icon="delete"
                  color="negative"
                  @click="emit('remove-item', index, item.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Resumo -->
          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-weight-bold">
            Valor Total: {{ formatCurrency(totalPrice) }} MT
          </div>

          <q-linear-progress
            class="q-mt-sm"
            rounded
            :value="pricePercentageDecimal"
            color="positive"
          />
        </div>

        <!-- Vazio -->
        <div v-else class="text-center q-pa-lg text-grey-6">
          <q-icon name="shopping_cart" size="48px" />
          <div>Nenhum item adicionado</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Fechar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import useNotify from 'src/composables/UseNotify';

const { notifyInfo } = useNotify();

/* ================= PROPS ================= */
const props = defineProps({
  modelValue: Boolean,
  items: {
    type: Array,
    required: true,
  },
  newItem: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

/* ================= EMITS ================= */
const emit = defineEmits([
  'update:modelValue',
  'update:newItem',
  'add-item',
  'remove-item',
  'beforeHide',
]);

/* ================= STATE ================= */
const showForm = ref(false);
const balanceValue = ref(true);

/* ================= COMPUTEDS ================= */
const itemsWithPrice = computed(
  () => props.items.filter((i) => i.price > 0).length
);

const totalPrice = computed(() =>
  props.items.reduce((s, i) => s + Number(i.price || 0), 0)
);

const pricePercentageDecimal = computed(() =>
  props.items.length ? itemsWithPrice.value / props.items.length : 0
);

/* ================= HELPERS ================= */
const formatCurrency = (v) =>
  Number(v || 0).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
  });

const getCategoryIcon = (c) =>
  ({
    alimentos: 'restaurant',
    bebidas: 'local_bar',
    higiene: 'soap',
    vestuario: 'checkroom',
    electronica: 'devices',
    casa: 'home',
    saude: 'favorite',
    educacao: 'school',
  }[c] || 'category');

const getCategoryColor = (c) =>
  ({
    alimentos: 'orange',
    bebidas: 'blue',
    higiene: 'green',
    vestuario: 'purple',
    electronica: 'grey-8',
    casa: 'brown',
    saude: 'red',
    educacao: 'indigo',
  }[c] || 'grey');

/* ================= ACTIONS ================= */
const handleAddItem = () => {
  emit('add-item');
  showForm.value = false;
};

const handleBeforeHide = () => {
  showForm.value = false;
  emit('beforeHide');
};

const handleChangePrice = (value) => {
  if (props.balance < value) {
    notifyInfo('O valor dos produtos e maior de o seu valor');
    balanceValue.value = false;
  } else {
    balanceValue.value = true;
  }
  emit('update:newItem', {
    ...props.newItem,
    price: value,
  });
};
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
}

.hover-item:hover {
  background: #f5f5f5;
}
</style>
