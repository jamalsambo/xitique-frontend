<template>
  <q-card class="rounded-20 q-pa-sm shadow-24 modal-responsive">
    <!-- Header -->
    <q-card-section>
      <div class="text-h6 text-weight-bold">Criar novo Xitique 💰</div>
      <div class="text-caption text-grey-7">
        Configure as regras e valores do grupo.
      </div>
    </q-card-section>

    <q-separator />

    <!-- Form Content -->
    <q-card-section class="q-gutter-y-md">
      <!-- Identificação -->
      <div class="form-section">
        <div class="text-overline text-grey-7">Identificação</div>
        <div class="row q-col-gutter-sm">
          <q-input
            v-model="form.name"
            label="Nome do grupo"
            outlined
            rounded
            dense
            class="col-12 col-sm-7"
          />
          <q-select
            v-model="form.type_id"
            :options="groupTypes"
            label="Tipo"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            outlined
            rounded
            dense
            class="col-12 col-sm-5"
          />
        </div>

        <q-input
          v-model="form.description"
          label="Descrição do grupo"
          type="textarea"
          outlined
          rounded
          dense
          rows="2"
        />
      </div>

      <!-- Valores -->
      <div class="form-section">
        <div class="text-overline text-grey-7">Valores e Períodos</div>
        <div class="row q-col-gutter-sm">
          <q-input
            v-model.number="form.monthly_value"
            label="Valor Mensal"
            type="number"
            suffix="MT"
            outlined
            rounded
            dense
            class="col-12 col-sm-6"
          />
          <q-input
            v-model.number="form.cicle_number"
            label="Nº de Ciclos"
            type="number"
            outlined
            rounded
            dense
            class="col-12 col-sm-6"
          />
        </div>

        <div class="row q-col-gutter-sm">
          <q-select
            v-model="form.cicle"
            :options="cicleValues"
            label="Periodicidade"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            rounded
            dense
            class="col-12 col-sm-6"
          />
          <q-input
            v-model.number="form.due"
            label="Dia Limite (Vencimento)"
            type="number"
            min="1"
            max="31"
            outlined
            rounded
            dense
            class="col-12 col-sm-6"
          />
        </div>
      </div>

      <!-- Data de Início -->
      <div class="form-section">
        <div class="text-overline text-grey-7">Data de Início</div>
        <div class="row items-center q-col-gutter-sm">
          <q-input
            v-model="form.start_date"
            label="Data de Início"
            type="date"
            outlined
            rounded
            dense
            class="col-12 col-sm-8"
          />
          <div class="col-12 col-sm-4">
            <q-btn
              flat
              dense
              label="Usar Hoje"
              color="primary"
              size="sm"
              @click="setTodayDate"
              class="full-width"
            />
          </div>
        </div>
        <div class="text-caption text-grey-7">
          {{
            form.start_date
              ? `Data selecionada: ${formatDate(form.start_date)}`
              : 'Nenhuma data selecionada - usará a data atual'
          }}
        </div>
      </div>

      <!-- Configurações -->
      <div class="form-section q-mt-md">
        <div class="text-overline text-grey-7 q-mb-xs">
          Configurações Avançadas
        </div>

        <div class="bg-grey-2 q-pa-md rounded-15">
          <div class="row items-center justify-between q-mb-md">
            <div class="col">
              <div class="text-weight-bold">Liberação Automática</div>
              <div class="text-caption text-grey-7">
                Pagar bolada logo após fechar o fundo do mês?
              </div>
            </div>
            <q-toggle v-model="form.payout_trigger" color="primary" />
          </div>

          <q-separator class="q-my-sm" style="opacity: 0.3" />

          <div class="row items-center justify-between">
            <div class="col">
              <div class="text-weight-bold">Acesso ao Público</div>
              <div class="text-caption text-grey-7">
                Permitir que pessoas fora do círculo vejam o grupo?
              </div>
            </div>
            <q-toggle v-model="form.is_public" color="primary" />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Actions -->
    <q-card-actions align="right" class="q-pa-md">
      <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
      <q-btn
        unelevated
        label="Criar Grupo"
        color="primary"
        rounded
        class="q-px-lg shadow-2"
        @click="onSave"
        :disable="!isFormValid"
        no-caps
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGroupStore } from 'src/pages/group/store';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const $q = useQuasar();

const router = useRouter();
const groupStore = useGroupStore();

const props = defineProps({
  groupTypes: {
    type: Array,
    required: true,
  },
});

const groupTypes = computed(() => props.groupTypes);

interface FormData {
  name: string;
  type_id: string;
  description: string;
  monthly_value: number;
  cicle_number: number;
  cicle: number;
  due: number;
  payout_trigger: boolean;
  is_public: boolean;
  start_date: string;
}

const form = ref<FormData>({
  name: '',
  type_id: '',
  description: '',
  monthly_value: 0,
  cicle_number: 0,
  cicle: 0,
  due: 1,
  payout_trigger: false,
  is_public: true,
  start_date: '',
});

const cicleValues = [
  { label: 'Mensal', value: 30 },
  { label: 'Quinzenal', value: 15 },
  { label: 'Semanal', value: 7 },
];

const isFormValid = computed(
  () => form.value.name && form.value.monthly_value > 0
);

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const setTodayDate = (): void => {
  form.value.start_date = getTodayDate();
};

const formatDate = (date: string): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const onSave = async (): Promise<void> => {
  try {
    const dataToSubmit = {
      ...form.value,
      start_date: form.value.start_date || getTodayDate(),
    };

    const group = await groupStore.create(dataToSubmit);

    $q.notify({
      message: 'Grupo criado com sucesso.',
      color: 'dark',
    });

    router.push(`/groups/${group.id}`)
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
  }
};

</script>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Esta classe garante que o modal não transborde */
.modal-responsive {
  width: 95vw; /* Ocupa 95% da largura da tela em mobile */
  max-width: 500px; /* Mas não passa de 500px em desktop */
}

/* Ajuste para as seções de configuração no mobile */
.rounded-15 {
  border-radius: 15px !important;
}

@media (max-width: 600px) {
  .q-pa-xl {
    padding: 24px !important; /* Reduz padding interno no mobile */
  }
}
</style>
