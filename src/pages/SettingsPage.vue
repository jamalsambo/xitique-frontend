<template>
  <q-layout class="settings-layout">
    <q-page-container>
      <q-page class="settings-page q-pa-lg">
        <!-- Background Gradient -->
        <div class="gradient-bg"></div>

        <!-- Header Section -->
        <div class="header-section q-mb-xl" style="position: relative; z-index: 10">
          <h1 class="page-title">Configurações</h1>
          <p class="page-subtitle">Gerencie suas preferências e conta</p>
        </div>

        <!-- Content -->
        <div class="content-section" style="position: relative; z-index: 10">
          <!-- Profile Card -->
          <q-card class="profile-card q-mb-lg">
            <q-card-section class="q-pa-lg">
              <div class="profile-header">
                <q-avatar
                  size="80px"
                  rounded
                  class="profile-avatar avatar-shadow"
                >
                  <img src="https://cdn.quasar.dev/img/avatar.png" />
                  <q-menu context-menu>
                    <q-list dense style="min-width: 200px">
                      <q-item clickable v-close-popup>
                        <q-item-section>Mudar Foto</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Remover Foto</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-avatar>

                <div class="profile-info">
                  <h3 class="profile-name">Mário dos Santos</h3>
                  <p class="profile-email">mario.santos@email.com</p>
                  <div class="profile-status">
                    <q-icon name="verified_user" color="positive" size="sm" />
                    <span>Conta Verificada</span>
                  </div>
                </div>

                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  class="edit-btn"
                  size="lg"
                />
              </div>

              <!-- Profile Stats -->
              <div class="profile-stats q-mt-lg">
                <div class="stat-item">
                  <span class="stat-label">Membro desde</span>
                  <span class="stat-value">Janeiro 2024</span>
                </div>
                <q-separator vertical />
                <div class="stat-item">
                  <span class="stat-label">Status</span>
                  <span class="stat-value">Ativo</span>
                </div>
                <q-separator vertical />
                <div class="stat-item">
                  <span class="stat-label">Segurança</span>
                  <span class="stat-value">Alta</span>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Preferences Section -->
          <div class="section-header q-mb-md">
            <h3 class="section-title">Preferências</h3>
          </div>

          <q-card class="settings-card q-mb-lg">
            <!-- Notifications -->
            <q-item
              class="settings-item"
              @click="expandedItem = expandedItem === 'notifications' ? null : 'notifications'"
            >
              <q-item-section avatar>
                <q-avatar
                  rounded
                  color="blue-1"
                  text-color="primary"
                  icon="notifications"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="item-title">Notificações</q-item-label>
                <q-item-label caption class="item-description">
                  {{ notif ? 'Ativadas' : 'Desativadas' }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-toggle
                  v-model="notif"
                  color="primary"
                  size="lg"
                  @click.stop
                />
              </q-item-section>
            </q-item>

            <!-- Notifications Expansion -->
            <q-slide-transition>
              <div v-if="expandedItem === 'notifications'" class="expansion-content">
                <q-separator />
                <div class="q-pa-md">
                  <div class="notification-options">
                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Notificações por Email</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="notifEmail" color="primary" />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Notificações Push</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="notifPush" color="primary" />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Notificações SMS</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="notifSms" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </q-slide-transition>

            <q-separator inset="item" />

            <!-- Security -->
            <q-item
              class="settings-item"
              @click="expandedItem = expandedItem === 'security' ? null : 'security'"
            >
              <q-item-section avatar>
                <q-avatar
                  rounded
                  color="green-1"
                  text-color="positive"
                  icon="security"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="item-title">Segurança e PIN</q-item-label>
                <q-item-label caption class="item-description">
                  Proteja sua conta
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="chevron_right"
                  :class="{ 'rotate-icon': expandedItem === 'security' }"
                  class="chevron-icon"
                />
              </q-item-section>
            </q-item>

            <!-- Security Expansion -->
            <q-slide-transition>
              <div v-if="expandedItem === 'security'" class="expansion-content">
                <q-separator />
                <div class="q-pa-md">
                  <div class="security-options">
                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Alterar Senha</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Definir PIN</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Autenticação Biométrica</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="biometric" color="primary" />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Verificação em 2 Fatores</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="twoFactor" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </q-slide-transition>

            <q-separator inset="item" />

            <!-- Help & Support -->
            <q-item
              class="settings-item"
              @click="expandedItem = expandedItem === 'help' ? null : 'help'"
            >
              <q-item-section avatar>
                <q-avatar
                  rounded
                  color="orange-1"
                  text-color="orange-9"
                  icon="help_outline"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="item-title">Ajuda e Suporte</q-item-label>
                <q-item-label caption class="item-description">
                  Tire suas dúvidas
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="chevron_right"
                  :class="{ 'rotate-icon': expandedItem === 'help' }"
                  class="chevron-icon"
                />
              </q-item-section>
            </q-item>

            <!-- Help Expansion -->
            <q-slide-transition>
              <div v-if="expandedItem === 'help'" class="expansion-content">
                <q-separator />
                <div class="q-pa-md">
                  <div class="help-options">
                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>FAQ</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Contate-nos</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Política de Privacidade</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item class="option-item">
                      <q-item-section>
                        <q-item-label>Termos de Serviço</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          icon="arrow_forward"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </q-slide-transition>
          </q-card>

          <!-- Danger Zone -->
          <div class="section-header q-mb-md">
            <h3 class="section-title danger-title">Zona de Perigo</h3>
          </div>

          <q-card class="danger-card">
            <!-- Logout -->
            <q-item
              class="logout-item"
              clickable
            >
              <q-item-section avatar>
                <q-avatar
                  rounded
                  color="red-1"
                  text-color="danger"
                  icon="logout"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="logout-title">Terminar Sessão</q-item-label>
                <q-item-label caption class="logout-description">
                  Saia da sua conta atual
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" color="danger" />
              </q-item-section>
            </q-item>

            <q-separator inset="item" />

            <!-- Delete Account -->
            <q-item
              class="delete-item"
              clickable
            >
              <q-item-section avatar>
                <q-avatar
                  rounded
                  color="red-1"
                  text-color="danger"
                  icon="delete"
                  size="md"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="delete-title">Deletar Conta</q-item-label>
                <q-item-label caption class="delete-description">
                  Remover permanentemente sua conta
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" color="danger" />
              </q-item-section>
            </q-item>
          </q-card>

          <!-- App Info -->
          <div class="app-info q-mt-xl">
            <div class="info-box">
              <q-icon name="info" color="primary" size="sm" />
              <span>Versão do App: 1.0.0</span>
            </div>
            <div class="info-box">
              <q-icon name="calendar_today" color="primary" size="sm" />
              <span>Última atualização: 15 de Janeiro de 2026</span>
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
import { ref } from 'vue';

// State
const notif = ref(true);
const notifEmail = ref(true);
const notifPush = ref(true);
const notifSms = ref(false);
const biometric = ref(false);
const twoFactor = ref(false);
const expandedItem = ref<string | null>(null);
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
    margin: 8px 0 0 0;
    font-weight: 500;
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

// ============== CONTENT ==============
.content-section {
  max-width: 800px;
  margin: 0 auto;
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

// ============== PROFILE CARD ==============
.profile-card {
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, $primary 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 20px 50px rgba($primary, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;

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

  .q-card__section {
    position: relative;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 30px 60px rgba($primary, 0.3);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 24px;

    .profile-avatar {
      flex-shrink: 0;
      position: relative;
    }

    .avatar-shadow {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .profile-info {
      flex: 1;

      .profile-name {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }

      .profile-email {
        font-size: 12px;
        opacity: 0.8;
        margin: 4px 0 0 0;
      }

      .profile-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        margin-top: 8px;
        padding: 6px 12px;
        background: rgba(16, 185, 129, 0.2);
        border-radius: 8px;
        width: fit-content;
      }
    }

    .edit-btn {
      flex-shrink: 0;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
    }
  }

  .profile-stats {
    display: flex;
    justify-content: space-around;
    gap: 16px;

    .stat-item {
      flex: 1;
      text-align: center;

      .stat-label {
        font-size: 11px;
        opacity: 0.75;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
        display: block;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        margin-top: 6px;
        display: block;
      }
    }

    :deep(.q-separator--vertical) {
      opacity: 0.2;
    }
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

// ============== SECTION HEADER ==============
.section-header {
  animation: slideInUp 0.6s ease-out;

  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.danger-title {
      color: $danger;
    }
  }
}

// ============== SETTINGS CARD ==============
.settings-card,
.danger-card {
  border: 1px solid $border;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;

  .settings-item,
  .logout-item,
  .delete-item {
    padding: 16px 20px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: linear-gradient(
        135deg,
        rgba($primary, 0.03),
        rgba($secondary, 0.03)
      );
      padding-left: 24px;

      .item-title {
        color: $primary;
      }
    }

    .item-title {
      font-size: 14px;
      font-weight: 700;
      color: $dark;
      transition: color 0.3s ease;
    }

    .item-description {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }
  }

  .logout-item,
  .delete-item {
    &:hover {
      background: linear-gradient(
        135deg,
        rgba($danger, 0.03),
        rgba($danger, 0.01)
      );

      .logout-title,
      .delete-title {
        color: $danger;
      }
    }

    .logout-title,
    .delete-title {
      color: $danger;
    }

    .logout-description,
    .delete-description {
      color: #9ca3af;
    }
  }
}

.chevron-icon {
  transition: transform 0.3s ease;

  &.rotate-icon {
    transform: rotate(90deg);
  }
}

// ============== EXPANSION CONTENT ==============
.expansion-content {
  background: linear-gradient(
    135deg,
    rgba($primary, 0.03),
    rgba($secondary, 0.03)
  );

  .notification-options,
  .security-options,
  .help-options {
    display: flex;
    flex-direction: column;
    gap: 0;

    .option-item {
      padding: 12px 0;
      transition: all 0.3s ease;

      &:hover {
        padding-left: 8px;
      }

      :deep(.q-item__section--side) {
        padding-right: 0;
      }
    }
  }
}

// ============== DANGER CARD ==============
.danger-card {
  border-color: rgba($danger, 0.2);
  background: linear-gradient(
    135deg,
    rgba($danger, 0.03),
    rgba($danger, 0.01)
  );
}

// ============== APP INFO ==============
.app-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  text-align: center;

  .info-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
  }
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .header-section {
    .page-title {
      font-size: 24px;
    }
  }

  .profile-card {
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 16px;

      .profile-info {
        .profile-status {
          margin-left: auto;
          margin-right: auto;
        }
      }

      .edit-btn {
        align-self: flex-end;
      }
    }

    .profile-stats {
      flex-wrap: wrap;

      :deep(.q-separator--vertical) {
        display: none;
      }
    }
  }

  .settings-card,
  .danger-card {
    .settings-item,
    .logout-item,
    .delete-item {
      padding: 12px 16px;

      &:hover {
        padding-left: 16px;
      }
    }
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-card__section) {
  padding: 24px;
}

:deep(.q-item) {
  padding: 0;

  &:hover {
    background: transparent;
  }
}

:deep(.q-separator) {
  opacity: 0.1;
}

:deep(.q-avatar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.q-toggle__thumb) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
