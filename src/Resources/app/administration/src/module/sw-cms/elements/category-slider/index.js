Shopware.Component.register('sw-cms-el-preview-category-slider', () => import('./preview'));
Shopware.Component.register('sw-cms-el-config-category-slider', () => import('./config'));
Shopware.Component.register('sw-cms-el-category-slider', () => import('./component'));

const Criteria = Shopware.Data.Criteria;
const criteria = new Criteria(1, 25);
criteria.addAssociation('cover');

Shopware.Service('cmsService').registerCmsElement({
    name: 'category-slider',
    label: 'Category Slider',
    component: 'sw-cms-el-category-slider',
    configComponent: 'sw-cms-el-config-category-slider',
    previewComponent: 'sw-cms-el-preview-category-slider',
    defaultConfig: {
        products: {
            source: 'static',
            value: [],
            required: true,
            entity: {
                name: 'category',
                criteria: criteria,
            },
        },
        title: {
            source: 'static',
            value: '',
        },
        displayMode: {
            source: 'static',
            value: 'standard',
        },
        boxLayout: {
            source: 'static',
            value: 'standard',
        },
        navigation: {
            source: 'static',
            value: true,
        },
        rotate: {
            source: 'static',
            value: false,
        },
        border: {
            source: 'static',
            value: false,
        },
        elMinWidth: {
            source: 'static',
            value: '300px',
        },
        verticalAlign: {
            source: 'static',
            value: null,
        },
        productStreamSorting: {
            source: 'static',
            value: 'name:ASC',
        },
        productStreamLimit: {
            source: 'static',
            value: 10,
        },
    },
    collect: Shopware.Service('cmsService').getCollectFunction(),
});
