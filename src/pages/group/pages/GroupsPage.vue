<template>
  <q-layout class="groups-layout">
    <q-page-container>
      <q-page class="groups-page q-pa-lg">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-card">
            <q-spinner size="50px" color="primary" />
            <p class="q-mt-md text-subtitle2">Carregando seus grupos...</p>
          </div>
        </div>

        <!-- Main Content -->
        <template v-else>
          <!-- Header Section -->
          <div
            class="header-section q-mb-lg"
            style="position: relative; z-index: 10"
          >
            <div class="row items-center justify-between">
              <div>
                <h1 class="page-title">Meus Grupos</h1>
                <p class="page-subtitle">Gerencie seus círculos de poupança</p>
              </div>
              <q-btn
                unelevated
                rounded
                color="primary"
                icon="add"
                label="Novo Grupo"
                class="new-group-btn"
                @click="showGroupDialog = true"
                no-caps
              />
            </div>
          </div>

          <!-- Error Alert -->
          <q-banner v-if="errorMessage" class="bg-negative text-white q-mb-lg">
            <template v-slot:avatar>
              <q-icon name="error" />
            </template>
            {{ errorMessage }}
            <template v-slot:action>
              <q-btn
                flat
                color="white"
                label="Tentar Novamente"
                @click="retryFetch"
              />
            </template>
          </q-banner>

          <!-- Filters & Search Section -->
          <div
            class="filters-section q-mb-lg"
            style="position: relative; z-index: 10"
          >
            <q-card class="filters-card">
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md items-center">
                  <!-- Search Input -->
                  <div class="col-12 col-md-5">
                    <q-input
                      v-model="searchQuery"
                      outlined
                      dense
                      placeholder="Pesquisar grupos..."
                      prefix-icon="search"
                      clearable
                      class="search-input"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <!-- Status Filter -->
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="selectedStatus"
                      :options="statusOptions"
                      outlined
                      dense
                      emit-value
                      map-options
                      clearable
                      option-value="value"
                      option-label="label"
                      placeholder="Status"
                      class="filter-select"
                    >
                      <template v-slot:prepend>
                        <q-icon name="filter_alt" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Sort Option -->
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="sortBy"
                      :options="sortOptions"
                      outlined
                      dense
                      emit-value
                      map-options
                      option-value="value"
                      option-label="label"
                      class="filter-select"
                    >
                      <template v-slot:prepend>
                        <q-icon name="sort" />
                      </template>
                    </q-select>
                  </div>

                  <!-- Clear Filters Button -->
                  <div class="col-12 col-md-auto">
                    <q-btn
                      flat
                      color="grey-7"
                      icon="close"
                      label="Limpar"
                      no-caps
                      size="sm"
                      @click="clearFilters"
                    />
                  </div>
                </div>

                <!-- Active Filters Display -->
                <div v-if="hasActiveFilters" class="active-filters q-mt-md">
                  <span class="text-caption text-weight-bold text-grey-7"
                    >Filtros Ativos:</span
                  >
                  <q-chip
                    v-if="searchQuery"
                    removable
                    @remove="searchQuery = ''"
                    color="primary-1"
                    text-color="primary"
                    icon="search"
                    class="q-ml-sm"
                  >
                    {{ searchQuery }}
                  </q-chip>
                  <q-chip
                    v-if="selectedStatus"
                    removable
                    @remove="selectedStatus = null"
                    color="primary-1"
                    text-color="primary"
                    icon="filter_alt"
                    class="q-ml-xs"
                  >
                    {{ getStatusLabel(selectedStatus) }}
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Groups Grid -->
          <div
            v-if="filteredAndSortedGroups.length > 0"
            class="groups-section"
            style="position: relative; z-index: 10"
          >
            <div class="row q-col-gutter-lg">
              <div
                v-for="(group, index) in paginatedGroups"
                :key="group.id"
                class="col-12 col-sm-6 col-lg-4"
              >
                <q-card class="group-card" @click="goToDetails(group.id)">
                  <!-- Card Header with Status Badge -->
                  <div class="card-header">
                    <q-avatar
                      rounded
                      :color="getGroupColor(index)"
                      text-color="white"
                      icon="hub"
                      size="48px"
                    />
                    <div class="q-ml-md header-content">
                      <div class="group-name">{{ group.name }}</div>
                      <div class="group-cycle">
                        {{ group.monthly_value }} MT / {{ group.cycleName }}
                      </div>
                    </div>
                    <q-badge
                      :color="getStatusColor(group.status)"
                      :text-color="getStatusTextColor(group.status)"
                      rounded
                      outline
                      class="status-badge"
                    >
                      {{ group.status }}
                    </q-badge>
                  </div>

                  <!-- Card Body -->
                  <q-card-section class="card-body">
                    <!-- Members Info -->
                    <div class="info-row q-mb-md">
                      <div class="info-label">Membros</div>
                      <div class="info-value">
                        {{ group.totalMembers }}
                        <span class="info-sublabel"
                          >({{ group.paidMembers }} pagaram)</span
                        >
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="progress-section">
                      <div class="progress-header">
                        <span class="progress-label">Progresso do Mês</span>
                        <span class="progress-percentage">
                          {{ Math.round((group.progress / 100) * 100) }}%
                        </span>
                      </div>
                      <q-linear-progress
                        :value="group.progress / 100"
                        color="primary"
                        rounded
                        class="group-progress"
                      />
                    </div>

                    <!-- Balance Info -->
                    <div class="info-row q-mt-md">
                      <div class="info-label">Saldo Total</div>
                      <div class="info-value">
                        {{ formatCurrency(group.balance) }}
                        <span class="info-currency">MT</span>
                      </div>
                    </div>
                  </q-card-section>

                  <!-- Card Footer -->
                  <q-separator />
                  <q-card-actions align="right" class="card-footer">
                    <q-btn
                      flat
                      color="primary"
                      label="Ver Detalhes"
                      no-caps
                      icon-right="chevron_right"
                      class="action-btn"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination-section q-mt-lg">
              <div class="row items-center justify-between full-width">
                <div class="text-caption text-grey-7">
                  Mostrando {{ startIndex + 1 }} até {{ endIndex }} de
                  {{ filteredAndSortedGroups.length }} grupos
                </div>

                <q-pagination
                  v-model="currentPage"
                  :max="totalPages"
                  direction-links
                  outline
                  rounded
                  color="primary"
                  active-color="primary"
                  active-text-color="white"
                />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state" style="position: relative; z-index: 10">
            <q-card class="empty-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="folder_open" size="80px" class="empty-icon" />
                <h3 class="empty-title">Nenhum Grupo Encontrado</h3>
                <p class="empty-message">
                  {{
                    searchQuery || selectedStatus
                      ? 'Nenhum grupo corresponde aos filtros selecionados'
                      : 'Você ainda não tem nenhum grupo. Crie um novo para começar!'
                  }}
                </p>
                <q-btn
                  unelevated
                  color="primary"
                  label="Criar Novo Grupo"
                  icon="add"
                  class="q-mt-lg create-btn"
                  no-caps
                  @click="showGroupDialog = true"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- New Group Dialog -->
          <q-dialog
            v-model="showGroupDialog"
            backdrop-filter="blur(4px)"
            class="group-dialog"
          >
            <NewGroupDialog @save="addGroup" :group-types="groupTypes" />
          </q-dialog>

          <!-- Floating Orbs -->
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </template>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupStore } from '../store';
import { useQuasar } from 'quasar';
import NewGroupDialog from '../../../components/NewGroupDialog.vue';

// Constants
const ITEMS_PER_PAGE = 9;

const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Finalizado', value: 'finalizado' },
];

const sortOptions = [
  { label: 'Mais Recente', value: 'recent' },
  { label: 'Alfabético', value: 'alphabetic' },
  { label: 'Maior Saldo', value: 'balance' },
  { label: 'Mais Membros', value: 'members' },
];

const groupColors = [
  'primary',
  'secondary',
  'orange-9',
  'green-8',
  'purple-8',
  'red-8',
  'teal-8',
  'amber-8',
  'pink-8',
];

// Stores & Router
const groupStore = useGroupStore();
const router = useRouter();
const $q = useQuasar();

// State
const showGroupDialog = ref(false);
const searchQuery = ref('');
const selectedStatus = ref<string | null>(null);
const sortBy = ref('recent');
const currentPage = ref(1);
const isLoading = ref(true);
const errorMessage = ref('');

// Computed
const groups = computed(() => groupStore.groups || []);
const groupTypes = computed(() => groupStore.groupTypes || []);

const filteredAndSortedGroups = computed(() => {
  let filtered = groups.value.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      !selectedStatus.value ||
      group.status?.toLowerCase() === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });

  // Sort
  switch (sortBy.value) {
    case 'alphabetic':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'balance':
      filtered.sort((a, b) => (b.balance || 0) - (a.balance || 0));
      break;
    case 'members':
      filtered.sort((a, b) => b.totalMembers - a.totalMembers);
      break;
    case 'recent':
    default:
      filtered.sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeB - timeA;
      });
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredAndSortedGroups.value.length / ITEMS_PER_PAGE)
);

const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);

const endIndex = computed(() =>
  Math.min(
    currentPage.value * ITEMS_PER_PAGE,
    filteredAndSortedGroups.value.length
  )
);

const paginatedGroups = computed(() =>
  filteredAndSortedGroups.value.slice(startIndex.value, endIndex.value)
);

const hasActiveFilters = computed(
  () => !!searchQuery.value || !!selectedStatus.value
);

// Methods
const formatCurrency = (value: number | string): string => {
  if (!value) return '0.00';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getGroupColor = (index: number): string => {
  return groupColors[index % groupColors.length];
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    ativo: 'positive',
    inativo: 'warning',
    finalizado: 'info',
  };
  return colors[status?.toLowerCase()] || 'grey-4';
};

const getStatusTextColor = (status: string): string => {
  const colors: Record<string, string> = {
    ativo: 'positive',
    inativo: 'warning-9',
    finalizado: 'info',
  };
  return colors[status?.toLowerCase()] || 'grey-9';
};

const getStatusLabel = (value: string): string => {
  const label = statusOptions.find((opt) => opt.value === value);
  return label?.label || value;
};

const goToDetails = (id: string | number): void => {
  router.push(`/groups/${id}`);
};

const clearFilters = (): void => {
  searchQuery.value = '';
  selectedStatus.value = null;
  sortBy.value = 'recent';
  currentPage.value = 1;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addGroup = (data: any): void => {
  const newGroup = {
    id: Date.now().toString(),
    status: 'ativo',
    progress: 0,
    balance: 0,
    paidMembers: 0,
    totalMembers: 1,
    createdAt: new Date().toISOString(),
    ...data,
  };
  groupStore.groups.push(newGroup);
  showGroupDialog.value = false;
  currentPage.value = 1;
  
  $q.notify({
    type: 'positive',
    message: 'Grupo criado com sucesso!',
    position: 'top'
  });
};

const loadData = async (): Promise<void> => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Fazer as duas chamadas em paralelo
    await Promise.all([
      groupStore.fetchGroups(),
      groupStore.fetchGroupTypes()
    ]);
    
    // Garantir que temos dados
    if (!groups.value || groups.value.length === 0) {
      console.warn('Nenhum grupo carregado');
    }
  } catch (error) {
    console.error('Erro ao carregar grupos:', error);
    errorMessage.value = 'Erro ao carregar grupos. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const retryFetch = async (): Promise<void> => {
  await loadData();
};

// Watch para resetar paginação ao filtrar
watch([searchQuery, selectedStatus, sortBy], () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(async () => {
  await loadData();
});
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$secondary: #00d9ff;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.groups-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.groups-page {
  position: relative;
  min-height: 100vh;
}

// ============== LOADING ==============
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  z-index: 10;
  position: relative;

  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
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

// ============== HEADER ==============
.header-section {
  animation: slideInDown 0.6s ease-out;

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 0 0;
    font-weight: 500;
  }

  .new-group-btn {
    background: linear-gradient(135deg, $primary, #4f5ae4);
    color: white;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba($primary, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba($primary, 0.3);
    }
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== FILTERS ==============
.filters-section {
  animation: slideInUp 0.6s ease-out;
}

.filters-card {
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

.search-input,
.filter-select {
  :deep(.q-field__control) {
    border-radius: 12px;
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    color: $dark;

    &::placeholder {
      color: #d1d5db;
    }
  }
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  :deep(.q-chip) {
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
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

// ============== GROUPS GRID ==============
.groups-section {
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

// ============== GROUP CARD ==============
.group-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  animation: slideInCard 0.5s ease-out;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba($primary, 0.3);
    box-shadow: 0 20px 50px rgba($primary, 0.15);
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(
      135deg,
      rgba($primary, 0.05),
      rgba($secondary, 0.05)
    );
    border-bottom: 1px solid $border;

    .header-content {
      flex: 1;

      .group-name {
        font-size: 14px;
        font-weight: 700;
        color: $dark;
      }

      .group-cycle {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 2px;
      }
    }

    .status-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
    }
  }

  .card-body {
    padding: 20px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-label {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 14px;
        font-weight: 700;
        color: $dark;

        .info-sublabel {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
          margin-left: 4px;
        }

        .info-currency {
          font-size: 12px;
          font-weight: 500;
          margin-left: 4px;
          opacity: 0.7;
        }
      }
    }

    .progress-section {
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .progress-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 600;
        }

        .progress-percentage {
          font-size: 14px;
          font-weight: 700;
          color: $primary;
        }
      }

      .group-progress {
        border-radius: 8px;
        height: 6px;

        :deep(.q-linear-progress__track) {
          background: rgba($primary, 0.1);
        }
      }
    }
  }

  .card-footer {
    padding: 12px 20px;

    .action-btn {
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        color: white;
        background: linear-gradient(135deg, $primary, #4f5ae4);
      }
    }
  }
}

@keyframes slideInCard {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== PAGINATION ==============
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid $border;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  animation: slideInUp 0.6s ease-out;

  :deep(.q-pagination__content) {
    gap: 4px;
  }

  :deep(.q-pagination__content button) {
    min-width: 32px;
    height: 32px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($primary, 0.1);
    }

    &.q-pagination__content--active {
      background: linear-gradient(135deg, $primary, #4f5ae4);
      color: white;
      box-shadow: 0 4px 12px rgba($primary, 0.3);
    }
  }
}

// ============== EMPTY STATE ==============
.empty-state {
  animation: fadeIn 0.5s ease-out;
}

.empty-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  .empty-icon {
    color: rgba($primary, 0.2);
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 20px;
    font-weight: 700;
    color: $dark;
    margin: 12px 0;
  }

  .empty-message {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }

  .create-btn {
    background: linear-gradient(135deg, $primary, #4f5ae4);
    color: white;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba($primary, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba($primary, 0.3);
    }
  }
}

// ============== DIALOG ==============
.group-dialog {
  :deep(.q-dialog__backdrop) {
    background: rgba(0, 0, 0, 0.4);
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .filters-card {
    :deep(.q-field__control) {
      padding: 8px 12px;
    }
  }

  .pagination-section {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .group-card {
    .card-header {
      flex-direction: column;
      text-align: center;

      .header-content {
        margin: 12px 0;
      }
    }
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 20px;
}

:deep(.q-linear-progress) {
  border-radius: 8px;
}

:deep(.q-badge) {
  font-weight: 600;
  border-radius: 8px;
}
</style>