import { ExtractPropTypes } from 'vue';
import { adminTableProps, adminEditModalProps, adminFunctionViewDrawerProps } from './src/props';

export { default as AdminTable } from './src/AdminTable.vue';
export { default as AdminEditModal } from './src/AdminEditModal.vue';
export { default as AdminFunctionViewDrawer } from './src/AdminFunctionViewDrawer.vue';
export declare type AdminTableProps = Partial<ExtractPropTypes<typeof adminTableProps>>;
export declare type AdminEditModalProps = Partial<ExtractPropTypes<typeof adminEditModalProps>>;
export declare type AdminFunctionViewDrawerProps = Partial<ExtractPropTypes<typeof adminFunctionViewDrawerProps>>;
