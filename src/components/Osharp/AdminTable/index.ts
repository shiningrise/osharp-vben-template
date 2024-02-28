import { ExtractPropTypes } from 'vue';
import { adminTableProps, adminEditModalProps, adminFunctionViewDrawerProps, adminSearchDrawerProps, adminSearchModalProps } from './src/props';

export { default as AdminTable } from './src/AdminTable.vue';
export { default as AdminEditModal } from './src/AdminEditModal.vue';
export { default as AdminFunctionViewDrawer } from './src/AdminFunctionViewDrawer.vue';
export { default as AdminSearchDrawer } from './src/AdminSearchDrawer.vue';
export { default as AdminSearchModal } from './src/AdminSearchModal.vue';

export declare type AdminTableProps = Partial<ExtractPropTypes<typeof adminTableProps>>;
export declare type AdminEditModalProps = Partial<ExtractPropTypes<typeof adminEditModalProps>>;
export declare type AdminFunctionViewDrawerProps = Partial<ExtractPropTypes<typeof adminFunctionViewDrawerProps>>;
export declare type AdminSearchDrawerProps = Partial<ExtractPropTypes<typeof adminSearchDrawerProps>>;
export declare type AdminSearchModalProps = Partial<ExtractPropTypes<typeof adminSearchModalProps>>;
