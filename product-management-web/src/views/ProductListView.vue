<script setup lang="ts">
  import AddProductDialog from '@/components/AddProductDialog.vue';
  import EditProductDialog from '@/components/EditProductDialog.vue';
  import { useProducts } from '@/composables/useProducts';
  import { PAGE_SIZES } from '@/shared/constant';

  const { data, loading, currentPageSize, changePageSize, fetchNextPage, fetchPrevPage, refetch } = useProducts();
</script>

<template>
  <h1>Product List</h1>
  <hr/>
  <AddProductDialog v-on:success="refetch()" />
  <div v-if="loading">Loading products...</div>
  <div v-else-if="!loading && !data?.products?.length">
    No product found for the current filter.
  </div>
  <div v-else-if="!loading && data?.products?.length">
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in data.products">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.status }}</td>
          <td>{{ product.created_at }}</td>
          <td>{{ product.updated_at ?? "-" }}</td>
          <td>
            <EditProductDialog v-on:success="refetch()" v-bind:product-id="product.id" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <div>
      <span>Showing</span>
      <select
        v-on:change="(e) => {
          const value = (e.target as any).value
          changePageSize(parseInt(value))
        }"
        v-bind:value="currentPageSize"
      >
        <option v-for="pageSize in PAGE_SIZES" :value="pageSize">
          {{ pageSize }}
        </option>
      </select>
      <span>from {{ data?.pagination.totalItems ?? 0 }} products.</span>
    </div>
    <button
      v-bind:disabled="data?.pagination?.page <= 1"
      v-on:click="fetchPrevPage()"
    >
      Prev
    </button>
    <button
      v-bind:disabled="data?.pagination?.page === data?.pagination?.totalPage"
      v-on:click="fetchNextPage()"
    >
      Next
    </button>
    <div>
      Page {{ data?.pagination?.page }} / {{ data?.pagination?.totalPage }}
    </div>
  </div>
</template>
