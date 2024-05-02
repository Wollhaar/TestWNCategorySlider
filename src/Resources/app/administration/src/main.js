// Import cms-element module
import './module/sw-cms/blocks/webnetz/category-slider';

// register preview component
Shopware.Component.register('sw-cms-category-box-preview', () => import('./module/sw-cms/component/sw-cms-category-box-preview'))