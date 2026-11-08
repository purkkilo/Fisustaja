<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="15" fill="#2A74A0" />
    <path d="M8 16c3-4 9-5 13-2l3-2v8l-3-2c-4 3-10 2-13-2z" fill="#FFFFFF" />
    <circle cx="18.5" cy="15" r="1" fill="#0F2A3C" />
  </svg>
</template>

<script setup>
defineProps({ size: { type: [Number, String], default: 34 } });
</script>
