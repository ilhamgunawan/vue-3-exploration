<script setup lang="ts">
  import { ref } from 'vue';
  import Dialog from './Dialog.vue';
  import { PRODUCT_STATUSES } from '@/shared/constant';
  import { useProduct } from '@/composables/useProduct';
  import { useEditProduct } from '@/composables/useProductMutation';

  const props = defineProps({
    productId: {
      type: Number,
      required: true,
    },
    onSuccess: {
      type: Function,
      default: () => {},
    },
  })

  console.log({ productId: props.productId })

  const { loading: loadingProduct, fetchData: fetchProduct } = useProduct(props.productId)
  const { error, patch } = useEditProduct(props.productId)

  const nameRef = ref('')
  const statusRef = ref('active')
  const dialog = ref<InstanceType<typeof Dialog>>();

  const onSubmit = () => {
    if (!nameRef.value && !statusRef.value) return

    patch({
      body: {
        name: nameRef.value,
        status: statusRef.value,
      },
      onSuccess: () => {
        dialog?.value?.close()
        props?.onSuccess?.()
      }
    })
  }

  const resetForm = () => {
    nameRef.value = ''
    statusRef.value = 'active'
  }

  const showDialog = () => {
    dialog.value?.show()
    fetchProduct({
      onSuccess: (data) => {
        if (data.name) {
          nameRef.value = data.name
        }

        if (data.status) {
          statusRef.value = data.status
        }
      }
    })
  }
</script>

<template>
  <button v-on:click="showDialog()" type="button">Edit</button>
  <Dialog ref="dialog" v-on:submit="onSubmit()" v-on:close="resetForm()">
    <div>
      <h2>Edit Product</h2>
    </div>
    <div v-if="!!error">
      {{ error }}
    </div>
    <div v-if="loadingProduct">
      Loading product...
    </div>
    <div v-if="!loadingProduct">
      <label>
        Product Name:
        <input type="text" placeholder="e.g. fridge" v-model="nameRef" />
      </label>
    </div>
    <div v-if="!loadingProduct">
      <label>
        Product Status:
        <select v-model="statusRef">
          <option v-for="status in PRODUCT_STATUSES">
            {{ status }}
          </option>
        </select>
      </label>
    </div>
    <div v-if="!loadingProduct">
      <button type="submit" v-bind:disabled="!(nameRef && statusRef)">Save</button>
    </div>
  </Dialog>
</template>
