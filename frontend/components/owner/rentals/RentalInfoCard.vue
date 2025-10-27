<template>
  <CommonUiDetailCard title="Rental Information" icon="mdi-information">
    <v-row>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Rental ID" icon="mdi-identifier" :value="`#${rental.id}`" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Status" icon="mdi-flag">
          <v-chip :color="getStatusColor(rental.status)" size="small" variant="flat">
            <v-icon :icon="getStatusIcon(rental.status)" start size="14" />
            {{ rental.status }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Start Date" icon="mdi-calendar-start" :value="formatDate(rental.startDate)" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="End Date" icon="mdi-calendar-end" :value="formatDate(rental.endDate)" />
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Duration" icon="mdi-calendar-range">
          <span>{{ rental.amountOfDays }} day{{ rental.amountOfDays !== 1 ? 's' : '' }}</span>
        </CommonUiDetailItem>
      </v-col>
      <v-col cols="12" md="6">
        <CommonUiDetailItem label="Rate Type" icon="mdi-map-marker-distance">
          <v-chip size="small" variant="tonal" :color="rental.rateType === 'city' ? 'primary' : 'secondary'">
            <v-icon :icon="rental.rateType === 'city' ? 'mdi-city' : 'mdi-map-marker-distance'" start size="14" />
            {{ rental.rateType === 'city' ? 'City Drive' : 'Province Drive' }}
          </v-chip>
        </CommonUiDetailItem>
      </v-col>
    </v-row>
  </CommonUiDetailCard>
</template>

<script setup lang="ts">
interface Props {
  rental: {
    id: string | number
    status: string
    startDate: string
    endDate: string
    amountOfDays: number
    rateType: 'city' | 'province'
  }
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    reserved: 'info',
    active: 'success',
    completed: 'primary',
    cancelled: 'error',
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    reserved: 'mdi-calendar-clock',
    active: 'mdi-car-clock',
    completed: 'mdi-check-circle',
    cancelled: 'mdi-cancel',
  }
  return icons[status] || 'mdi-help-circle'
}
</script>
