export const getServiceImage = (name: string) => {
    const lowerName = name.toLowerCase();
    
    // Cleaning
    if (lowerName.includes('sofa')) return 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('deep') || lowerName.includes('home')) return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('clean')) return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
    
    // Repair
    if (lowerName.includes('ac') || lowerName.includes('cool')) return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('washing') || lowerName.includes('machine')) return 'https://images.unsplash.com/photo-1626806787426-591692176211?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('refrigerat') || lowerName.includes('fridge')) return 'https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('repair')) return 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500&auto=format&fit=crop';
    
    // Plumbing
    if (lowerName.includes('plumb') || lowerName.includes('pipe') || lowerName.includes('water')) return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('drain') || lowerName.includes('clog')) return 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('bath') || lowerName.includes('shower') || lowerName.includes('tap')) return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop'; // Re-use a home interior

    // Electrician
    if (lowerName.includes('electric') || lowerName.includes('wire') || lowerName.includes('switch')) return 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('fan')) return 'https://images.unsplash.com/photo-1527633215904-9840b2fdd5e4?q=80&w=500&auto=format&fit=crop';
    
    // Painting
    if (lowerName.includes('paint') || lowerName.includes('wall')) return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('polish') || lowerName.includes('wood')) return 'https://images.unsplash.com/photo-1611078500645-81676643bb2c?q=80&w=500&auto=format&fit=crop';
    
    // Others
    if (lowerName.includes('garden') || lowerName.includes('lawn')) return 'https://images.unsplash.com/photo-1592424001809-8b01bb5dae2d?q=80&w=500&auto=format&fit=crop';
    if (lowerName.includes('assemble') || lowerName.includes('furnitur')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop';
    
    // Default fallback
    return 'https://plus.unsplash.com/premium_photo-1663045437883-936655c68ff8?q=80&w=500&auto=format&fit=crop';
};
