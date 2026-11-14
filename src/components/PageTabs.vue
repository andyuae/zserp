<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; label: string }>
  modelValue: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="page-tabs">
    <button
      v-for="item in items"
      :key="item.id"
      class="tab"
      :class="{ active: modelValue === item.id }"
      @click="$emit('update:modelValue', item.id)"
    >
      <slot name="icon" :item="item" />{{ item.label }}
    </button>
    <slot name="add" />
    <div class="tab-spacer"></div>
    <slot name="tools" />
  </div>
</template>
