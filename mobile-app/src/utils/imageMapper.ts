export const getServiceImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('sofa')) return 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('deep') || lowerName.includes('home')) return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('clean')) return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('ac') || lowerName.includes('repair')) return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('plumb')) return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('electric')) return 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('paint')) return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('garden') || lowerName.includes('lawn')) return 'https://images.unsplash.com/photo-1592424001809-8b01bb5dae2d?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('assemble') || lowerName.includes('furnitur')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
};
