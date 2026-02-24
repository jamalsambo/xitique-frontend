<template>
  <q-layout class="settings-layout">
    <q-page-container>
      <q-page class="settings-page">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Header Section -->
        <div class="header-section" style="position: relative; z-index: 10">
          <div class="header-content">
            <div class="header-top q-mb-lg">
              <q-btn
                flat
                round
                dense
                icon="arrow_back"
                color="white"
                size="lg"
                @click="$router.back()"
                class="back-btn"
              />
              <div class="header-text">
                <h1 class="header-title">Definições do Grupo</h1>
                <p class="header-subtitle">
                  Gerencie as regras e políticas do seu Xitique
                </p>
              </div>
            </div>

            <div class="header-avatar">
              <q-avatar
                size="60px"
                color="white"
                text-color="primary"
                icon="settings"
                class="avatar-shadow"
              />
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="content-section q-mt-lg" style="position: relative; z-index: 10">
          <!-- Loading State -->
          <div v-if="ruleStore.loading" class="loading-container">
            <q-spinner size="60px" color="primary" />
            <p class="q-mt-md text-grey-7">Carregando configurações...</p>
          </div>

          <!-- Rules Section -->
          <div v-else>
            <!-- Section Header -->
            <div class="section-header q-mb-lg">
              <h2 class="section-title">Regras Operacionais</h2>
              <p class="section-subtitle">
                Configure as regras e políticas do seu grupo
              </p>
            </div>

            <!-- Rules Cards Container -->
            <div v-if="rules.length > 0" class="rules-container">
              <q-card
                v-for="rule in rules"
                :key="rule.id"
                class="rule-card"
              >
                <q-card-section class="rule-content">
                  <!-- Rule Header -->
                  <div class="rule-header">
                    <div class="rule-info">
                      <div class="rule-name">{{ rule.name }}</div>
                      <div class="rule-code">Código: {{ rule.code }}</div>
                      <p class="rule-description q-mt-sm">
                        {{ rule.description || "Configuração do grupo" }}
                      </p>
                    </div>

                    <q-toggle
                      :model-value="rule.enabled"
                      @update:model-value="(val) => toggleRule(rule, val)"
                      color="primary"
                      size="lg"
                      class="rule-toggle"
                    />
                  </div>

                  <!-- Rule Value Input (Slide Transition) -->
                  <q-slide-transition>
                    <div v-if="rule.enabled && rule.value_type === 'NUMBER'" class="rule-input-section">
                      <q-separator class="q-my-md" />

                      <div class="rule-input">
                        <label class="input-label">Valor</label>
                        <q-input
                          v-model.number="rule.value"
                          type="number"
                          outlined
                          dense
                          class="input-field"
                          :suffix="getRuleSuffix(rule)"
                          prefix-icon="edit"
                          @blur="updateRuleValue(rule)"
                        >
                          <template v-slot:hint>
                            {{ getRuleHint(rule) }}
                          </template>
                        </q-input>
                      </div>

                      <!-- Rule Info -->
                      <div class="rule-info-box q-mt-md">
                        <q-icon name="info" color="primary" size="sm" />
                        <span class="info-text">{{ getRuleInfo(rule) }}</span>
                      </div>
                    </div>
                  </q-slide-transition>

                  <!-- Status Badge -->
                  <div class="rule-status q-mt-md">
                    <q-badge
                      :color="rule.enabled ? 'positive' : 'grey-5'"
                      :text-color="rule.enabled ? 'white' : 'grey-7'"
                      rounded
                      outline
                    >
                      {{ rule.enabled ? "Ativado" : "Desativado" }}
                    </q-badge>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <q-card class="empty-card">
                <q-card-section class="text-center q-pa-xl">
                  <q-icon
                    name="rule"
                    size="80px"
                    class="empty-icon"
                  />
                  <h3 class="empty-title">Nenhuma Regra Configurada</h3>
                  <p class="empty-message">
                    Não há regras disponíveis para este grupo no momento
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Save Section -->
            <div v-if="rules.length > 0" class="save-section q-mt-lg">
              <q-card class="save-card">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between">
                    <div>
                      <h4 class="save-title">Alterações Salvas</h4>
                      <p class="save-description">
                        As configurações são atualizadas automaticamente
                      </p>
                    </div>
                    <q-icon
                      name="check_circle"
                      color="positive"
                      size="32px"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Floating Orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRuleStore } from 'src/stores/rules.store';
import { useRoute } from 'vue-router';

// Variables
const ruleStore = useRuleStore();
const route = useRoute();
const { id } = route.params;

// Computed
const rules = computed(() => ruleStore.rules);

// Lifecycle
onMounted(async () => {
  await ruleStore.fetchRulesByGroup(id);
});

// Methods
const toggleRule = async (rule: any, enabled: boolean) => {
  rule.enabled = enabled;

  try {
    await ruleStore.toggleRule(rule.id, id, enabled, rule.value);
  } catch (error) {
    console.error('Erro ao atualizar regra:', error);
  }
};

const updateRuleValue = async (rule: any) => {
  if (!rule.enabled) return;

  try {
    await ruleStore.toggleRule(rule.id, id, true, rule.value);
  } catch (error) {
    console.error('Erro ao salvar valor da regra:', error);
  }
};

const getRuleSuffix = (rule: any): string => {
  const suffixes: Record<string, string> = {
    'max_members': 'membros',
    'min_contribution': 'MT',
    'interest_rate': '%',
    'payment_deadline': 'dias',
  };
  return suffixes[rule.code] || '';
};

const getRuleHint = (rule: any): string => {
  const hints: Record<string, string> = {
    'max_members': 'Número máximo de membros permitidos',
    'min_contribution': 'Contribuição mínima por ciclo',
    'interest_rate': 'Taxa de juros em empréstimos',
    'payment_deadline': 'Prazo máximo para pagamento',
  };
  return hints[rule.code] || '';
};

const getRuleInfo = (rule: any): string => {
  const infos: Record<string, string> = {
    'max_members': 'Limite máximo de participantes no grupo',
    'min_contribution': 'Valor mínimo que cada membro deve contribuir',
    'interest_rate': 'Percentual de juros aplicado aos empréstimos',
    'payment_deadline': 'Dias disponíveis para realizar o pagamento',
  };
  return infos[rule.code] || '';
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
.settings-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.settings-page {
  position: relative;
  min-height: 100vh;
  padding: 0;
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
  background: linear-gradient(135deg, $primary 0%, #7c3aed 100%);
  color: white;
  padding: 40px;
  position: relative;
  overflow: hidden;
  animation: slideInDown 0.8s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 8s ease-in-out infinite;
  }

  .header-content {
    position: relative;
    z-index: 2;
  }

  .header-top {
    display: flex;
    align-items: center;

    .back-btn {
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .header-text {
      flex: 1;
      margin-left: 20px;

      .header-title {
        font-size: 28px;
        font-weight: 700;
        margin: 0;
      }

      .header-subtitle {
        font-size: 14px;
        opacity: 0.8;
        margin: 8px 0 0 0;
      }
    }
  }

  .header-avatar {
    .avatar-shadow {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

// ============== CONTENT ==============
.content-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
  animation: fadeIn 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 0 16px 32px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// ============== LOADING ==============
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

// ============== SECTION HEADER ==============
.section-header {
  animation: slideInUp 0.6s ease-out;

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: $dark;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-subtitle {
    font-size: 14px;
    color: #6b7280;
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

// ============== RULES CONTAINER ==============
.rules-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.5s ease-out;
}

// ============== RULE CARD ==============
.rule-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  animation: slideInCard 0.5s ease-out;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($primary, 0.2);
    box-shadow: 0 15px 40px rgba($primary, 0.1);
  }

  .rule-content {
    padding: 24px;
  }

  .rule-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;

    .rule-info {
      flex: 1;

      .rule-name {
        font-size: 16px;
        font-weight: 700;
        color: $dark;
      }

      .rule-code {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 4px;
      }

      .rule-description {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
        margin: 0;
      }
    }

    .rule-toggle {
      flex-shrink: 0;
    }
  }

  .rule-input-section {
    animation: slideInUp 0.3s ease-out;

    .rule-input {
      .input-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: $dark;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .input-field {
        :deep(.q-field__control) {
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba($primary, 0.05),
            rgba($secondary, 0.05)
          );
        }

        :deep(.q-field__native),
        :deep(.q-field__input) {
          color: $dark;
          font-weight: 600;

          &::placeholder {
            color: #d1d5db;
          }
        }

        :deep(.q-field__hint) {
          color: #9ca3af;
          font-size: 12px;
        }
      }
    }

    .rule-info-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: rgba($primary, 0.05);
      border: 1px solid rgba($primary, 0.1);
      border-radius: 12px;

      .info-text {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.5;
      }
    }
  }

  .rule-status {
    :deep(.q-badge) {
      font-weight: 600;
      font-size: 11px;
      padding: 6px 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
    font-size: 18px;
    font-weight: 700;
    color: $dark;
    margin: 12px 0;
  }

  .empty-message {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
}

// ============== SAVE SECTION ==============
.save-section {
  animation: slideInUp 0.6s ease-out;
}

.save-card {
  border: 2px solid $success;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba($success, 0.05), rgba($success, 0.02));
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba($success, 0.05);

  .save-title {
    font-size: 16px;
    font-weight: 700;
    color: $dark;
    margin: 0;
  }

  .save-description {
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 0 0;
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .header-section {
    padding: 24px;

    .header-top {
      flex-direction: column;
      align-items: flex-start;

      .header-text {
        margin-left: 0;
        margin-top: 16px;

        .header-title {
          font-size: 22px;
        }
      }
    }

    .header-avatar {
      margin-top: 16px;
    }
  }

  .rule-card {
    .rule-content {
      padding: 16px;
    }

    .rule-header {
      flex-direction: column;
      align-items: flex-start;

      .rule-toggle {
        align-self: flex-start;
      }
    }
  }

  .content-section {
    padding: 0 12px 24px;
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-field__outlined) {
  border-radius: 12px;
}

:deep(.q-field__control) {
  padding: 12px 14px;
  font-size: 14px;
}

:deep(.q-linear-progress) {
  border-radius: 8px;
}

:deep(.q-separator) {
  opacity: 0.1;
}
</style>
