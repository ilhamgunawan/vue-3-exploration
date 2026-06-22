<script setup lang="ts">
  import { ref, toValue } from 'vue';
  import Dialog from './Dialog.vue';
  import { PRODUCT_STATUSES } from '@/shared/constant';
  import { useAddProduct } from '@/composables/useProductMutation';

  const props = defineProps({
    onSuccess: {
      type: Function,
      default: () => {},
    },
  })
  
  const { error, post } = useAddProduct()

  const nameRef = ref('')
  const statusRef = ref('active')
  const dialog = ref<InstanceType<typeof Dialog>>();

  const onSubmit = () => {
    if (!nameRef.value && !statusRef.value) return

    post({
      body: {
        name: nameRef.value,
        status: statusRef.value,
      },
      onSuccess: () => {
        props?.onSuccess?.()
      },
    })
  }

  const resetForm = () => {
    nameRef.value = ''
    statusRef.value = 'active'
    error.value = null
  }

  const showDialog = () => {
    dialog.value?.show()
  }
</script>

<template>
  <button v-on:click="showDialog()">Add Product</button>
  <Dialog ref="dialog" v-on:submit="onSubmit()" v-on:close="resetForm()">
    <div>
      <h2>Add Product</h2>
    </div>
    <div v-if="!!error">
      {{ error }}
    </div>
    <div>
      <label>
        Product Name:
        <input type="text" placeholder="e.g. fridge" v-model="nameRef" />
      </label>
    </div>
    <div>
      <label>
        Product Status:
        <select v-model="statusRef">
          <option v-for="status in PRODUCT_STATUSES">
            {{ status }}
          </option>
        </select>
      </label>
    </div>
    <div>
      <button type="submit" v-bind:disabled="!(nameRef && statusRef)">Save</button>
    </div>
  </Dialog>
</template>