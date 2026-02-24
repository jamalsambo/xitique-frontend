<template>
  <q-layout class="login-layout">
    <q-page-container>
      <q-page class="login-page">
        <!-- Background Gradient with Animation -->
        <div class="gradient-bg"></div>

        <div class="login-container">
          <!-- Left Side - Branding & Message -->
          <div class="left-section">
            <div class="brand-content">
              <!-- Logo/Brand -->
              <div class="brand-logo">
                <div class="logo-icon">
                  <q-icon name="savings" size="64px" />
                </div>
                <h1 class="brand-title">Xitique</h1>
                <p class="brand-subtitle">Sistema de Poupança Coletiva</p>
              </div>

              <!-- Motivational Message -->
              <div class="message-box">
                <div class="message-icon">
                  <q-icon name="trending_up" size="32px" />
                </div>
                <h2 class="message-title">Realize seus Sonhos</h2>
                <p class="message-text">
                  Junte-se a milhares de moçambicanos que estão transformando
                  suas vidas através da poupança coletiva
                </p>
              </div>

              <!-- Features -->
              <div class="features-list">
                <div class="feature-item">
                  <q-icon name="security" />
                  <span>Seguro e Confiável</span>
                </div>
                <div class="feature-item">
                  <q-icon name="people" />
                  <span>Comunidade Forte</span>
                </div>
                <div class="feature-item">
                  <q-icon name="flash_on" />
                  <span>Rápido e Fácil</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Login Form -->
          <div class="right-section">
            <div class="form-wrapper">
              <!-- Header -->
              <div class="form-header">
                <h2 class="form-title">Bem-vindo de Volta</h2>
                <p class="form-subtitle">Entre com sua conta para continuar</p>
              </div>

              <!-- Form Card -->
              <q-card class="login-card">
                <q-card-section class="q-pa-lg">
                  <!-- Phone Input -->
                  <div class="input-group">
                    <label class="input-label">Número de Telefone</label>
                    <div class="phone-input-wrapper">
                      <span class="phone-prefix">+258</span>
                      <q-input
                        v-model="phone"
                        placeholder="84 123 4567"
                        outlined
                        dense
                        type="tel"
                        class="phone-input"
                        prefix-icon="phone"
                        :rules="[
                          (val) =>
                            (val && val.trim().length > 0) ||
                            'Número de telefone é obrigatório',
                          (val) =>
                            (val && val.length >= 9) ||
                            'Número deve ter pelo menos 9 dígitos',
                        ]"
                        @keyup.enter="handleLogin"
                      />
                    </div>
                    <p class="input-hint">
                      📱 Utilize seu número Vodacom, Mcel ou TMcel
                    </p>
                  </div>

                  <!-- Password Input -->
                  <div class="input-group q-mt-md">
                    <label class="input-label">Senha</label>
                    <q-input
                      v-model="password"
                      placeholder="Insira sua senha"
                      outlined
                      dense
                      :type="showPassword ? 'text' : 'password'"
                      class="password-input"
                      prefix-icon="lock"
                      @keyup.enter="handleLogin"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="
                            showPassword ? 'visibility' : 'visibility_off'
                          "
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </q-input>
                  </div>

                  <!-- Remember & Forgot Password -->
                  <div class="form-options q-mt-md">
                    <q-checkbox
                      v-model="rememberMe"
                      label="Lembrar-me"
                      class="remember-checkbox"
                    />
                    <a href="/forgot-password" class="forgot-password">Esqueceu a senha?</a>
                  </div>

                  <!-- Login Button -->
                  <q-btn
                    label="Entrar"
                    color="primary"
                    :loading="auth.loading"
                    :disable="!isFormValid"
                    @click="handleLogin"
                    class="login-btn q-mt-lg full-width"
                    size="lg"
                    no-caps
                    unelevated
                  />

                  <!-- Loading State Message -->
                  <div v-if="auth.loading" class="loading-message q-mt-md">
                    <q-spinner size="24px" color="primary" />
                    <span class="q-ml-md">Autenticando sua conta...</span>
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
                </q-card-section>
              </q-card>

              <!-- Sign Up Link -->
              <div class="signup-section q-mt-lg">
                <p class="signup-text">
                  Não tem conta?
                  <router-link to="/register" class="signup-link">
                    Registre-se aqui
                  </router-link>
                </p>
              </div>

              <!-- Footer Info -->
              <div class="footer-info q-mt-xl">
                <p class="footer-text">
                  ✓ Todos os seus dados estão protegidos com encriptação
                  avançada
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Orbs for Decoration -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores';
import { useRouter } from 'vue-router';

const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const errorMessage = ref('');
const auth = useAuthStore();
const router = useRouter();

const isFormValid = computed(() => {
  return phone.value.trim().length >= 9 && password.value.length > 0;
});

const handleLogin = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, preencha todos os campos corretamente';
    return;
  }

  try {
    errorMessage.value = '';
    // Format phone number: remove spaces and special chars
    const formattedPhone = phone.value.replace(/\D/g, '');
    await auth.login(formattedPhone, password.value);
    router.replace('/');
  } catch (error) {
    errorMessage.value =
      'Telefone ou senha inválidos. Por favor, tente novamente.';
    console.error('Login error:', error);
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
.login-layout {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  min-height: 100vh;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

// ============== BACKGROUND GRADIENT ==============
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

// ============== FLOATING ORBS ==============
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

// ============== MAIN CONTAINER ==============
.login-container {
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

.brand-content {
  animation: slideInLeft 0.8s ease-out;
}

// Brand Logo
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

// Message Box
.message-box {
  background: linear-gradient(135deg, rgba($primary, 0.08), rgba($secondary, 0.08));
  border: 1px solid rgba($primary, 0.15);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);

  .message-icon {
    color: $primary;
    margin-bottom: 15px;
  }

  .message-title {
    font-size: 20px;
    font-weight: 600;
    color: $dark;
    margin: 0 0 10px 0;
  }

  .message-text {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

// Features List
.features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;

    i {
      color: $success;
      font-size: 20px;
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

// Login Card
.login-card {
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

// Input Group
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

// Phone Input
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
  }

  .phone-input :deep(.q-field__control) {
    padding-left: 50px;
  }
}

// Form Options
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .remember-checkbox {
    font-size: 13px;

    :deep(.q-checkbox__label) {
      color: #6b7280;
    }
  }

  .forgot-password {
    font-size: 13px;
    color: $primary;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: darken($primary, 10%);
      text-decoration: underline;
    }
  }
}

// Login Button
.login-btn {
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

// Loading Message
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  font-weight: 600;
}

// Error Banner
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

// Sign Up Section
.signup-section {
  text-align: center;

  .signup-text {
    font-size: 14px;
    color: #6b7280;
    margin: 0;

    .signup-link {
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

// Footer Info
.footer-info {
  text-align: center;

  .footer-text {
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

:deep(.q-checkbox__inner) {
  font-size: 14px;
}
</style>
