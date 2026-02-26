<template>
  <q-layout class="group-details-layout">
    <q-page-container>
      <q-page class="group-details-page q-pa-lg">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Loading State -->
        <div
          v-if="groupStore.loading"
          class="loading-container"
          style="position: relative; z-index: 10"
        >
          <q-spinner size="80px" color="primary" />
          <p class="q-mt-md text-grey-7">Carregando detalhes do grupo...</p>
        </div>

        <!-- Page Content -->
        <div
          v-else
          class="page-content"
          style="position: relative; z-index: 10"
        >
          <!-- Header Component -->
          <GroupHeader />

          <!-- User Financial Section -->
          <div class="financial-section q-mb-lg">
            <div class="section-header q-mb-md">
              <h3 class="section-title">Informações Financeiras Pessoais</h3>
              <q-icon name="account_balance" size="24px" color="primary" />
            </div>
            <UserFinancialSummary :stats="userFinancialStats" />
          </div>

          <!-- Group Information Section -->
          <div class="group-info-section">
            <div class="section-header q-mb-md">
              <h3 class="section-title">Informações do Grupo</h3>
              <q-icon name="info" size="24px" color="primary" />
            </div>

            <div class="row q-col-gutter-lg">
              <!-- Left Sidebar -->
              <div class="col-12 col-lg-4">
                <!-- Group Stats Card -->
                <q-card class="stats-card q-mb-lg">
                  <q-card-section class="q-pa-lg">
                    <GroupStatsCard
                      :group="group"
                      :balance="balance"
                      @go-to-settings="goToSettings"
                      @show-loan-modal="showLoanModal = true"
                      @show-items-modal="showMyItemsModal = true"
                    />
                  </q-card-section>
                </q-card>

                <!-- Next Payouts Card -->
                <q-card class="payouts-card">
                  <q-card-section class="q-pa-lg">
                    <div class="payouts-header q-mb-md">
                      <h4 class="payouts-title">Próximos Pagamentos</h4>
                      <q-icon name="schedule" color="primary" />
                    </div>
                    <GroupNextPayouts
                      :next-received="nextReceived"
                      :loading="payoutScheduleStore.loading"
                      :error="payoutScheduleStore.error ?? 'Erro'"
                    />
                  </q-card-section>
                </q-card>
              </div>

              <!-- Right Content Area -->
              <div class="col-12 col-lg-8">
                <!-- Tabs Card -->
                <q-card class="tabs-card">
                  <!-- Tabs Header -->
                  <q-tabs
                    v-model="tab"
                    dense
                    class="tabs-header"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab
                      name="members"
                      label="Membros"
                      no-caps
                      icon="people"
                    />
                    <q-tab
                      name="loans"
                      label="Empréstimos"
                      no-caps
                      icon="trending_down"
                    />
                    <q-tab
                      name="history"
                      label="Histórico"
                      no-caps
                      icon="history"
                    />
                  </q-tabs>

                  <q-separator class="tab-separator" />

                  <!-- Tab Panels -->
                  <q-tab-panels v-model="tab" animated class="tab-panels">
                    <!-- Members Tab -->
                    <q-tab-panel name="members" class="tab-panel">
                      <TabMembers
                        :members="members"
                        @add-member="showAddMemberModal = true"
                      />
                    </q-tab-panel>

                    <!-- Loans Tab -->
                    <q-tab-panel name="loans" class="tab-panel">
                      <TabLoans
                        :loans="groupLoans"
                        :interest-rate="group.interestRate ?? undefined"
                        @toggle-loan="toggleLoan"
                        @pay-installment="selectedRowPaidLoan"
                      />
                    </q-tab-panel>

                    <!-- History Tab -->
                    <q-tab-panel name="history" class="tab-panel">
                      <TabCycleHistory
                        :cycles="cycleHistory"
                        :is-owner="group.isOwner"
                        @view-cycle="viewCycleDetails"
                        @pay-cycle="handledPayCycle"
                        @pay-confirmation="handledPayConfirmation"
                      />
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================ -->
        <!-- MODALS                           -->
        <!-- ================================ -->

        <!-- Add Member Modal -->
        <ModalAddMember
          v-model="showAddMemberModal"
          :search-query="memberSearchQuery"
          :results="searchResults"
          :loading="loadingMemberSearch"
          @before-hide="resetAddMemberForm"
          @search-query-changed="memberSearchQuery = $event"
          @select-member="selectMemberFromSearch"
          @add-member="addMemberToGroup"
        />

        <!-- Request Loan Modal -->
        <ModalRequestLoan
          v-model="showLoanModal"
          :form="loanForm"
          :interest-rate="group.interestRate ?? undefined"
          :is-owner="group.isOwner"
          @before-hide="resetLoanForm"
          @update:form="loanForm = $event"
          @calculate-interest="calculateInterest"
          @change-status="changeLoanStatus"
          @submit="submitLoanRequest"
          v-if="hasAllowLoans"
        />

        <!-- My Items Modal -->
        <ModalMyItems
          v-model="showMyItemsModal"
          :items="userItems"
          :new-item="newItemForm"
          :categories="categories"
          :balance="userFinancialStats.totalBalance"
          @before-hide="resetItemsForm"
          @update:new-item="newItemForm = $event"
          @add-item="addNewItem"
          @remove-item="removeItem"
          @save="saveItems"
          v-if="hasAllowItemChoice"
        />

        <!-- Payment Proof Modal -->
        <ModalPaymentProof
          v-model="showPaidLoadModal"
          :form="paidLoadForm"
          :show-status="!!installmentStatus"
          :status-options="statusOptions"
          @update:form="paidLoadForm = $event"
          @save="onSave"
        />

        <!-- Group Rules Modal -->
        <ModalGroupRules
          v-model="showGroupRulesModal"
          :rules="group.groupRules"
          :group-name="group.name"
        />

        <!-- Cycle Details Modal -->
        <ModalCycleDetails
          v-model="cycleModal.show"
          :cycle="cycleModal.data ?? undefined"
        />

        <!-- Floating Orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Stores
import { useGroupStore } from '../store';
import { usePayoutScheduleStore } from 'src/stores/payout-schedule.store';
import { useGroupMemberStore } from '../store/group-member.store';
import { usePaymentStore } from 'src/stores/payment-store';
import { useLoanStore } from 'src/pages/loan/store';
import { useUserStore } from 'src/pages/user/store';

// Composables
import useNotify from 'src/composables/UseNotify';

// Components
import GroupHeader from '../components/GroupHeader.vue';
import GroupStatsCard from '../components/GroupStatsCard.vue';
import GroupNextPayouts from '../components/GroupNextPayouts.vue';
import UserFinancialSummary from '../components/UserFinancialSummary.vue';
import TabMembers from '../components/TabMembers.vue';
import TabLoans from '../components/TabLoans.vue';
import TabCycleHistory from '../components/TabCycleHistory.vue';
import ModalAddMember from '../components/modals/ModalAddMember.vue';
import ModalRequestLoan from '../components/modals/ModalRequestLoan.vue';
import ModalMyItems from '../components/modals/ModalMyItems.vue';
import ModalPaymentProof from '../components/modals/ModalPaymentProof.vue';
import ModalGroupRules from '../components/modals/ModalGroupRules.vue';
import ModalCycleDetails from '../components/modals/ModalCycleDetails.vue';

// Initialize
const route = useRoute();
const router = useRouter();
const { notifySuccess, notifyError, notifyInfo } = useNotify();

const groupStore = useGroupStore();
const payoutScheduleStore = usePayoutScheduleStore();
const groupMemberStore = useGroupMemberStore();
const loanStore = useLoanStore();
const paymentStore = usePaymentStore();
const userStore = useUserStore();

const id = route.params.id as string;

// ============== REFS ==============
const tab = ref('members');

// User Financial Stats
const userFinancialStats = ref({
  totalBalance: 0,
  totalContributed: 0,
  totalReceived: 0,
  loansRequested: 0,
  interestAccumulated: 0,
  totalLoansWithInterest: 0,
  loansPaid: 0,
  remainingDebt: 0,
  activeGroupsCount: 0,
  pendingPaymentsCount: 0,
  pendingLoansCount: 0,
  creditScore: 0,
  defaultRate: 100,
  avgPaymentDelay: 0,
});

interface Loan {
  id: string;
  amount_requested: number;
  installments: unknown[];
  purpose: string;
  status: string;
}

export interface ScheduleItem {
  product_name: string;
  category: string;
  target_quantity: string; // ⚠️ se for número, mude para number
  price: string; // ⚠️ se for número, mude para number
  group_id: string;
}

// Members
const showAddMemberModal = ref(false);
const memberSearchQuery = ref('');
const loadingMemberSearch = ref(false);
const searchResults = ref([]);

// Loans
const showLoanModal = ref(false);
const showPaidLoadModal = ref(false);
const loanForm = ref({
  id: '',
  amount: 0,
  duration: 12,
  reason: '',
  interest: 0,
  total: 0,
  status: '',
});

// Items
const showMyItemsModal = ref(false);
const userItems = ref<ScheduleItem[]>([]); // ✅
const newItemForm = ref({
  product_name: '',
  category: '',
  target_quantity: '',
  price: '',
});

// Payment Proof
const paidLoadForm = ref({
  proof_url: '',
  status: '',
});
const installmentAmount = ref(0);
const installmentNumber = ref(0);
const installmentLoanId = ref('');
const installmentStatus = ref(null);

// Rules Modal
const showGroupRulesModal = ref(false);

// Cycle Modal
const cycleModal = ref({ show: false, data: null });

// Status options
const statusOptions = [
  { label: 'Confirmado', value: 'Confirmado' },
  { label: 'Rejeitado', value: 'Rejeitado' },
];

const categories = [
  { label: 'Alimentos', value: 'Alimentos' },
  { label: 'Bebidas', value: 'Bebidas' },
];

// ============== COMPUTED ==============
const group = computed(() => groupStore.group);
const balance = computed(() => group.value.balance);
const nextReceived = computed(() => payoutScheduleStore.nextReceived);
const members = computed(() => groupMemberStore.groupMembers);
const groupLoans = computed(() => loanStore.groupLoans);
const cycleHistory = computed(() => paymentStore.paymentCycles);
const groupRules = computed(() => group.value.groupRules);
const hasAllowItemChoice = computed(
  () =>
    groupRules.value?.some(
      (p: { rule: { code: string } }) => p?.rule?.code === 'ALLOW_ITEM_CHOICE'
    ) ?? false
);
const hasAllowLoans = computed(
  () =>
    groupRules.value?.some(
      (p: { rule: { code: string } }) => p?.rule?.code === 'ALLOW_LOANS'
    ) ?? false
);

// ============== LIFECYCLE ==============
onMounted(async () => {
  await groupStore.fetchGroup(id);
  await payoutScheduleStore.fetchNextReceived(id, 1);
  await groupMemberStore.fetchGroupMembers(id);
  await loanStore.fetchGroupLoans(id);
  await paymentStore.fetchPaymentCycles(id);
  await loadUserItems();
  await loadUserFinancialStats();
});

// ============== WATCHERS ==============
watch(memberSearchQuery, (newValue) => {
  if (newValue.length >= 2) {
    searchMembersDatabase();
  } else {
    searchResults.value = [];
  }
});

// ============== USER FINANCIAL STATS FUNCTIONS ==============
const loadUserFinancialStats = async () => {
  try {
    const stats = await userStore.getUserFinancialStats(id);
    if (stats) {
      userFinancialStats.value = stats;
    }
  } catch (error) {
    console.error(
      'Erro ao carregar estatísticas financeiras do usuário:',
      error
    );
  }
};

// ============== ITEMS FUNCTIONS ==============
const loadUserItems = async () => {
  try {
    await payoutScheduleStore.fetchUserItem(id);
    userItems.value = payoutScheduleStore.userItems;
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
};

const resetItemsForm = () => {
  newItemForm.value = {
    product_name: '',
    category: '',
    target_quantity: '',
    price: '',
  };
};

const addNewItem = async () => {
  if (!newItemForm.value.product_name || !newItemForm.value.category) {
    notifyInfo('Preencha o nome e categoria do item');
    return;
  }

  const item: ScheduleItem = {
    product_name: newItemForm.value.product_name,
    category: newItemForm.value.category,
    target_quantity: newItemForm.value.target_quantity,
    price: newItemForm.value.price,
    group_id: id,
  };

  try {
    await payoutScheduleStore.createScheduleItem(item);
    userItems.value.push(item);
    resetItemsForm();
    notifySuccess('Item adicionado com sucesso!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message || 'Erro ao adicionar item');
  }
};

const removeItem = async (index: number, itemId: string) => {
  try {
    await payoutScheduleStore.removeUserItem(itemId);
    userItems.value.splice(index, 1);
    notifySuccess('Item removido!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message || 'Erro ao remover item');
  }
};

const saveItems = async () => {
  try {
    notifySuccess('Itens salvos com sucesso!');
    showMyItemsModal.value = false;
  } catch (error) {
    notifyError('Erro ao salvar itens');
  }
};

// ============== MEMBER FUNCTIONS ==============
const resetAddMemberForm = () => {
  memberSearchQuery.value = '';
  searchResults.value = [];
};

const searchMembersDatabase = async () => {
  if (memberSearchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  loadingMemberSearch.value = userStore.loading;

  try {
    const memberIds = new Set(members.value.map((m) => m.member_id));
    const results = await userStore.searchUsers(memberSearchQuery.value);
    searchResults.value = (results || []).filter(
      (user: { id: string }) => !memberIds.has(user.id)
    );
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    searchResults.value = [];
  } finally {
    loadingMemberSearch.value = userStore.loading;
  }
};

const selectMemberFromSearch = () => {
  memberSearchQuery.value = '';
  searchResults.value = [];
};

const addMemberToGroup = async (memberId: string) => {
  try {
    await groupMemberStore.addMemberToGroup({
      group_id: id,
      user_id: memberId,
    });

    notifySuccess('Membro adicionado com sucesso!');
    showAddMemberModal.value = false;
    resetAddMemberForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message || 'Erro ao adicionar membro');
  }
};

// ============== LOAN FUNCTIONS ==============
const resetLoanForm = () => {
  loanForm.value = {
    id: '',
    amount: 0,
    duration: 12,
    reason: '',
    interest: 0,
    total: 0,
    status: '',
  };
};

const calculateInterest = () => {
  const amount = loanForm.value.amount || 0;
  const interestRate = (group.value.interestRate ?? 0) / 100;
  loanForm.value.interest = parseFloat((amount * interestRate).toFixed(2));
  loanForm.value.total = parseFloat(
    (amount + loanForm.value.interest).toFixed(2)
  );
};

const submitLoanRequest = async () => {
  if (!loanForm.value.amount || !loanForm.value.duration) {
    notifyInfo('Preencha todos os campos obrigatórios');
    return;
  }

  try {
    await loanStore.create({
      group_id: id,
      amount_requested: loanForm.value.amount,
      installments: loanForm.value.duration,
      purpose: loanForm.value.reason ?? 'NA',
    });

    notifySuccess('Empréstimo solicitado com sucesso!');
    showLoanModal.value = false;
    resetLoanForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message || 'Erro ao solicitar empréstimo');
  }
};

const toggleLoan = (loan: Loan) => {
  loanForm.value.id = loan.id;
  loanForm.value.amount = loan.amount_requested;
  loanForm.value.duration = loan.installments.length;
  loanForm.value.reason = loan.purpose;
  loanForm.value.status = loan.status;
  showLoanModal.value = true;
};

const changeLoanStatus = async () => {
  try {
    await loanStore.update(loanForm.value.id, {
      status: loanForm.value.status,
    });

    notifySuccess('Empréstimo ' + loanForm.value.status);
    await loanStore.fetchGroupLoans(id);
    showLoanModal.value = false;
    resetLoanForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message || 'Erro ao solicitar empréstimo');
  }
};

const selectedRowPaidLoan = ({ loanId, amount, number, status }: any) => {
  showPaidLoadModal.value = true;
  installmentAmount.value = amount;
  installmentNumber.value = number;
  installmentLoanId.value = loanId;
  installmentStatus.value = status;
};

const onSave = async () => {
  try {
    if (!installmentStatus.value) {
      const body = {
        ...paidLoadForm.value,
        amount_paid: installmentAmount.value,
        installment_number: installmentNumber.value,
        payment_date: new Date(),
      };
      await loanStore.createLoanPayment(installmentLoanId.value, body);
    } else {
      await loanStore.updateLoanPayment(installmentStatus.value.id, {
        status: paidLoadForm.value.status,
      });
    }
    await loanStore.fetchGroupLoans(id);
    showPaidLoadModal.value = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error.message);
  }
};

const handledPayCycle = async (cycle: { cycleNumber: number }) => {
  try {
    await paymentStore.create({ cycle_number: cycle.cycleNumber });
    notifySuccess('Pagamento enviando, aguarde a aprovação do gestor');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error);
  }
};

const handledPayConfirmation = async (cycle: { paymentId: string }) => {
  try {
    await paymentStore.update(cycle.paymentId, { status: 'Pago' });
    notifySuccess('Pagamento confirmado');
    await paymentStore.fetchPaymentCycles(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    notifyError(error);
  }
};

// ============== NAVIGATION FUNCTIONS ==============
const goToSettings = () => router.push(`/groups/${id}/settings`);

const viewCycleDetails = (cycle: { cycleNumber: number }) => {
  cycleModal.value.show = true;
  router.push(`/groups/${id}/cycle/${cycle.cycleNumber}`);
};
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.group-details-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.group-details-page {
  position: relative;
  min-height: 100vh;
}

// ============== BACKGROUND ==============
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(91, 114, 255, 0.05) 0%,
    rgba(0, 217, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 0;
}

// ============== ORBS ==============
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  z-index: 0;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, $primary, $secondary);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, $secondary, $primary);
  bottom: 10%;
  right: -50px;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, $primary, #a78bfa);
  top: 50%;
  left: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

// ============== CONTENT ==============
.page-content {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// ============== SECTIONS ==============
.financial-section,
.group-info-section {
  animation: slideInUp 0.6s ease-out;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== CARDS ==============
.stats-card,
.payouts-card,
.tabs-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba($primary, 0.2);
    box-shadow: 0 15px 40px rgba($primary, 0.1);
  }
}

.payouts-card {
  .payouts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .payouts-title {
      font-size: 16px;
      font-weight: 700;
      color: $dark;
      margin: 0;
    }
  }
}

// ============== TABS ==============
.tabs-card {
  overflow: hidden;

  .tabs-header {
    padding: 0 20px;
    background: linear-gradient(
      135deg,
      rgba($primary, 0.05),
      rgba($secondary, 0.05)
    );

    :deep(.q-tab) {
      font-weight: 600;
      font-size: 13px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;

      &.q-tab--active {
        color: $primary;
      }

      &:hover {
        background: rgba($primary, 0.05);
      }
    }

    :deep(.q-tabs__content) {
      min-height: auto;
    }
  }

  .tab-separator {
    margin: 0;
  }

  .tab-panels {
    background: rgba(255, 255, 255, 0.5);

    :deep(.q-tab-panel) {
      padding: 24px;
      animation: fadeIn 0.3s ease-out;
    }
  }

  .tab-panel {
    min-height: 400px;
  }
}

// ============== LOADING ==============
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}

// ============== RESPONSIVE ==============
@media (max-width: 1024px) {
  .stats-card,
  .payouts-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 16px;
  }

  .tabs-card {
    .tab-panels {
      :deep(.q-tab-panel) {
        padding: 16px;
      }
    }
  }

  .tab-panel {
    min-height: 300px;
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 24px;
}

:deep(.q-tab-panels) {
  background: transparent;
}

:deep(.q-tab-panel) {
  padding: 24px;
}

:deep(.q-linear-progress) {
  border-radius: 8px;
}
</style>
