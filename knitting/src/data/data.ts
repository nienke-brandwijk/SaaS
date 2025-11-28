import { ToC } from '../types/types';

export const learnPages: ToC[] = [
    {
        path: '/learn/introduction',
        title: '1 Introduction'
    },
    {
        path: '/learn/materials',
        title: '2 What do we use to knit?',
    },
    {
        path: '/learn/cast-on',
        title: '3 Cast on',
    },
    {
        path: '/learn/knit-stitch',
        title: '4 knit stitch',
    },
    {
        path: '/learn/purl-stitch',
        title: '5 Purl stitch',
    },
    {
        path: '/learn/bind-off',
        title: '6 Bind off',
    },
    {
        path: '/learn/size',
        title: '7 The right size',
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