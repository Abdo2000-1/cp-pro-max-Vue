<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, Lock, Eye, EyeOff, Activity, Star } from 'lucide-vue-next';
import { sound } from '@/utils/sound';

const router = useRouter();
const email = ref('jessica.ruiz@dentalab.com');
const password = ref('••••••••••');
const showPassword = ref(false);
const isLoading = ref(false);

function handleLogin() {
  isLoading.value = true;
  sound.click();
  
  setTimeout(() => {
    localStorage.setItem('dentalab-auth', 'true');
    sound.pop();
    router.push('/dashboard');
  }, 900);
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-[#060911] text-slate-900 dark:text-slate-100 font-sans">
    <!-- Left Panel - Hidden on mobile -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white overflow-hidden">
      <!-- Background Image with Gradient Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1562330743-fbc6ef07ca78?w=1200&h=1600&fit=crop&auto=format&q=80" 
          alt="Dental Lab" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/85 to-emerald-950/40 mix-blend-multiply" />
      </div>

      <div class="relative z-10 flex flex-col justify-between w-full p-12 h-full">
        <!-- Logo & Tagline -->
        <div>
          <div class="flex items-center space-x-3 text-2xl font-extrabold mb-4 text-white">
            <Activity class="w-8 h-8 text-emerald-400" />
            <span>DentaLab <span class="text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">Vue 3 Edition</span></span>
          </div>
          <p class="text-xl font-light text-emerald-100 max-w-md">
            From scan to delivery — reactive dental lab operating system powered by Vue 3 & Pinia
          </p>
        </div>

        <!-- Testimonial & Stats -->
        <div class="space-y-8">
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div class="flex text-amber-400 mb-3">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
            </div>
            <p class="text-lg italic mb-4 text-white/90">
              "DentaLab's Vue 3 platform has completely transformed our workflow. 
              We've reduced turnaround times by 30% and eliminated communication errors."
            </p>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
                AP
              </div>
              <div>
                <div class="font-semibold text-white">Dr. Allison Park</div>
                <div class="text-sm text-emerald-200">Park Dental Associates</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="bg-slate-950/60 backdrop-blur rounded-xl p-4 border border-emerald-500/20">
              <div class="text-2xl font-bold text-white mb-1">1,200+</div>
              <div class="text-xs text-emerald-200 uppercase tracking-wider font-mono">Orders/month</div>
            </div>
            <div class="bg-slate-950/60 backdrop-blur rounded-xl p-4 border border-emerald-500/20">
              <div class="text-2xl font-bold text-white mb-1">98%</div>
              <div class="text-xs text-emerald-200 uppercase tracking-wider font-mono">On-time delivery</div>
            </div>
            <div class="bg-slate-950/60 backdrop-blur rounded-xl p-4 border border-emerald-500/20">
              <div class="text-2xl font-bold text-white mb-1">50+</div>
              <div class="text-xs text-emerald-200 uppercase tracking-wider font-mono">Partner clinics</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-24 bg-white dark:bg-[#0b1120] relative transition-colors duration-200">
      <div class="max-w-md w-full mx-auto">
        <!-- Mobile Logo -->
        <div class="flex lg:hidden items-center space-x-2 text-2xl font-bold mb-12 text-slate-900 dark:text-white">
          <Activity class="w-8 h-8 text-emerald-500" />
          <span>DentaLab <span class="text-xs text-emerald-500 font-mono">Vue 3</span></span>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome back</h1>
          <p class="text-slate-500 dark:text-slate-400">Sign in to manage your orders and dental lab workflow.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" for="email">
              Email address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
                v-model="email"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300" for="password">
                Password
              </label>
              <a href="#" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
                v-model="password"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                <Eye v-else class="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 rounded cursor-pointer"
              checked
            />
            <label htmlFor="remember-me" class="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 rounded-xl shadow-md shadow-emerald-500/20 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all disabled:opacity-70 cursor-pointer"
            >
              <div v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>
        
        <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            By signing in, you agree to our 
            <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a>
            and 
            <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <!-- Footer Version -->
      <div class="absolute bottom-6 w-full text-center left-0 text-xs text-slate-400 font-mono">
        DentaLab OS v3.0 • Vue 3 & TypeScript Engine
      </div>
    </div>
  </div>
</template>
