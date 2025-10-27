/**
 * Reusable composable for defining status-aware actions
 * Can be used for vehicles, users, rentals, or any entity with statuses
 */

export interface StatusAction {
  /** Action identifier (e.g., 'mark-available', 'deactivate') */
  action: string
  /** Display label for the action */
  label: string
  /** Icon to display */
  icon: string
  /** Color theme (success, warning, error, primary, etc.) */
  color: string
  /** Tooltip text */
  tooltip: string
  /** Condition function to show this action */
  showWhen: (item: any) => boolean
  /** Optional: Disable condition */
  disableWhen?: (item: any) => boolean
  /** Optional: Confirm before action */
  requiresConfirmation?: boolean
  /** Optional: Confirmation message */
  confirmMessage?: (item: any) => string
}

export interface StatusActionsConfig {
  /** Array of status action definitions */
  actions: StatusAction[]
}

/**
 * Vehicle status actions configuration
 */
export const useVehicleStatusActions = (): StatusActionsConfig => {
  return {
    actions: [
      // Mark as Available
      {
        action: 'mark-available',
        label: 'Mark Available',
        icon: 'mdi-check-circle',
        color: 'success',
        tooltip: 'Mark vehicle as available for rent',
        showWhen: (vehicle) =>
          vehicle.status === 'maintenance' || vehicle.status === 'out-of-service',
        requiresConfirmation: true,
        confirmMessage: (vehicle) =>
          `Mark ${vehicle.make} ${vehicle.model} as available for rent?`,
      },
      // Send to Maintenance
      {
        action: 'send-to-maintenance',
        label: 'Send to Maintenance',
        icon: 'mdi-tools',
        color: 'warning',
        tooltip: 'Schedule vehicle for maintenance',
        showWhen: (vehicle) =>
          vehicle.status === 'available' || vehicle.status === 'out-of-service',
        requiresConfirmation: true,
        confirmMessage: (vehicle) =>
          `Send ${vehicle.make} ${vehicle.model} to maintenance? It will be unavailable for rent.`,
      },
      // Mark Out of Service
      {
        action: 'mark-out-of-service',
        label: 'Out of Service',
        icon: 'mdi-close-circle',
        color: 'error',
        tooltip: 'Mark vehicle as out of service',
        showWhen: (vehicle) =>
          vehicle.status === 'available' || vehicle.status === 'maintenance',
        requiresConfirmation: true,
        confirmMessage: (vehicle) =>
          `Mark ${vehicle.make} ${vehicle.model} as out of service?`,
      },
      // Return from Rental
      {
        action: 'return-from-rental',
        label: 'Return Vehicle',
        icon: 'mdi-car-arrow-left',
        color: 'primary',
        tooltip: 'Mark vehicle as returned from rental',
        showWhen: (vehicle) => vehicle.status === 'rented',
        requiresConfirmation: true,
        confirmMessage: (vehicle) =>
          `Mark ${vehicle.make} ${vehicle.model} as returned? Status will be changed to available.`,
      },
    ],
  }
}

/**
 * User status actions configuration (example for reusability)
 */
export const useUserStatusActions = (): StatusActionsConfig => {
  return {
    actions: [
      {
        action: 'activate',
        label: 'Activate',
        icon: 'mdi-account-check',
        color: 'success',
        tooltip: 'Activate user account',
        showWhen: (user) => user.status === 'inactive' || user.status === 'suspended',
      },
      {
        action: 'deactivate',
        label: 'Deactivate',
        icon: 'mdi-account-off',
        color: 'warning',
        tooltip: 'Deactivate user account',
        showWhen: (user) => user.status === 'active',
        disableWhen: (user) => user.role === 'admin',
      },
      {
        action: 'suspend',
        label: 'Suspend',
        icon: 'mdi-account-cancel',
        color: 'error',
        tooltip: 'Suspend user account',
        showWhen: (user) => user.status !== 'suspended',
        disableWhen: (user) => user.role === 'admin',
      },
    ],
  }
}

/**
 * Generic helper to get available actions for an item
 */
export const getAvailableActions = (item: any, config: StatusActionsConfig): StatusAction[] => {
  return config.actions.filter((action) => action.showWhen(item))
}

/**
 * Generic helper to check if an action should be disabled
 */
export const isActionDisabled = (item: any, action: StatusAction): boolean => {
  return action.disableWhen ? action.disableWhen(item) : false
}
