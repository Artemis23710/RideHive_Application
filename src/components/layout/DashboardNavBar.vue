<template>
  <header class="dashboard-nav">
    <div class="nav-inner">
      <!-- Logo -->
      <div class="nav-logo">
        <Car class="logo-icon" />
        <span class="logo-text">DriveAway</span>
      </div>

      <!-- Center Nav Links -->
      <nav class="nav-links">
        <a href="#" class="nav-link active">
          <LayoutDashboard class="link-icon" />
          Dashboard
        </a>
        <a href="#" class="nav-link">
          <CalendarDays class="link-icon" />
          Bookings
        </a>
        <a href="#" class="nav-link">
          <MapPin class="link-icon" />
          Explore
        </a>
        <a href="#" class="nav-link">
          <ReceiptText class="link-icon" />
          Payments
        </a>
      </nav>

      <!-- Right Actions -->
      <div class="nav-actions">
        <!-- Notifications -->
        <button class="icon-btn" aria-label="Notifications">
          <Bell class="action-icon" />
          <span class="notif-dot"></span>
        </button>

        <!-- Account -->
        <div class="account-wrapper" @click="toggleAccountMenu" ref="accountRef">
          <button class="account-btn" aria-label="Account">
            <div class="avatar">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Alex"
                class="avatar-img"
              />
              <span class="online-dot"></span>
            </div>
            <div class="account-info">
              <span class="account-name">Alex</span>
              <span class="account-role">Member</span>
            </div>
            <ChevronDown class="chevron" :class="{ rotated: menuOpen }" />
          </button>

          <!-- Dropdown -->
          <transition name="dropdown">
            <div v-if="menuOpen" class="account-dropdown">
              <div class="dropdown-header">
                <img src="https://i.pravatar.cc/150?img=12" alt="Alex" class="dropdown-avatar" />
                <div>
                  <p class="dropdown-name">Alex Johnson</p>
                  <p class="dropdown-email">alex.johnson@email.com</p>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <User class="di-icon" />
                View Account
              </a>
              <a href="#" class="dropdown-item">
                <Settings class="di-icon" />
                Preferences
              </a>
              <a href="#" class="dropdown-item">
                <ShieldCheck class="di-icon" />
                Security
              </a>
              <a href="#" class="dropdown-item">
                <HelpCircle class="di-icon" />
                Help & Support
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-item" @click="handleLogout">
                <LogOut class="di-icon" />
                Log Out
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Car,
  LayoutDashboard,
  CalendarDays,
  MapPin,
  ReceiptText,
  Bell,
  User,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-vue-next'

const menuOpen = ref(false)
const accountRef = ref<HTMLElement | null>(null)

function toggleAccountMenu() {
  menuOpen.value = !menuOpen.value
}

function handleLogout() {
  // Add your logout logic here
  console.log('Logging out...')
}

function handleOutsideClick(e: MouseEvent) {
  if (accountRef.value && !accountRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');

.dashboard-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
  font-family: 'DM Sans', sans-serif;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .dashboard-nav {
    background: #111827;
    border-bottom-color: #1f2937;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
  }
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 22px;
  height: 22px;
  color: #0d9488;
}

.logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0d9488;
  letter-spacing: -0.02em;
}

/* Center Nav */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.15s ease;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-link.active {
  background: #f0fdfa;
  color: #0d9488;
}

.link-icon {
  width: 15px;
  height: 15px;
}

@media (prefers-color-scheme: dark) {
  .nav-link { color: #9ca3af; }
  .nav-link:hover { background: #1f2937; color: #f9fafb; }
  .nav-link.active { background: #134e4a; color: #2dd4bf; }
}

/* Right Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.15s ease;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.action-icon {
  width: 18px;
  height: 18px;
}

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}

@media (prefers-color-scheme: dark) {
  .icon-btn { color: #9ca3af; }
  .icon-btn:hover { background: #1f2937; color: #f9fafb; }
  .notif-dot { border-color: #111827; }
}

/* Account Button */
.account-wrapper {
  position: relative;
}

.account-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.75rem 0.35rem 0.35rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.account-btn:hover {
  border-color: #0d9488;
  background: #f0fdfa;
}

@media (prefers-color-scheme: dark) {
  .account-btn { background: #1f2937; border-color: #374151; }
  .account-btn:hover { border-color: #0d9488; background: #134e4a; }
}

.avatar {
  position: relative;
  width: 30px;
  height: 30px;
}

.avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #fff;
}

@media (prefers-color-scheme: dark) {
  .online-dot { border-color: #1f2937; }
}

.account-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.account-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.account-role {
  font-size: 0.7rem;
  color: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  .account-name { color: #f9fafb; }
}

.chevron {
  width: 14px;
  height: 14px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* Dropdown */
.account-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

@media (prefers-color-scheme: dark) {
  .account-dropdown {
    background: #1f2937;
    border-color: #374151;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  .dropdown-header { background: #111827; }
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
}

.dropdown-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dropdown-email {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .dropdown-name { color: #f9fafb; }
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.25rem 0;
}

@media (prefers-color-scheme: dark) {
  .dropdown-divider { background: #374151; }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.12s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #111827;
}

@media (prefers-color-scheme: dark) {
  .dropdown-item { color: #d1d5db; }
  .dropdown-item:hover { background: #374151; color: #f9fafb; }
}

.di-icon {
  width: 15px;
  height: 15px;
  color: #6b7280;
}

.logout-item {
  color: #dc2626;
}

.logout-item .di-icon {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
  color: #b91c1c;
}

@media (prefers-color-scheme: dark) {
  .logout-item { color: #f87171; }
  .logout-item .di-icon { color: #f87171; }
  .logout-item:hover { background: #450a0a; color: #fca5a5; }
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* Mobile: hide nav links */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .account-info {
    display: none;
  }

  .chevron {
    display: none;
  }
}
</style>