import { ToC } from '../types/types';

export const learnPages: ToC[] = [
    {
        path: '/learn/introduction',
        title: '1. Introduction'
    },
    {
        path: '/learn/basics',
        title: '2. Basics',
        children: [
            {
                path: '/learn/basics/materials',
                title: '2.1 What do we use to knit?',
            },
            {
                path: '/learn/basics/cast-on',
                title: '2.2 Cast on',
            },
            {
                path: '/learn/basics/knit-stitch',
                title: '2.3 knit stitch',
            },
            {
                path: '/learn/basics/purl-stitch',
                title: '2.4 Purl stitch',
            },
            {
                path: '/learn/basics/bind-off',
                title: '2.5 Bind off',
            },
            {
                path: '/learn/basics/size',
                title: '2.6 The right size',
            },
        ]
    },
    {
        path: '/learn/yarns',
        title: '3. Yarns',
        children: [
            {
                path: '/learn/yarns/types',
                title: '3.1 Types of yarn',
            },
            {
                path: '/learn/yarns/weights',
                title: '3.2 Yarn weights',
            }
        ]
    },
    {
        path: '/learn/needles',
        title: '4. Needles',
        children: [
            {
                path: '/learn/needles/types',
                title: '4.1 Types of needles',
            },
            {
                path: '/learn/needles/sizes',
                title: '4.2 Needle sizes',
            },
            {
                path: '/learn/needles/materials',
                title: '4.3 Needle materials',
            }
        ]
    },
    {
        path: '/learn/cast-on',
        title: '5. Cast on types'
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