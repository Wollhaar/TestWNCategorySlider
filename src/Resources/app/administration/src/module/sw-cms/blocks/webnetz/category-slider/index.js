// register components to block element
Shopware.Component.register('sw-cms-preview-category-slider', () => import('./preview'));
Shopware.Component.register('sw-cms-block-category-slider', () => import('./component'));

Shopware.Service('cmsService').registerCmsBlock({
    name: 'category-slider',
    category: 'webnetz',
    label: 'Category Slider',
    component: 'sw-cms-block-category-slider',
    previewComponent: 'sw-cms-preview-category-slider',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed'
    },
    slots: {
        categorySlider: 'category-slider',
    }
});