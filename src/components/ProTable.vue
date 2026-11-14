<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  data: Record<string, unknown>[]
  height?: number | string
}>(), { height: 360 })
</script>

<template>
  <vxe-table v-bind="$attrs" :data="data" :height="height">
    <slot />
  </vxe-table>
</template>
