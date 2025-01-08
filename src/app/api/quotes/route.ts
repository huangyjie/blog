import { NextResponse } from 'next/server';

// 一言数据
const quotes = [
    {
        content: "努力不一定成功，但放弃一定失败。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "人生没有一帆风顺，只有披荆斩棘。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "只要不停下，路就会延伸到你想去的地方。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "编程是一门艺术，而你就是艺术家。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "代码的世界里没有限制，只有创造。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "今天的 Bug 是明天的经验。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "保持学习，保持谦逊，保持热爱。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "优秀的代码是最好的文档。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "编程不仅是一份工作，更是一种生活方式。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "简单是最终的复杂。",
        author: "达芬奇",
        source: "艺术人生"
    },
    {
        content: "创新始于思考，成于行动。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "技术改变世界，创意引领未来。",
        author: "佚名",
        source: "科技人生"
    },
    {
        content: "每一行代码都是一次进步的机会。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "专注当下，持续精进。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "用代码书写未来，用智慧改变世界。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "成长的路上没有捷径，唯有脚踏实地。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "代码可以被调试，生活也一样。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "保持专注，细节决定成败。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "每一次尝试，都是迈向成功的一步。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "解决问题的过程就是学习的过程。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "人生就像编程，变量总会有改变，但逻辑永远不变。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "创造的喜悦超越所有困难。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "简单的代码背后往往是复杂的思考。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "科技的意义在于让世界变得更好。",
        author: "佚名",
        source: "科技人生"
    },
    {
        content: "成功是不断试错和学习的结果。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "好的程序员写代码，伟大的程序员重构代码。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "每一次编译失败，都是学习的开始。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "创新来自坚持，不放弃便会有奇迹。",
        author: "佚名",
        source: "人生感悟"
    },
    {
        content: "代码是无声的诗，程序员是默默的诗人。",
        author: "佚名",
        source: "程序人生"
    },
    {
        content: "逻辑是思维的根基，代码是思想的延伸。",
        author: "佚名",
        source: "程序人生"
    }
];

export async function GET() {
    // 随机选择一条一言
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return NextResponse.json(randomQuote);
} 