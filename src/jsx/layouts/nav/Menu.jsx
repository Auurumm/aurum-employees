import { SVGICON } from "../../constant/theme";

export const MenuList = [
   
    //Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: SVGICON.dashboard,
        content: [
            {
                title: 'Dashboard Light',
                to: 'dashboard',					
            },
            {
                title: 'Dashboard Dark',
                to: 'index-2',
            },
            {
                title: 'Dashboard 2',
                to: 'index-3',
            },
            {
                title: 'Banking',
                to: 'banking',
            },
            {
                title: 'Ticketing',
                to: 'ticketing',
            },
            {
                title: 'Crypto',
                to: 'crypto',
            },
            {
                title: 'Invoice',
                to: 'invoice',
            },
            {
                title: 'Contact',
                to: 'contact',
            },
            {
                title: 'Kanban',
                to: 'kanban',
            },
           
        ],
    },
    {
        title:'File Manager',
        classsChange:'mm-collpase',
        iconStyle: SVGICON.filemanager,
        content : [
            {
                title:'File Manager',
                to:'file-manager'
            },
            {
                title:'User',
                to:'user'
            },
            {
                title:'Calendar',
                to:'calendar'
            },
            {
                title:'To Do List',
                to:'to-do-list'
            },
            {
                title:'Chat',
                to:'chat'
            },
            {
                title:'Activity',
                to:'activity'
            },
        ],
    },

    //CMS
    {
        title : "CMS",
        classsChange: 'mm-collapse',
        // update:"New",
        iconStyle: SVGICON.CmsIcon,
        content:[
            {
                title:'Content',
                to:'/content'
            },
            {
                title:'Menu',
                to:'/menu'
            },
            {
                title:'Email Template',
                to:'/email-template'
            },
            {
                title:'Blog',
                to:'/blog'
            },
            {
                title:'Add Content',
                to:'/content-add'
            },
            {
                title:'Add Email',
                to:'/add-email'
            },
            {
                title:'Add Blog',
                to:'/add-blog'
            },
            {
                title:'Blog Category',
                to:'/blog-category'
            },
        ],
    },
    

    
    {
        title: 'Apps',	
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.AppsIcon,
        content: [
            {
                title: 'Profile',
                to: 'app-profile'
            },
            {
                title: 'Edit Profile',
                to: 'edit-profile'
            },
            {
                title: 'Post Details',
                to: 'post-details'
            },
            {
                title: 'Email',                
                hasMenu : true,
                content: [
                    {
                        title: 'Compose',
                        to: 'email-compose',
                    },
                    {
                        title: 'Inbox',
                        to: 'email-inbox',
                    },
                    {
                        title: 'Read',
                        to: 'email-read',
                    }
                ],
            },
            {
                title:'Calendar',
                to: 'app-calender'
            },
            {
                title: 'Shop',
                //to: './',
                hasMenu : true,
                content: [
                    {
                        title: 'Product Grid',
                        to: 'ecom-product-grid',
                    },
                    {
                        title: 'Product List',
                        to: 'ecom-product-list',
                    },
                    {
                        title: 'Product Details',
                        to: 'ecom-product-detail',
                    },
                    {
                        title: 'Order',
                        to: 'ecom-product-order',
                    },
                    {
                        title: 'Checkout',
                        to: 'ecom-checkout',
                    },
                    {
                        title: 'Invoice',
                        to: 'ecom-invoice',
                    },
                    {
                        title: 'Customers',
                        to: 'ecom-customers',
                    },
                ],
            },
        ],
    },

    
    //Charts
    {
        title: 'Charts',	
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.ChartIcon,
        content: [
            
            {
                title: 'RechartJs',
                to: 'chart-rechart',					
            },
            {
                title: 'Chartjs',
                to: 'chart-chartjs',					
            },
            {
                title: 'Sparkline',
                to: 'chart-sparkline',					
            },
            {
                title: 'Apexchart',
                to: 'chart-apexchart',					
            },
        ]
    },
    
    //Boosttrap
    {
        title: 'Bootstrap',	
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.BootstrapIcon,	
        content: [
            {
                title: 'Accordion',
                to: 'ui-accordion',					
            },
            {
                title: 'Alert',
                to: 'ui-alert',					
            },
            {
                title: 'Badge',
                to: 'ui-badge',					
            },
            {
                title: 'Button',
                to: 'ui-button',					
            },
            {
                title: 'Modal',
                to: 'ui-modal',					
            },
            {
                title: 'Button Group',
                to: 'ui-button-group',					
            },
            {
                title: 'List Group',
                to: 'ui-list-group',					
            },
            {
                title: 'Media Object',
                to: 'ui-media-object',					
            },
            {
                title: 'Cards',
                to: 'ui-card',					
            },
            {
                title: 'Carousel',
                to: 'ui-carousel',					
            },
            {
                title: 'Dropdown',
                to: 'ui-dropdown',					
            },
            {
                title: 'Popover',
                to: 'ui-popover',					
            },
            {
                title: 'Progressbar',
                to: 'ui-progressbar',					
            },
            {
                title: 'Tab',
                to: 'ui-tab',					
            },
            {
                title: 'Typography',
                to: 'ui-typography',					
            },
            {
                title: 'Pagination',
                to: 'ui-pagination',					
            },
            {
                title: 'Grid',
                to: 'ui-grid',					
            },
        ]
    },
    //plugins
    {
        title:'Plugins',
        classsChange: 'mm-collapse',
        iconStyle : SVGICON.PluginIcon,
        content : [
            {
                title:'Select 2',
                to: 'uc-select2',
            },
           
            {
                title:'Sweet Alert',
                to: 'uc-sweetalert',
            },
            {
                title:'Toastr',
                to: 'uc-toastr',
            },            
            {
                title:'Light Gallery',
                to: 'uc-lightgallery',
            },
        ]
    },
    //Widget
    {   
        title:'Widget',
        iconStyle: SVGICON.WidgetIcon,
        classsChange: 'mm-collapse',        
        content : [
            {
                title:'Widget Card',
                to:'widget-card'
            },
            {
                title:'Widget Chart',
                to:'widget-chart'
            },
            {
                title:'Widget List',
                to:'widget-list'
            },
        ]
    },

    //Forms
    {
        title:'Forms',
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.FormIcon,
        content : [
            {
                title:'Form Elements',
                to: 'form-element',
            },
            {
                title:'Wizard',
                to: 'form-wizard',
            },
            {
                title:'CkEditor',
                to: 'form-ckeditor',
            },
            {
                title:'Pickers',
                to: 'form-pickers',
            },
            {
                title:'Form Validate',
                to: 'form-validation',
            },

        ]
    },
    //Table    
    {
        title:'Table',
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.TableIcon,
        content : [
            {
                title:'Table Filtering',
                to: 'table-filtering',
            },
            {
                title:'Table Sorting',
                to: 'table-sorting',
            },
            {
                title:'Bootstrap',
                to: 'table-bootstrap-basic',
            },
           

        ]
    },
    //Pages    
    {
        title:'Pages',
        classsChange: 'mm-collapse',
        iconStyle: SVGICON.PageIcon,
        content : [
            {
                title:'Error',
                hasMenu : true,
                content : [
                    {
                        title: 'Error 400',
                        to : 'page-error-400',
                    },
                    {
                        title: 'Error 403',
                        to : 'page-error-403',
                    },
                    {
                        title: 'Error 404',
                        to : 'page-error-404',
                    },
                    {
                        title: 'Error 500',
                        to : 'page-error-500',
                    },
                    {
                        title: 'Error 503',
                        to : 'page-error-503',
                    },
                ],
            },
            {
                title:'Lock Screen',
                to: 'page-lock-screen',
            },

        ]
    },
    
]