<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  tone?: 'positive' | 'warning' | 'danger' | 'neutral'
}>(), { tone: 'neutral' })
</script>

<template>
  <span class="status-tag" :class="tone"><i></i>{{ label }}</span>
</template>
