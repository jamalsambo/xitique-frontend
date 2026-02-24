<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header com Navegação -->
    <div class="row items-center q-mb-lg">
      <q-btn
        icon="arrow_back"
        flat
        round
        dense
        @click="goBack"
        class="q-mr-sm"
      />
      <div>
        <div class="text-h5 text-weight-bold">
          Ciclo {{ cycle?.cycleNumber }}
        </div>
        <div class="text-caption text-grey-7">
          {{ formatDate(cycle?.cycleStartDate) }} -
          {{ formatDate(cycle?.cycleEndDate) }}
        </div>
      </div>
      <q-space />
      <q-badge
        :color="getCycleStatus(cycle).color"
        :label="getCycleStatus(cycle).label"
        class="q-mr-md"
      />
    </div>

    <!-- Grid Principal -->
    <div class="row q-col-gutter-lg">
      <!-- Coluna Esquerda - Resumo do Ciclo -->
      <div class="col-12 col-md-4">
        <!-- Card Principal -->
        <q-card flat bordered class="rounded-20 bg-white">
          <q-card-section class="bg-gradient text-white q-pa-lg">
            <div class="text-subtitle2 opacity-80">Fundo Total do Ciclo</div>
            <div class="text-h3 text-weight-bold q-mt-md">
              {{ cycle?.totalAmount }} MT
            </div>
            <div class="text-caption opacity-75 q-mt-sm">
              {{ cycle?.membersCount }} membros × {{ cycle?.memberAmount }} MT
            </div>
          </q-card-section>

          <q-separator />

          <!-- Status do Pagamento -->
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-weight-bold q-mb-md">
              Status de Pagamento
            </div>

            <div class="column q-gutter-md">
              <!-- Pago -->
              <div class="stat-progress">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="row items-center q-gutter-sm">
                    <q-icon name="check_circle" color="positive" size="md" />
                    <span class="text-subtitle2 text-weight-bold">Pagos</span>
                  </div>
                  <span class="text-weight-bold text-positive">
                    {{ stats.paid }}/{{ cycle?.membersCount }}
                  </span>
                </div>
                <q-linear-progress
                  :value="stats.paid / cycle?.membersCount"
                  color="positive"
                  size="8px"
                  rounded
                />
                <div class="text-caption text-grey-7 q-mt-xs text-right">
                  {{ Math.round((stats.paid / cycle?.membersCount) * 100) }}%
                </div>
              </div>

              <!-- Pendente -->
              <div class="stat-progress">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="row items-center q-gutter-sm">
                    <q-icon name="pending_actions" color="warning" size="md" />
                    <span class="text-subtitle2 text-weight-bold"
                      >Pendentes</span
                    >
                  </div>
                  <span class="text-weight-bold text-warning">
                    {{ stats.pending }}/{{ cycle?.membersCount }}
                  </span>
                </div>
                <q-linear-progress
                  :value="stats.pending / cycle?.membersCount"
                  color="warning"
                  size="8px"
                  rounded
                />
                <div class="text-caption text-grey-7 q-mt-xs text-right">
                  {{ Math.round((stats.pending / cycle?.membersCount) * 100) }}%
                </div>
              </div>

              <!-- Atrasado -->
              <div v-if="stats.overdue > 0" class="stat-progress">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="row items-center q-gutter-sm">
                    <q-icon name="schedule" color="negative" size="md" />
                    <span class="text-subtitle2 text-weight-bold"
                      >Atrasado</span
                    >
                  </div>
                  <span class="text-weight-bold text-negative">
                    {{ stats.overdue }}/{{ cycle?.membersCount }}
                  </span>
                </div>
                <q-linear-progress
                  :value="stats.overdue / cycle?.membersCount"
                  color="negative"
                  size="8px"
                  rounded
                />
                <div class="text-caption text-grey-7 q-mt-xs text-right">
                  {{ Math.round((stats.overdue / cycle?.membersCount) * 100) }}%
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Datas Importantes -->
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-weight-bold q-mb-md">
              Datas Importantes
            </div>

            <div class="column q-gutter-md">
              <div class="date-item">
                <div class="text-caption text-grey-7">Início do Ciclo</div>
                <div class="text-subtitle2 text-weight-bold">
                  {{ formatDateFull(cycle?.cycleStartDate) }}
                </div>
              </div>

              <div class="date-item">
                <div class="text-caption text-grey-7">Fim do Ciclo</div>
                <div class="text-subtitle2 text-weight-bold">
                  {{ formatDateFull(cycle?.cycleEndDate) }}
                </div>
              </div>

              <div class="date-item bg-orange-1 rounded-10 q-pa-xs">
                <div class="text-caption text-orange-9">
                  Data Limite Pagamento
                </div>
                <div class="text-subtitle2 text-weight-bold text-orange-9">
                  {{ formatDateFull(cycle?.dueEndDate) }}
                </div>
              </div>

              <div
                v-if="cycle?.receiverSelectionDeadline"
                class="date-item bg-blue-1 rounded-10 q-pa-xs"
              >
                <div class="text-caption text-blue-9">
                  Prazo Seleção Recebedor
                </div>
                <div class="text-subtitle2 text-weight-bold text-blue-9">
                  {{ formatDateFull(cycle?.receiverSelectionDeadline) }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Ações Rápidas -->
          <q-card-section class="q-pa-md">
            <q-btn
              color="primary"
              label="Finalizar Ciclo"
              rounded
              class="full-width q-mb-sm"
              @click="finalizeCycleDialog = true"
            />
            <q-btn
              color="info"
              label="Gerar Relatório"
              rounded
              outline
              class="full-width"
              @click="generateReport"
            />
          </q-card-section>
        </q-card>

        <!-- Selecionados para Receber -->
        <q-card flat bordered class="rounded-20 bg-white q-mt-md">
          <q-card-section class="bg-positive text-white q-pa-md">
            <div class="text-subtitle2">Selecionados para Receber</div>
            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ selectedReceivers?.length || 0 }}
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div
              v-if="!selectedReceivers || selectedReceivers.length === 0"
              class="text-center q-py-lg text-grey-6"
            >
              <q-icon
                name="person_outline"
                size="48px"
                class="q-mb-md opacity-50"
              />
              <div class="text-caption">Nenhum membro selecionado ainda</div>
            </div>

            <q-list v-else separator>
              <q-item
                v-for="receiver in selectedReceivers"
                :key="receiver.id"
                class="q-py-sm"
              >
                <q-item-section avatar>
                  <q-avatar size="36px" color="positive" text-color="white">
                    <img v-if="receiver.avatar" :src="receiver.avatar" />
                    <q-icon v-else name="person" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ receiver.member.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ receiver.member.phone }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    v-if="hasAdminAccess"
                    flat
                    round
                    dense
                    icon="close"
                    color="negative"
                    size="sm"
                    @click="removeReceiverFromCycle(receiver.member.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              v-if="hasAdminAccess"
              color="positive"
              label="Adicionar Recebedor"
              icon="add"
              rounded
              unelevated
              class="full-width q-mt-md"
              @click="addReceiverDialog = true"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Coluna Direita - Lista de Membros -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-20 bg-white">
          <!-- Tabs -->
          <q-tabs
            v-model="membersTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="all" label="Todos os Membros" />
            <q-tab name="paid" label="Pagos" />
            <q-tab name="pending" label="Pendentes" />
            <q-tab name="overdue" label="Atrasados" />
          </q-tabs>

          <q-separator />

          <!-- Search e Filtros -->
          <q-card-section class="q-pa-md border-bottom">
            <q-input
              v-model="searchMembers"
              outlined
              dense
              rounded
              placeholder="Pesquisar membro..."
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>

          <!-- Lista de Membros -->
          <q-tab-panels
            v-model="membersTab"
            animated
            class="bg-white rounded-20"
          >
            <q-tab-panel name="all" class="q-pa-none">
              <members-list
                :members="filteredMembers"
                :cycle="cycle"
                :is-owner="isOwner"
                :has-admin-access="hasAdminAccess"
                @confirm-payment="confirmPayment"
                @add-note="openNoteDialog"
              />
            </q-tab-panel>

            <q-tab-panel name="paid" class="q-pa-none">
              <members-list
                :members="filteredMembers.filter((m) => m.status === 'Pago')"
                :cycle="cycle"
                :has-admin-access="hasAdminAccess"
                @confirm-payment="confirmPayment"
                @add-note="openNoteDialog"
              />
            </q-tab-panel>

            <q-tab-panel name="pending" class="q-pa-none">
              <members-list
                :members="
                  filteredMembers.filter((m) => m.status === 'Pendente')
                "
                :cycle="cycle"
                :has-admin-access="hasAdminAccess"
                @confirm-payment="confirmPayment"
                @add-note="openNoteDialog"
              />
            </q-tab-panel>

            <q-tab-panel name="overdue" class="q-pa-none">
              <members-list
                :members="
                  filteredMembers.filter((m) => m.status === 'Atrasado')
                "
                :cycle="cycle"
                :has-admin-access="hasAdminAccess"
                @confirm-payment="confirmPayment"
                @add-note="openNoteDialog"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Dialog: Adicionar Recebedor -->
    <q-dialog v-model="addReceiverDialog" position="right">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white q-pa-lg">
          <div class="text-h6">Selecionar Recebedor</div>
          <div class="text-caption opacity-80">
            Escolha qual membro receberá o fundo deste ciclo
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <!-- Search -->
          <q-input
            v-model="receiverSearch"
            outlined
            dense
            rounded
            placeholder="Pesquisar membro..."
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- Lista de Membros Disponíveis -->
          <q-list separator>
            <q-item
              v-for="member in filteredAvailableReceivers"
              :key="member.id"
              clickable
              @click="selectReceiver(member)"
              class="q-py-sm hover-item"
            >
              <q-item-section avatar>
                <q-avatar size="40px" color="primary" text-color="white">
                  <img v-if="member.avatar" :src="member.avatar" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ member.member }}
                </q-item-label>
                <q-item-label caption>
                  {{ member.phone }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-right">
                  <div class="text-weight-bold">
                    {{ member?.accountNumber }}
                  </div>
                  <q-chip
                    :color="
                      member.paymentStatus === 'Pago' ? 'positive' : 'warning'
                    "
                    text-color="white"
                    size="sm"
                  >
                    {{ member.paymentStatus === 'Pago' ? 'Pagou' : 'Pendente' }}
                  </q-chip>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Mensagem quando não há membros disponíveis -->
          <div
            v-if="filteredAvailableReceivers.length === 0"
            class="text-center q-py-lg text-grey-6"
          >
            <q-icon
              name="person_outline"
              size="48px"
              class="q-mb-md opacity-50"
            />
            <div v-if="availableReceivers.length === 0">
              <div class="text-subtitle2 q-mb-sm">Todos os membros já estão selecionados</div>
              <div class="text-caption">Não há mais membros disponíveis para seleção</div>
            </div>
            <div v-else>
              <div class="text-subtitle2 q-mb-sm">Nenhum resultado encontrado</div>
              <div class="text-caption">Tente outro termo de busca</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
          />
          <q-badge
            v-if="availableReceivers.length > 0"
            color="primary"
            floating
            rounded
            :label="availableReceivers.length"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Adicionar Nota/Observação -->
    <q-dialog v-model="noteDialog.show">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-info text-white q-pa-lg">
          <div class="text-h6">Adicionar Observação</div>
          <div class="text-caption opacity-80">
            {{ noteDialog.memberName }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <q-textarea
            v-model="noteDialog.text"
            outlined
            label="Observação"
            rows="5"
            placeholder="Digite uma observação..."
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn color="primary" label="Guardar" rounded @click="saveNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Finalizar Ciclo -->
    <q-dialog v-model="finalizeCycleDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="bg-warning text-white q-pa-lg">
          <div class="text-h6">Finalizar Ciclo {{ cycle?.cycleNumber }}?</div>
          <div class="text-caption opacity-80">
            Esta ação não pode ser desfeita
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <q-list dense>
            <q-item class="q-px-none q-py-sm">
              <q-item-section>
                <q-item-label caption>Total de Pagamentos</q-item-label>
                <q-item-label class="text-weight-bold">
                  {{ stats.paid }}/{{ cycle.membersCount }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-px-none q-py-sm">
              <q-item-section>
                <q-item-label caption>Recebedores Selecionados</q-item-label>
                <q-item-label class="text-weight-bold">
                  {{ cycle.selectedReceivers?.length || 0 }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-px-none q-py-sm">
              <q-item-section>
                <q-item-label caption>Atrasados</q-item-label>
                <q-item-label class="text-weight-bold text-negative">
                  {{ stats.overdue }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-checkbox
            v-model="confirmFinalize"
            label="Confirmo que desejo finalizar este ciclo"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            color="warning"
            label="Finalizar"
            rounded
            :disable="!confirmFinalize"
            @click="finalizeCycle"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from 'src/stores/payment-store';
import { usePayoutScheduleStore } from 'src/stores/payout-schedule.store';
import MembersList from 'src/components/MembersList.vue';

const route = useRoute();
const router = useRouter();
const { id, cycleId } = route.params;
const paymentStore = usePaymentStore();
const payoutScheduleStore = usePayoutScheduleStore();

const membersTab = ref('all');
const searchMembers = ref('');
const receiverSearch = ref('');
const addReceiverDialog = ref(false);
const finalizeCycleDialog = ref(false);
const confirmFinalize = ref(false);
const hasAdminAccess = ref(true); // Implementar verificação real

const PAYMENT_STATUS = {
  PAID: 'Pago',
  PENDING: 'Pendente',
  OVERDUE: 'Atrasado',
};

const noteDialog = ref({
  show: false,
  memberId: null,
  memberName: '',
  text: '',
});

// ============== DADOS COMPUTADOS ==============

const selectedReceivers = computed(() => payoutScheduleStore.cycleReceiveds);

onMounted(async () => {
  // Buscar dados da API
  await paymentStore.fetchCyclePaymentInformation(id, Number(cycleId));
  await payoutScheduleStore.fetchAll(id, Number(cycleId));
});

const paymentCycleInformation = computed(
  () => paymentStore.paymentCycleInformation ?? {}
);

const cycle = computed(() => paymentCycleInformation.value.cycle ?? null);
const members = computed(() => paymentCycleInformation.value.members ?? []);
const isOwner = computed(() => paymentCycleInformation.value.isOwner ?? null);

// ============== ESTATÍSTICAS ==============

const stats = computed(() => {
  const paid = members.value.filter(
    (m) => m.status === PAYMENT_STATUS.PAID
  ).length;

  const pending = members.value.filter(
    (m) => m.status === PAYMENT_STATUS.PENDING
  ).length;

  const overdue = members.value.filter(
    (m) => m.status === PAYMENT_STATUS.OVERDUE
  ).length;

  return {
    paid,
    pending,
    overdue,
    totalReceivedAmount: members.value.reduce((sum, m) => sum + m.amount, 0),
  };
});

// ============== FILTROS E DISPONIBILIDADE ==============

const filteredMembers = computed(() => {
  return members.value.filter(
    (m) =>
      m.member.toLowerCase().includes(searchMembers.value.toLowerCase()) ||
      m.phone.includes(searchMembers.value)
  );
});

/**
 * MELHORIA: Calcula os IDs dos membros já selecionados como recebedores
 * Evita que apareçam na lista de seleção
 */
const selectedReceiverIds = computed(() => {
  if (!selectedReceivers.value) return [];
  return selectedReceivers.value.map((r) => r.member_id || r.id);
});

/**
 * MELHORIA: Filtra membros disponíveis para seleção
 * Exclui automaticamente aqueles já selecionados como recebedores
 */
const availableReceivers = computed(() => {
  return members.value.filter(
    (m) => !selectedReceiverIds.value.includes(m.member_id || m.id)
  );
});

/**
 * MELHORIA: Filtra membros disponíveis conforme o termo de busca
 * Combina a busca com a exclusão de membros já selecionados
 */
const filteredAvailableReceivers = computed(() => {
  const searchTerm = receiverSearch.value.toLowerCase();

  if (searchTerm === '') {
    return availableReceivers.value;
  }

  return availableReceivers.value.filter(
    (m) =>
      m.member.toLowerCase().includes(searchTerm) ||
      m.phone.includes(searchTerm) ||
      (m.accountNumber && m.accountNumber.includes(searchTerm))
  );
});

// ============== FORMATAÇÃO DE DATAS ==============

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  });
};

const formatDateFull = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// ============== STATUS DO CICLO ==============

const getCycleStatus = (cycle) => {
  if (!cycle) return { label: 'Desconhecido', color: 'grey' };

  const now = new Date();
  const endDate = new Date(cycle.cycleEndDate);
  const dueDate = new Date(cycle.dueEndDate);

  if (cycle.isFinalized) {
    return { label: 'Finalizado', color: 'positive' };
  }
  if (now > dueDate) {
    return { label: 'Atrasado', color: 'negative' };
  }
  if (now > endDate) {
    return { label: 'Em Cobrança', color: 'warning' };
  }
  return { label: 'Em Curso', color: 'info' };
};

// ============== AÇÕES ==============

const confirmPayment = async (memberId) => {
  const member = members.value.find((m) => m.id === memberId);
  if (member) {
    member.status = 'paid';
    member.paymentDate = new Date().toISOString().split('T')[0];
    member.amount = cycle.value.memberAmount;
    // Chamar API: await paymentStore.confirmPayment(groupId, cycleId, memberId)
  }
};

const openNoteDialog = (memberId, memberName) => {
  noteDialog.value.memberId = memberId;
  noteDialog.value.memberName = memberName;
  noteDialog.value.text = '';
  noteDialog.value.show = true;
};

const saveNote = async () => {
  const member = members.value.find((m) => m.id === noteDialog.value.memberId);
  if (member && noteDialog.value.text.trim()) {
    if (!member.notes) {
      member.notes = [];
    }
    member.notes.push({
      text: noteDialog.value.text,
      date: new Date().toISOString().split('T')[0],
    });
    noteDialog.value.show = false;
    // Chamar API: await cycleStore.addNote(groupId, cycleId, memberId, note)
  }
};

/**
 * MELHORIA: Seleciona um membro como recebedor
 * Adiciona à lista de recebedores e remove da disponibilidade de seleção
 */
const selectReceiver = async (member) => {
  if (!selectedReceivers.value) {
    selectedReceivers.value = [];
  }

  const body = {
    cycle_number: Number(cycleId),
    member_id: member.member_id || member.id,
    cycleDate: cycle.value.cycleStartDate,
  };

  addReceiverDialog.value = false;
  await payoutScheduleStore.addReceiverToCycle(id, body);
  await payoutScheduleStore.fetchAll(id, Number(cycleId));
};

/**
 * MELHORIA: Remove um membro da lista de recebedores
 * Retorna à disponibilidade de seleção
 */
const removeReceiverFromCycle = async (receiverId) => {
  // Remove do estado local imediatamente (feedback visual)
  payoutScheduleStore.cycleReceiveds = payoutScheduleStore.cycleReceiveds.filter(
    (r) => r.member_id !== receiverId && r.id !== receiverId
  );

  // Sincroniza com o servidor
  await payoutScheduleStore.removeReceiverFromCycle(id, cycleId, receiverId);
};

const finalizeCycle = async () => {
  cycle.value.isFinalized = true;
  finalizeCycleDialog.value = false;
  // Chamar API: await cycleStore.finalizeCycle(groupId, cycleId)
};

const generateReport = () => {
  // Gerar relatório em PDF ou Excel
  console.log('Gerando relatório...');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(`/groups/${id}`);
  }
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.rounded-20 {
  border-radius: 20px;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.stat-progress {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 12px;
  border-left: 4px solid #1976d2;
}

.date-item {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.date-item:last-child {
  border-bottom: none;
}

.opacity-50 {
  opacity: 0.5;
}

.opacity-75 {
  opacity: 0.75;
}

.opacity-80 {
  opacity: 0.8;
}

.text-blue-9 {
  color: #0d47a1;
}

.text-orange-9 {
  color: #e65100;
}

.bg-orange-1 {
  background-color: #ffe0b2;
}

.bg-blue-1 {
  background-color: #bbdefb;
}

/* Hover effect para itens clicáveis */
.hover-item {
  transition: all 0.2s ease;
}

.hover-item:hover {
  background-color: #f5f5f5;
  padding-left: 16px;
}
</style>
