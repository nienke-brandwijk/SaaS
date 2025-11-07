import { ToC } from '../types/types';

export const learnPages: ToC[] = [
    {
        path: '/learn/introduction',
        title: '1. Introduction',
        children: [
            { path: '/learn/introduction/what-to-expect', title: '1.1 What to expect' }
        ]
    },
    {
        path: '/learn/materials',
        title: '2. Materials',
        children: [
            {
                path: '/learn/materials/yarns',
                title: '2.1 Yarns',
                children: [
                    { path: '/learn/materials/yarns/types', title: '2.1.1 Types of yarn' },
                    { path: '/learn/materials/yarns/weights', title: '2.1.2 Yarn weights' }
                ]
            },
            {
                path: '/learn/materials/needles',
                title: '2.2 Needles',
                children: [
                    { path: '/learn/materials/needles/sizes', title: '2.2.1 Needle sizes' }
                ]
            }
        ]
    },
    {
        path: '/learn/cast-on',
        title: '3. Cast on'
    }
];

// Flatten the hierarchy into a single array for navigation
export const getFlatPages = (pages: ToC[] = learnPages): { path: string; title: string }[] => {
    const flat: { path: string; title: string }[] = [];
    
    const flatten = (items: ToC[]) => {
        items.forEach(item => {
            flat.push({ path: item.path, title: item.title });
            if (item.children) {
                flatten(item.children);
            }
        });
    };
    
    flatten(pages);
    return flat;
};