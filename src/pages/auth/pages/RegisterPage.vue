<template>
  <q-layout class="register-layout">
    <q-page-container>
      <q-page class="register-page">
        <!-- Background Gradient with Animation -->
        <div class="gradient-bg"></div>

        <div class="register-container">
          <!-- Left Side - Benefits & Info -->
          <div class="left-section">
            <div class="benefits-content">
              <!-- Logo/Brand -->
              <div class="brand-logo">
                <div class="logo-icon">
                  <q-icon name="savings" size="64px" />
                </div>
                <h1 class="brand-title">Xitique</h1>
                <p class="brand-subtitle">Sistema de Poupança Coletiva</p>
              </div>

              <!-- Welcome Message -->
              <div class="welcome-box">
                <div class="welcome-icon">
                  <q-icon name="celebration" size="32px" />
                </div>
                <h2 class="welcome-title">Comece Sua Jornada</h2>
                <p class="welcome-text">
                  Registre-se agora e faça parte de uma comunidade de
                  moçambicanos que estão transformando seus sonhos em realidade
                </p>
              </div>

              <!-- Benefits Grid -->
              <div class="benefits-grid">
                <div class="benefit-card">
                  <q-icon name="verified_user" />
                  <h3>100% Seguro</h3>
                  <p>Seus dados protegidos com encriptação de nível bancário</p>
                </div>

                <div class="benefit-card">
                  <q-icon name="volunteer_activism" />
                  <h3>Comunidade</h3>
                  <p>Conectado com milhares de moçambicanos</p>
                </div>

                <div class="benefit-card">
                  <q-icon name="trending_up" />
                  <h3>Crescimento</h3>
                  <p>Realize seus sonhos através da poupança organizada</p>
                </div>
              </div>

              <!-- Trust Indicators -->
              <div class="trust-section">
                <p class="trust-title">Já Confiam em Nós</p>
                <div class="trust-stats">
                  <div class="stat">
                    <span class="stat-number">5000+</span>
                    <span class="stat-label">Usuários</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">50M+</span>
                    <span class="stat-label">MT Poupado</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Registration Form -->
          <div class="right-section">
            <div class="form-wrapper">
              <!-- Form Header -->
              <div class="form-header">
                <h2 class="form-title">Criar Conta</h2>
                <p class="form-subtitle">
                  Rápido e Seguro - Leva menos de 1 minuto
                </p>
              </div>

              <!-- Registration Card -->
              <q-card class="register-card">
                <q-card-section class="q-pa-lg">
                  <!-- Full Name -->
                  <div class="input-group">
                    <label class="input-label">Nome Completo</label>
                    <q-input
                      v-model="form.fullName"
                      placeholder="João Pedro Silva"
                      outlined
                      dense
                      prefix-icon="person"
                      class="form-input"
                      @keyup.enter="handleRegister"
                      :rules="[
                        (val) =>
                          (val && val.trim().length > 0) ||
                          'Nome é obrigatório',
                        (val) =>
                          (val && val.trim().split(' ').length >= 2) ||
                          'Insira seu nome completo (nome + sobrenome)',
                      ]"
                    />
                  </div>

                  <!-- Phone Number -->
                  <div class="input-group q-mt-md">
                    <label class="input-label">Número de Telefone</label>
                    <div class="phone-input-wrapper">
                      <span class="phone-prefix">+258</span>
                      <q-input
                        v-model="form.phone"
                        placeholder="84 123 4567"
                        outlined
                        dense
                        type="tel"
                        class="phone-input"
                        prefix-icon="phone"
                        @keyup.enter="handleRegister"
                        :rules="[
                          (val) =>
                            (val && val.trim().length > 0) ||
                            'Telefone é obrigatório',
                          (val) =>
                            (val && val.length >= 9) ||
                            'Número deve ter pelo menos 9 dígitos',
                        ]"
                      />
                    </div>
                    <p class="input-hint">📱 Vodacom, Mcel ou TMcel</p>
                  </div>

                  <!-- Password -->
                  <div class="input-group q-mt-md">
                    <label class="input-label">Senha</label>
                    <q-input
                      v-model="form.password"
                      placeholder="Mínimo 8 caracteres"
                      outlined
                      dense
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input"
                      prefix-icon="lock"
                      @keyup.enter="handleRegister"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="showPassword ? 'visibility' : 'visibility_off'"
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </q-input>
                    <div class="password-strength q-mt-xs">
                      <div
                        class="strength-bar"
                        :style="{ width: passwordStrength + '%' }"
                        :class="'strength-' + passwordLevel"
                      ></div>
                    </div>
                    <p class="input-hint">
                      {{
                        form.password.length === 0
                          ? 'Mínimo 8 caracteres'
                          : `Força: ${passwordLevel}`
                      }}
                    </p>
                  </div>

                  <!-- Terms & Conditions -->
                  <div class="terms-section q-mt-md">
                    <q-checkbox
                      v-model="form.agreeTerms"
                      class="terms-checkbox"
                    >
                      <template v-slot:default>
                        <span class="terms-text">
                          Li e concordo com os
                          <a href="#" class="terms-link">Termos de Serviço</a>
                          e
                          <a href="#" class="terms-link"
                            >Política de Privacidade</a
                          >
                        </span>
                      </template>
                    </q-checkbox>
                  </div>

                  <!-- Register Button -->
                  <q-btn
                    label="Criar Conta"
                    color="primary"
                    :loading="loading"
                    :disable="!isFormValid"
                    @click="handleRegister"
                    class="register-btn q-mt-lg full-width"
                    size="lg"
                    no-caps
                    unelevated
                  />

                  <!-- Loading Message -->
                  <div v-if="loading" class="loading-message q-mt-md">
                    <q-spinner size="24px" color="primary" />
                    <span class="q-ml-md">Criando sua conta...</span>
                  </div>

                  <!-- Error Message -->
                  <q-banner
                    v-if="errorMessage"
                    class="error-banner q-mt-md"
                    dense
                  >
                    <template v-slot:avatar>
                      <q-icon name="error" color="negative" />
                    </template>
                    {{ errorMessage }}
                    <template v-slot:action>
                      <q-icon
                        name="close"
                        size="sm"
                        class="cursor-pointer"
                        @click="errorMessage = ''"
                      />
                    </template>
                  </q-banner>

                  <!-- Success Message -->
                  <q-banner
                    v-if="successMessage"
                    class="success-banner q-mt-md"
                    dense
                  >
                    <template v-slot:avatar>
                      <q-icon name="check_circle" color="positive" />
                    </template>
                    {{ successMessage }}
                  </q-banner>
                </q-card-section>
              </q-card>

              <!-- Login Link -->
              <div class="login-section q-mt-lg">
                <p class="login-text">
                  Já tem conta?
                  <router-link to="/login" class="login-link">
                    Entre aqui
                  </router-link>
                </p>
              </div>

              <!-- Security Info -->
              <div class="security-info q-mt-xl">
                <p class="security-text">
                  🔒 Seus dados estão 100% protegidos com encriptação
                </p>
              </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';

// Router & Store
const router = useRouter();
const auth = useAuthStore();

// Form State
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const form = ref({
  fullName: '',
  phone: '',
  password: '',
  agreeTerms: false,
});

// Password Strength Calculation
const passwordStrength = computed(() => {
  let strength = 0;
  const pwd = form.value.password;

  if (pwd.length >= 8) strength += 25;
  if (pwd.length >= 12) strength += 25;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
  if (/[0-9]/.test(pwd)) strength += 12.5;
  if (/[!@#$%^&*]/.test(pwd)) strength += 12.5;

  return Math.min(strength, 100);
});

const passwordLevel = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'fraco';
  if (strength < 70) return 'medio';
  return 'forte';
});

// Form Validation
const isFormValid = computed(() => {
  const hasValidName =
    form.value.fullName.trim().length > 0 &&
    form.value.fullName.trim().split(' ').length >= 2;

  const hasValidPhone = form.value.phone.trim().length >= 9;

  const hasValidPassword = form.value.password.length >= 8;

  const hasAgreedTerms = form.value.agreeTerms;

  return hasValidName && hasValidPhone && hasValidPassword && hasAgreedTerms;
});

// Methods
const handleRegister = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, preencha todos os campos corretamente';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // Format phone number: remove spaces and special chars
    const formattedPhone = form.value.phone.replace(/\D/g, '');

    // Call auth store register method
    await auth.register({
      fullName: form.value.fullName,
      phone: formattedPhone,
      password: form.value.password,
    });

    successMessage.value =
      'Conta criada com sucesso! Redirecionando para veficacao...';

    if (auth.nextStep === 'VERIFY_OTP') {
      router.push('/account-verify');
    } else if (auth.nextStep === 'LOGIN') {
      router.push({ name: 'login' });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMessage.value =
      error.message || 'Erro ao criar conta. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
// ============== VARIABLES ==============
$primary: #5b72ff;
$primary-light: #f0f2ff;
$secondary: #00d9ff;
$success: #10b981;
$danger: #ef4444;
$dark: #1f2937;
$light: #f9fafb;
$border: #e5e7eb;

// ============== LAYOUT ==============
.register-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
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
  opacity: 0.3;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, $primary, $secondary);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, $secondary, $primary);
  bottom: 100px;
  right: -50px;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, $primary, #a78bfa);
  bottom: 20%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
}

// ============== CONTAINER ==============
.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

// ============== LEFT SECTION ==============
.left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 0;
    text-align: center;
  }
}

.benefits-content {
  animation: slideInLeft 0.8s ease-out;
}

// Brand
.brand-logo {
  margin-bottom: 40px;

  .logo-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $primary, $secondary);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba($primary, 0.2);

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
    }
  }

  .brand-title {
    font-size: 42px;
    font-weight: 700;
    color: $dark;
    margin: 0;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  .brand-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 8px 0 0 0;
    font-weight: 500;
  }
}

// Welcome Box
.welcome-box {
  background: linear-gradient(
    135deg,
    rgba($primary, 0.08),
    rgba($secondary, 0.08)
  );
  border: 1px solid rgba($primary, 0.15);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);

  .welcome-icon {
    color: $primary;
    margin-bottom: 15px;
  }

  .welcome-title {
    font-size: 20px;
    font-weight: 600;
    color: $dark;
    margin: 0 0 10px 0;
  }

  .welcome-text {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

// Benefits Grid
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  .benefit-card {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid $border;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba($primary, 0.3);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    }

    i {
      color: $primary;
      font-size: 32px;
      margin-bottom: 10px;
    }

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: $dark;
      margin: 0;
    }

    p {
      font-size: 12px;
      color: #9ca3af;
      margin: 6px 0 0 0;
    }
  }
}

// Trust Section
.trust-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid rgba($primary, 0.1);

  .trust-title {
    font-size: 14px;
    font-weight: 600;
    color: $dark;
    text-align: center;
    margin: 0 0 20px 0;
  }

  .trust-stats {
    display: flex;
    justify-content: space-around;

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-number {
        font-size: 18px;
        font-weight: 700;
        color: $primary;
      }

      .stat-label {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 4px;
      }
    }
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ============== RIGHT SECTION ==============
.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: slideInRight 0.8s ease-out;

  @media (max-width: 768px) {
    animation: slideInUp 0.8s ease-out;
  }
}

.form-wrapper {
  width: 100%;
}

// Form Header
.form-header {
  margin-bottom: 30px;

  .form-title {
    font-size: 28px;
    font-weight: 700;
    color: $dark;
    margin: 0 0 8px 0;
  }

  .form-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

// Register Card
.register-card {
  border: 1px solid $border;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 60px rgba(91, 114, 255, 0.1);
    border-color: rgba($primary, 0.2);
  }
}

// Input Groups
.input-group {
  margin-bottom: 20px;

  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: $dark;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-hint {
    font-size: 12px;
    color: #9ca3af;
    margin: 6px 0 0 0;
    font-weight: 500;
  }
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;

  .phone-prefix {
    position: absolute;
    left: 12px;
    font-weight: 600;
    color: $dark;
    font-size: 14px;
  }

  .phone-input {
    flex: 1;

    :deep(.q-field__control) {
      padding-left: 50px;
    }
  }
}

// Password Strength
.password-strength {
  height: 4px;
  background: $light;
  border-radius: 2px;
  overflow: hidden;

  .strength-bar {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;

    &.strength-fraco {
      background: $danger;
    }

    &.strength-medio {
      background: #f59e0b;
    }

    &.strength-forte {
      background: $success;
    }
  }
}

// Terms Section
.terms-section {
  :deep(.q-checkbox__label) {
    font-size: 13px;
    color: #6b7280;
  }

  .terms-text {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;

    .terms-link {
      color: $primary;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Register Button
.register-btn {
  background: linear-gradient(135deg, $primary, #4f5ae4);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba($primary, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba($primary, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
  }
}

// Messages
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  font-weight: 600;
}

.error-banner {
  background: linear-gradient(135deg, rgba($danger, 0.1), rgba($danger, 0.05));
  border: 1px solid rgba($danger, 0.2);
  border-radius: 12px;
  color: #7f1d1d;

  :deep(.q-banner__content) {
    font-weight: 500;
    font-size: 13px;
  }
}

.success-banner {
  background: linear-gradient(
    135deg,
    rgba($success, 0.1),
    rgba($success, 0.05)
  );
  border: 1px solid rgba($success, 0.2);
  border-radius: 12px;
  color: #065f46;

  :deep(.q-banner__content) {
    font-weight: 500;
    font-size: 13px;
  }
}

// Navigation Links
.login-section {
  text-align: center;

  .login-text {
    font-size: 14px;
    color: #6b7280;
    margin: 0;

    .login-link {
      color: $primary;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;

      &:hover {
        color: $secondary;
        text-decoration: underline;
      }
    }
  }
}

.security-info {
  text-align: center;

  .security-text {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
    font-weight: 500;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============== QUASAR OVERRIDES ==============
:deep(.q-field__outlined) {
  border-radius: 12px;
}

:deep(.q-field__control) {
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: $dark;

  &::placeholder {
    color: #d1d5db;
  }
}

:deep(.q-field__label) {
  color: #9ca3af;
}

:deep(.q-field--outlined.q-field--focused .q-field__control::before) {
  border-color: $primary;
  box-shadow: 0 0 0 3px rgba($primary, 0.1);
}

:deep(.q-field--outlined .q-field__control::before) {
  border-color: $border;
  transition: all 0.3s ease;
}

:deep(.q-field--outlined .q-field__control:hover::before) {
  border-color: rgba($primary, 0.3);
}

:deep(.q-checkbox__bg) {
  border-radius: 6px;
}
</style>
