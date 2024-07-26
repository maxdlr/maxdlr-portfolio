import { registerVueControllerComponents } from '@symfony/ux-vue';
import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.scss';

// document.addEventListener('vue:before-mount', (event) => {
//     const {
//         componentName, // The Vue component's name
//         component, // The resolved Vue component
//         props, // The props that will be injected to the component
//         app, // The Vue application instance
//     } = event.detail;
//
//     app.use();
// });

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));