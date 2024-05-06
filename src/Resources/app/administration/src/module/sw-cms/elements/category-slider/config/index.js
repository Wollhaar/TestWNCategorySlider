import template from './sw-cms-el-config-category-slider.html.twig';
import './sw-cms-el-config-category-slider.scss';

const { Mixin } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;

/**
 * @private
 * @package buyers-experience
 */
export default {
    template,

    inject: ['repositoryFactory', 'feature'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            categoryCollection: null,
            categoryStream: null,
            showCategoryStreamPreview: false,

            // Temporary values to store the previous selection in case the user changes the assignment type.
            tempCategoryIds: [],
            tempStreamId: null,
        };
    },

    computed: {
        categoryRepository() {
            return this.repositoryFactory.create('category');
        },

        categoryStreamRepository() {
            return this.repositoryFactory.create('category_stream');
        },

        categories() {
            if (this.element?.data?.categories && this.element.data.categories.length > 0) {
                return this.element.data.categories;
            }

            return null;
        },

        categoryMediaFilter() {
            const criteria = new Criteria(1, 25);
            criteria.addAssociation('cover');
            criteria.addAssociation('options.group');

            return criteria;
        },

        categoryMultiSelectContext() {
            const context = { ...Shopware.Context.api };
            context.inheritance = true;

            return context;
        },

        categoryAssignmentTypes() {
            return [{
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryAssignmentTypeOptions.manual'),
                value: 'static',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryAssignmentTypeOptions.categoryStream'),
                value: 'category_stream',
            }];
        },

        categoryStreamSortingOptions() {
            return [{
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.nameAsc'),
                value: 'name:ASC',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.nameDesc'),
                value: 'name:DESC',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.creationDateAsc'),
                value: 'createdAt:ASC',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.creationDateDesc'),
                value: 'createdAt:DESC',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.random'),
                value: 'random',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.priceAsc'),
                value: 'cheapestPrice:ASC',
            }, {
                label: this.$tc('sw-cms.elements.categorySlider.config.categoryStreamSortingOptions.priceDesc'),
                value: 'cheapestPrice:DESC',
            }];
        },

        categoryStreamCriteria() {
            const criteria = new Criteria(1, 10);
            const sorting = this.element.config.categoryStreamSorting.value;

            if (!sorting || sorting === 'random') {
                return criteria;
            }

            const field = sorting.split(':')[0];
            const direction = sorting.split(':')[1];

            criteria.addSorting(Criteria.sort(field, direction, false));

            return criteria;
        },

        categoryStreamPreviewColumns() {
            return [
                {
                    property: 'name',
                    label: this.$tc('sw-category.base.categories.columnNameLabel'),
                    dataIndex: 'name',
                    sortable: false,
                }, {
                    property: 'manufacturer.name',
                    label: this.$tc('sw-category.base.categories.columnManufacturerLabel'),
                    sortable: false,
                },
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('category-slider');

            this.categoryCollection = new EntityCollection('/category', 'category', Shopware.Context.api);

            if (this.element.config.categories.value.length <= 0) {
                return;
            }

            if (this.element.config.categories.source === 'category_stream') {
                this.loadCategoryStream();
            } else {
                // We have to fetch the assigned entities again
                // ToDo: Fix with NEXT-4830
                const criteria = new Criteria(1, 100);
                criteria.addAssociation('cover');
                criteria.addAssociation('options.group');
                criteria.setIds(this.element.config.categories.value);

                this.categoryRepository
                    .search(criteria, { ...Shopware.Context.api, inheritance: true })
                    .then((result) => {
                        this.categoryCollection = result;
                        console.log('category search result');
                        console.log(result);
                    });
            }
        },

        onChangeAssignmentType(type) {
            if (type === 'category_stream') {
                this.tempCategoryIds = this.element.config.categories.value;
                this.element.config.categories.value = this.tempStreamId;
            } else {
                this.tempStreamId = this.element.config.categories.value;
                this.element.config.categories.value = this.tempcategoryIds;
            }
        },

        loadCategoryStream() {
            this.categoryStreamRepository
                .get(this.element.config.categories.value, Shopware.Context.api, new Criteria(1, 25))
                .then((result) => {
                    this.categoryStream = result;
                });
        },

        onChangeCategoryStream(streamId) {
            if (streamId === null) {
                this.categoryStream = null;
                return;
            }

            this.loadCategoryStream();
        },

        onClickCategoryStreamPreview() {
            if (this.categoryStream === null) {
                return;
            }

            this.showcategoryStreamPreview = true;
        },

        onCloseCategoryStreamModal() {
            this.showcategoryStreamPreview = false;
        },

        onCategoriesChange() {
            this.element.config.categories.value = this.categoryCollection.getIds();

            if (!this.element?.data) {
                return;
            }

            this.$set(this.element.data, 'categories', this.categoryCollection);
        },

        isSelected(itemId) {
            return this.categoryCollection.has(itemId);
        },
    },
};
