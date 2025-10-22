# Roles Components Organization

This directory contains all components related to the Roles & Permissions feature, organized by their usage context.

## Directory Structure

```
roles/
├── list/           # Components for the roles list/index page
├── detail/         # Components for the role detail page
├── form/           # Components for the role form dialog
└── README.md
```

## Components by Directory

### `/list` - Roles List Page Components
Components used in `/pages/roles/index.vue`

- **RoleCard.vue** - Individual role card display
- **RoleFilters.vue** - Filter controls (search & module filter)
- **RoleGrid.vue** - Grid layout for role cards
- **RoleStats.vue** - Statistics cards (total roles, users, permissions, custom roles)

**Usage:**
```vue
<RolesListRoleFilters />
<RolesListRoleStats />
<RolesListRoleGrid />
```

### `/detail` - Role Detail Page Components
Components used in `/pages/roles/[id].vue`

- **AssignedUsersCard.vue** - Card showing users assigned to the role
- **PermissionListItem.vue** - Individual permission item display
- **PermissionsCard.vue** - Card showing all permissions by module
- **RoleDetailHeader.vue** - Header with role name, description, and action buttons
- **RoleInfoCard.vue** - Single info card (reusable)
- **RoleInfoCards.vue** - Container for all info cards

**Usage:**
```vue
<RolesDetailRoleDetailHeader />
<RolesDetailRoleInfoCards />
<RolesDetailPermissionsCard />
<RolesDetailAssignedUsersCard />
```

### `/form` - Role Form Dialog Components
Components used in the Create/Edit Role dialog

- **BasicInfoSection.vue** - Role name and description inputs
- **PermissionCheckbox.vue** - Individual permission checkbox
- **PermissionModule.vue** - Legacy module component (consider removing)
- **PermissionsModulePanel.vue** - Expandable panel for permission module
- **PermissionsSection.vue** - Full permissions selection section
- **PermissionsSectionHeader.vue** - Header with select/clear all actions
- **RoleFormDialog.vue** - Main dialog wrapper

**Usage:**
```vue
<RolesFormRoleFormDialog />
<!-- Internal components -->
<RolesFormBasicInfoSection />
<RolesFormPermissionsSection />
<RolesFormPermissionsSectionHeader />
<RolesFormPermissionsModulePanel />
<RolesFormPermissionCheckbox />
```

## Naming Convention

All components follow Vue's auto-import naming convention with the directory structure:

```
Roles + Directory + ComponentName
```

**Examples:**
- `components/roles/list/RoleCard.vue` → `<RolesListRoleCard />`
- `components/roles/detail/RoleInfoCard.vue` → `<RolesDetailRoleInfoCard />`
- `components/roles/form/BasicInfoSection.vue` → `<RolesFormBasicInfoSection />`

## Related Files

- **Composables:** `/frontend/composables/useRolesPermissions.ts`, `/frontend/composables/useRoleForm.ts`, `/frontend/composables/useRoleDetail.ts`
- **Pages:** `/frontend/pages/roles/index.vue`, `/frontend/pages/roles/[id].vue`
- **Types:** `/frontend/types/role.ts`

## Component Dependencies

### Shared Components Used
- `CommonPageContainer`
- `CommonPageHeader`
- `CommonPageBreadcrumbs`
- `CommonDialogHeader`
- `CommonDialogActions`
- `CommonFormField`
- `CommonSectionHeader`
- `UsersUserListItem`

### External Libraries
- Vuetify 3 (v-card, v-btn, v-chip, etc.)
- Vue Router (for navigation)

## Best Practices

1. **Single Responsibility:** Each component handles one specific piece of UI
2. **Reusability:** Components like `RoleInfoCard` are designed to be reusable
3. **TypeScript:** All components use TypeScript with proper type definitions
4. **Tailwind CSS:** Styling uses Tailwind utility classes instead of custom CSS
5. **Composition API:** All components use Vue 3's `<script setup>` syntax
6. **Props & Emits:** Properly typed with TypeScript interfaces

## Optimization History

This organization is the result of multiple optimization passes:
- Extracted components from monolithic page files
- Converted CSS to Tailwind utilities
- Created composables for business logic
- Organized by feature and usage context
- Reduced total lines of code by ~60%
