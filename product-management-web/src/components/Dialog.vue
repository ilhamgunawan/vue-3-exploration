<script setup lang="ts">
import { ref } from 'vue';

const dialog = ref<HTMLDialogElement>();

const props = defineProps({
  classes: {
    type: String,
    default: "",
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
  onClose: {
    type: Function,
    default: () => {},
  },
});

const visible = ref(false);

const showModal = () => {
  dialog.value?.showModal();
  visible.value = true;
};

const closeDialog = () => {
  dialog.value?.close();
  visible.value = false;
  props.onClose();
}

defineExpose({
  show: showModal,
  close: (returnVal?: string): void => dialog.value?.close(returnVal),
  visible,
});
</script>

<template>
  <dialog
    ref="dialog"
    @close="visible = false"
  >
    <form
      v-if="visible"
      method="dialog"
      :class="{
        [props.classes]: props.classes,
      }"
      v-on:submit="(event) => {
        event.preventDefault()
        event.stopPropagation()
        props.onSubmit()
      }"
    >
      <slot />
      <button v-on:click="closeDialog()">Cancel</button>
    </form>
  </dialog>
</template>
