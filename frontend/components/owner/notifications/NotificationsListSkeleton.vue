<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" rounded="lg">
        <v-list class="py-0">
          <template v-for="i in 5" :key="i">
            <v-list-item>
              <template #prepend>
                <v-skeleton-loader type="avatar" />
              </template>
              <v-skeleton-loader type="list-item-two-line" />
            </v-list-item>
            <v-divider v-if="i < 5" />
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>
