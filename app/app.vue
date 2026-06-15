<template>
  <NuxtPage />
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #A8A29E; }

/* Global keyframes */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes checkPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.animate-fade-up    { animation: fadeUp    0.35s ease both; }
.animate-fade-in    { animation: fadeIn    0.3s ease both; }
.animate-scale-in   { animation: scaleIn   0.25s ease both; }
.animate-slide-left { animation: slideInLeft 0.3s ease both; }
.animate-check-pop  { animation: checkPop  0.3s ease; }

/* Stagger delays untuk list items */
.stagger-1  { animation-delay: 0.04s; }
.stagger-2  { animation-delay: 0.08s; }
.stagger-3  { animation-delay: 0.12s; }
.stagger-4  { animation-delay: 0.16s; }
.stagger-5  { animation-delay: 0.20s; }

/* List transition */
.list-enter-active { transition: all 0.3s ease; }
.list-leave-active { transition: all 0.25s ease; }
.list-enter-from   { opacity: 0; transform: translateY(10px); }
.list-leave-to     { opacity: 0; transform: translateX(20px); }
.list-leave-active { position: absolute; width: 100%; }

/* Modal transition */
.modal-enter-active { transition: all 0.25s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.modal-inner-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-inner-leave-active { transition: all 0.2s ease; }
.modal-inner-enter-from, .modal-inner-leave-to { opacity: 0; transform: scale(0.92); }
</style>
