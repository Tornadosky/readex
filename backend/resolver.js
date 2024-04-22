const crypto = require('crypto');
var moment = require('moment');
const Prisma = require('prisma');
const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient({ /// TODO: remove prisma logging!
    log: [{
            emit: 'stdout',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ]
});

const path = require('path');
const fs = require('fs');

const resolver = {
    Books: async (args, context) => {
        let answer = null;
        if (args.title) {
            answer = await prisma.Books.findMany({
                where: {
                    AND: {
                        title: args.title,
                        user: {
                            id: parseInt(args.userid)
                        }
                    }
                },
                include: {
                    user: true
                }
            });
        } else if (args.author) {
            answer = await prisma.Books.findMany({
                where: {
                    AND: {
                        author: args.author,
                        user: {
                            id: parseInt(args.user.id)
                        }
                    }
                },
                include: {
                    user: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Books.findMany({
                where: { id: parseInt(args.id) },
                include: {
                    user: true,
                    highlights: {
                        include: {
                            rects: {
                                include: {
                                    rects: true
                                }
                            },
                            boundingRect: true
                        }
                    }
                }
            });

            // Ensure that an empty array is returned for highlights if none exist
            if (answer && !answer.highlights) {
                answer.highlights = [];
            }
        } else {
            answer = await prisma.Books.findMany({
                include: {
                    user: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Highlights: async (args, context) => {
        let answer = null;
        if (args.book) {
            answer = await prisma.Highlights.findMany({
                where: {
                    AND: {
                        book: {
                            id: parseInt(args.book)
                        },
                        user: {
                            id: parseInt(args.user)
                        }
                    }
                },
                include: {
                    book: true,
                    user: true,
                    boundingRect: true,
                    rects: {
                        include: {
                            rects: true
                        }
                    }
                }
            });
        } else if (args.id) {
            answer = await prisma.Highlights.findMany({
                where: {
                    id: args.id
                },
                include: {
                    book: true,
                    user: true,
                    boundingRect: true,
                    rects: {
                        include: {
                            rects: true
                        }
                    }
                }
            });
        } else {
            answer = await prisma.Highlights.findMany({
                include: {
                    book: true,
                    user: true,
                    boundingRect: true,
                    rects: {
                        select: {
                            rects: true
                        }
                    }
                }});
        }
        console.log(answer[0].rects);
        return answer;
    },
    Collections: async (args, context) => {
        let answer = null;
        if (args.title) {
            answer = await prisma.Collections.findMany({
                where: {
                    AND: {
                        title: args.title,
                        user: {
                            id: args.user
                        }
                    }
                },
                include: {
                    books: {
                        include: {
                            books: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true
                        }
                    },
                    user: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Collections.findMany({
                where: {
                    id: args.id
                },
                include: {
                    books: {
                        include: {
                            books: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true
                        }
                    },
                    user: true
                }
            });
        } else {
            answer = await prisma.Collections.findMany({
                include: {
                    books: {
                        include: {
                            books: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true
                        }
                    },
                    user: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Rects: async (args, context) => {
        let answer = null;
        if (args.id) {
            answer = await prisma.Rects.findMany({
                where: {
                    id: args.id
                }
            });
        } else if (args.x1) {
           answer = await prisma.Rects.findMany({
               where: {
                   x1: args.x1,
                   x2: args.x2,
                   y1: args.y1,
                   y2: args.y2,
                   width: args.width,
                   height: args.height,
                   pagenum: args.pagenum
               } 
           });
        }
        console.log(answer);
        return answer;
    },
    Users: async (args, context) => {
        let answer = null;
        if (args.password) {
            if (args.phone) {
                answer = await prisma.Users.findMany({
                    where: {
                        AND: {
                            phone: args.phone,
                            password: args.password
                        }
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.email) {
                answer = await prisma.Users.findMany({
                    where: {
                        AND: {
                            email: args.email,
                            password: args.password
                        }
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.login) {
                answer = await prisma.Users.findMany({
                    where: {
                        AND: {
                            login: args.login,
                            password: args.password
                        }
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            }
        } else {
            if (args.phone) {
                answer = await prisma.Users.findMany({
                    where: {
                        phone: args.phone
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.email) {
                answer = await prisma.Users.findMany({
                    where: {
                        email: args.email
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.login) {
                answer = await prisma.Users.findMany({
                    where: {
                        login: args.login
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.id) {
                answer = await prisma.Users.findMany({
                    where: {
                        id: parseInt(args.id)
                    },
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else {
                answer = await prisma.Users.findMany({
                    include: {
                        collections: true,
                        achievements: true,
                        words: true
                    }});
            }
        }
        console.log(answer);
        return answer;
    },
    Achievements: async (args, context) => {
        let answer = null;
        if (args.name) {
            answer = await prisma.Achievements.findMany({
                where: {
                    name: args.name
                },
                include: {
                    users: true
                }
            });
        } else if (args.users) {
            answer = await prisma.Achievements.findMany({
                where: {
                    users: {
                        some: {
                            user: {
                                is: {
                                    id: parseInt(args.users)
                                }
                            }
                        }
                    }
                },
                include: {
                    users: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Achievements.findMany({
                where: {
                    id: parseInt(args.id)
                },
                include: {
                    users: true
                }
            });
        } else {
            answer = await prisma.Achievements.findMany({
                include: {
                    users: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Tests: async (args, context) => {
        let answer = null;
        if (args.title) {
            answer = await prisma.Tests.findMany({
                where: {
                    AND: {
                        title: args.title,
                        user: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true,
                    book: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Tests.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true,
                    book: true
                }
            });
            answer = answer ? [answer] : []; // Wrap the result in an array if the test is found, otherwise return an empty array
        } else {
            answer = await prisma.Tests.findMany({
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true,
                    book: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Words: async (args, context) => {
        let answer = null;
        if (args.word) {
            answer = await prisma.Words.findMany({
                where: {
                    AND: {
                        word: args.word,
                        user: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    test: true
                }
            });
        } else if (args.color) {
            answer = await prisma.Words.findMany({
                where: {
                    AND: {
                        color: args.color,
                        user: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    test: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Words.findUnique({
                where: {
                    id: parseInt(args.id)
                },
                include: {
                    user: true,
                    test: true
                }
            });
        } else {
            answer = await prisma.Words.findMany({
                include: {
                    user: true,
                    test: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Questions: async (args, context) => {
        let answer = null;
        if (args.test) {
            answer = await prisma.Questions.findMany({
                where: {
                    AND: {
                        test: {
                            id: args.test
                        },
                        test: {
                            is: {
                                user: {
                                    id: parseInt(args.user)
                                }            
                            }
                        }
                    }
                },
                include: {
                    test: true
                }
            });
        } else if (args.id){
            answer = await prisma.Questions.findUnique({
                where: {
                    id: parseInt(args.id)
                },
                include: {
                    test: true
                }
            });
        } else {
            answer = await prisma.Questions.findMany({
                include: {
                    test: true
                }});
        }
        console.log(answer);
        return answer;
    },

    setUser: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {}
            };
            upsertParams.data.phone = (args.phone);
            upsertParams.data.email = (args.email);
            upsertParams.data.password = (args.password);
            upsertParams.data.login = (args.login);
            upsertParams.data.language = (args.language);
            upsertParams.data.theme = (args.theme);
            args.achievements ? upsertParams.data.achievements = {
                        connectOrCreate: {
                            where: {
                                id: args.achievements.id
                            },
                            create: {
                                name: args.achievements.name,
                                description: args.achievements.description
                            }
                        }
                    } : null;
            upsertParams.where = {
                id: args.id
            };
            upsertParams.include = {
                collections: true,
                achievements: true,
                words: true,
                highlights: true
            };
            answer = await prisma.Users.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    login: args.login,
                    password: args.password,
                    email: args.email,
                    language: args.language,
                    theme: args.theme
                },
                include: {
                    collections: true,
                    achievements: true,
                    words: true,
                    highlights: true
                }
            };
            answer = await prisma.Users.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },

    
    setBook: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {
                    uploaded: moment().format('yyyy-mm-dd:hh:mm:ss'),
                },
                include: {
                    user: true
                }
            };
            if (args.title) {
                upsertParams.data.title = args.title;
                let newPath = "./uploads/" + args.user + "/" + args.title;
                let oldTitle = await prisma.Books.findUnique({where: {
                    id: args.id
                },
                select: {
                    title: true
                }});
                let oldPath = "./uploads/" + args.user + "/" + oldTitle.title;
                await fs.rename(oldPath, newPath, (err) => err && console.error(err));
                upsertParams.data.document = newPath;
            }
            args.author ? upsertParams.data.author = args.author : null;
            args.user ? upsertParams.data.user = { connect: { id: args.user } } : null;
            upsertParams.where = {
                id: args.id
            };
            upsertParams.include = {
                highlights: {
                    include: {
                        rects: {
                            include: {
                                rects: true
                            }
                        },
                        boundingRect: true 
                    }  
                },
                collections: true,
                user: true
            };
            answer = await prisma.Books.update(upsertParams);
        } else {
            console.log("setBook->create");
            let path = "./uploads/"+args.user+"/";

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }

            let pathDB = CheckFile(path, args.title);
            console.log("+->"+pathDB);
            fs.writeFileSync(pathDB, Buffer.from(args.document, 'base64'), 'binary');
            
            upsertParams = {
                data: {
                    title: args.title,
                    author: args.author,
                    document: pathDB,
                    uploaded: moment().format('yyyy-mm-dd:hh:mm:ss'),
                    user: {
                        connect: {
                            id: args.user
                        }
                    }
                },
                include: {
                    highlights: {
                      include: {
                         rects: {
                             include: {
                                 rects: true
                             }
                         },
                         boundingRect: true 
                      }  
                    },
                    collections: true,
                    user: true
                }
            };
            upsertParams.data.image = (args.image);
            
            answer = await prisma.Books.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    
    setAchievement: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {},
                include: {
                    users: true
                }
            };
            upsertParams.data.name = (args.name);
            upsertParams.data.description = (args.description);
            args.users ? upsertParams.data.users = {
                create: {
                    users: {
                        connect: {
                            id: args.users
                        }
                    }
                }
            } : null;
            upsertParams.where = {
                id: parseInt(args.id)
            };
            answer = await prisma.Achievements.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    name: args.name,
                    description: args.description
                },
                include: {
                    users: true
                }
            };
            answer = await prisma.Achievements.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setRect: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {}
            };
            args.x1 ? upsertParams.data = {
                    pagenum: args.pagenum,
                    x1: args.x1,
                    y1: args.y1,
                    x2: args.x2,
                    y2: args.y2,
                    width: args.width,
                    height: args.height
                } : null;
            upsertParams.where = {
                id: args.id
            };
            answer = await prisma.Rects.update(upsertParams);
        } else {
            upsertParams = {
                data: {}
            };
            args.x1 ? upsertParams.data = {
                pagenum: args.pagenum,
                x1: args.x1,
                y1: args.y1,
                x2: args.x2,
                y2: args.y2,
                width: args.width,
                height: args.height
            } : null;
            answer = await prisma.Rects.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setCollection: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {},
                include: {
                    books: {
                        include: {
                            books: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true
                        }
                    },
                    tests: true
                }
            };
            upsertParams.data.title = (args.title);
            args.books ? upsertParams.data.books = 
                {
                    connect: {
                        books: {
                            id: args.books
                        },
                        collections: {
                            id: parseInt(args.id)
                        }
                    }
                 
            } : null;            
            upsertParams.where = {
                id: parseInt(args.id)
            };
            answer = await prisma.Collections.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    title: args.title,
                    user: {
                        connect: {id: args.user}
                    }
                },
                include: {
                    books: {
                        include: {
                            books: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true
                        }
                    },
                    tests: true
                }
            };
            answer = await prisma.Collections.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setHighlight: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {
                    rects: { connectOrCreate: [] },
                },
                include: {
                    user: true,
                    book: true,
                    boundingRect: true,
                    rects: {
                        select: {
                            rects: true
                        }
                    }
                }
            };
            args.book ? upsertParams.data.book = {
                connect: {
                    id: args.book
                }
            }: null;
            args.user ? upsertParams.data.user = {
                connect: {
                    id: args.user
                }
            }: null;
            console.log(args.boundingRect);
            if (args.boundingRect) {
                upsertParams.data.boundingRect = { connectOrCreate: {}};
                upsertParams.data.boundingRect.connectOrCreate = {
                    create: {
                        pagenum: args.boundingRect.pagenum,
                        x1: args.boundingRect.x1,
                        y1: args.boundingRect.y1,
                        x2: args.boundingRect.x2,
                        y2: args.boundingRect.y2,
                        width: args.boundingRect.width,
                        height: args.boundingRect.height
                    },
                    where: {
                        x1_y1_x2_y2_width_height_pagenum: {
                            x1: args.boundingRect.x1,
                            y1: args.boundingRect.y1,
                            x2: args.boundingRect.x2,
                            y2: args.boundingRect.y2,
                            width: args.boundingRect.width,
                            height: args.boundingRect.height,
                            pagenum: args.boundingRect.pagenum
                        }
                    }
                };
            }
            if (args.rects) {
                const promises = args.rects.map(async (rect) => {
                    let isrect = await prisma.Rects.findMany({
                        where: {
                            pagenum: rect.pagenum,
                            x1: rect.x1,
                            y1: rect.y1,
                            x2: rect.x2,
                            y2: rect.y2,
                            width: rect.width,
                            height: rect.height
                        }});
                    console.log(isrect);
                    if (isrect.length > 0)
                        return {
                            create: {
                                rects:{
                                    connectOrCreate: {
                                        create: {
                                            pagenum: rect.pagenum,
                                            x1: rect.x1,
                                            y1: rect.y1,
                                            x2: rect.x2,
                                            y2: rect.y2,
                                            width: rect.width,
                                            height: rect.height
                                        },
                                        where:{
                                            x1_y1_x2_y2_width_height_pagenum: {
                                                x1: rect.x1,
                                                y1: rect.y1,
                                                x2: rect.x2,
                                                y2: rect.y2,
                                                width: rect.width,
                                                height: rect.height,
                                                pagenum: rect.pagenum}
                                        }}}
                            },
                            where: {
                                rectid_highlightid: {
                                    rectid: parseInt(isrect[0].id),
                                    highlightid: parseInt(args.id)
                                }
                            }
                        };
                    else
                        return {
                            create: {
                                rects:{
                                    connectOrCreate: {
                                        create: {
                                            pagenum: rect.pagenum,
                                            x1: rect.x1,
                                            y1: rect.y1,
                                            x2: rect.x2,
                                            y2: rect.y2,
                                            width: rect.width,
                                            height: rect.height
                                        },
                                        where:{
                                            x1_y1_x2_y2_width_height_pagenum: {
                                                x1: rect.x1,
                                                y1: rect.y1,
                                                x2: rect.x2,
                                                y2: rect.y2,
                                                width: rect.width,
                                                height: rect.height,
                                                pagenum: rect.pagenum}
                                        }}}
                            },
                            where: {
                                rectid_highlightid: {
                                    rectid: -1,
                                    highlightid: parseInt(args.id)
                                }
                            }
                        };                    
                });
                upsertParams.data.rects.connectOrCreate = await Promise.all(promises);
            }
            upsertParams.data.title = (args.title);
            upsertParams.data.text = (args.text);
            upsertParams.data.color = (args.color);
            if (args.image) {
                upsertParams.data.image = args.image;
                upsertParams.data.width = args.width;
                upsertParams.data.height = args.height;
            }
            upsertParams.data.emoji = (args.emoji);
            upsertParams.where = {
                id: parseInt(args.id)
            };
            console.log(upsertParams);
            answer = await prisma.Highlights.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    book: {
                        connect: {
                            id: args.book
                        }
                    },
                    user: {
                        connect: {
                            id: args.user
                        }
                    },
                    boundingRect: { create: {}},
                    rects: { create: []},
                },
                include: {
                    user: true,
                    book: true,
                    boundingRect: true,
                    rects: {
                        select: {
                            rects: true
                        }
                    }
                }
            };
            if (args.boundingRect) {
                upsertParams.data.boundingRect.create = {
                    pagenum: args.boundingRect.pagenum,
                    x1: args.boundingRect.x1,
                    y1: args.boundingRect.y1,
                    x2: args.boundingRect.x2,
                    y2: args.boundingRect.y2,
                    width: args.boundingRect.width,
                    height: args.boundingRect.height
                };
            }
            if (args.rects) {
                const promises = args.rects.map(async (rect) => {
                    let isrect = await prisma.Rects.findMany({
                        where: {
                            pagenum: rect.pagenum,
                            x1: rect.x1,
                            y1: rect.y1,
                            x2: rect.x2,
                            y2: rect.y2,
                            width: rect.width,
                            height: rect.height
                        }});
                    console.log(isrect);
                    return {
                        rects:{
                            connectOrCreate: {
                                create: {
                                    pagenum: rect.pagenum,
                                    x1: rect.x1,
                                    y1: rect.y1,
                                    x2: rect.x2,
                                    y2: rect.y2,
                                    width: rect.width,
                                    height: rect.height
                                },
                                where:{
                                    x1_y1_x2_y2_width_height_pagenum: {
                                        x1: rect.x1,
                                        y1: rect.y1,
                                        x2: rect.x2,
                                        y2: rect.y2,
                                        width: rect.width,
                                        height: rect.height,
                                        pagenum: rect.pagenum
                                    }
                                }
                            }
                        }
                    };
                });
                upsertParams.data.rects.create = await Promise.all(promises);
            }
            upsertParams.data.title = (args.title);
            upsertParams.data.text = (args.text);
            upsertParams.data.color = (args.color);
            if (args.image) {
                upsertParams.data.image = args.image;
                upsertParams.data.width = args.width;
                upsertParams.data.height = args.height;
            }
            upsertParams.data.emoji = (args.emoji);
            answer = await prisma.Highlights.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setWord: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {},
                include: {
                    user: true,
                    test: true
                }
            };
            upsertParams.data.color = (args.color);
            upsertParams.data.word = (args.word);
            upsertParams.data.description = (args.description);
            upsertParams.data.translation = (args.translation);
            args.user ? upsertParams.data.user = {
                connect: {
                    id: args.test.id
                }
            } : null;
            args.test ? upsertParams.data.test = {
                connect: {
                    id: args.test
                }
            } : null;
            upsertParams.where = {
                id: parseInt(args.id)
            };
            answer = await prisma.Words.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    user: {
                        connect: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    test: true
                }
            };
            upsertParams.data.color = (args.color);
            upsertParams.data.word = (args.word);
            upsertParams.data.description = (args.description);
            upsertParams.data.translation = (args.translation);
            args.test ? upsertParams.data.test = {
                connect: {
                    id: args.test
                }
            } : null;
            answer = await prisma.Words.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setTest: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {},
                where: {
                  id: parseInt(args.id),
                },
                include: {
                  user: true,
                  questions: true,
                  collections: true,
                  words: true,
                },
            };

            args.title ? upsertParams.data.title = args.title : null;
            args.prompt ? upsertParams.data.prompt = args.prompt : null;
            args.language ? upsertParams.data.language = args.language : null;
            args.difficulty ? upsertParams.data.difficulty = args.difficulty : null;
            args.questionCount ? upsertParams.data.questionCount = args.questionCount : null;
            args.lastResult ? upsertParams.data.lastResult = args.lastResult : null;
            args.result ? upsertParams.data.result = args.result : null;
            upsertParams.where = {
                id: parseInt(args.id)
            };
            upsertParams.include = {
                user: true,
                questions: true,
                collections: true,
                words: true
            };
            answer = await prisma.Tests.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    title: args.title,
                    prompt: args.prompt,
                    language: args.language,
                    difficulty: args.difficulty,
                    questionCount: args.questionCount,
                    lastResult: args.lastResult,
                    result: 0,
                    user: {
                        connect: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true
                }
            };
            answer = await prisma.Tests.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setQuestion: async (args, context) => {
        let upsertParams = {};
        let answer = null;
        if (args.id) {
            upsertParams.data = {};
            upsertParams.data.answers = (args.answers);
            upsertParams.data.questionText = (args.questionText);
            upsertParams.data.type = (args.type);
            upsertParams.data.number = (args.number);
            upsertParams.data.correct = (args.correct);
            upsertParams.data.explanation = (args.explanation);
            upsertParams.where = {
                id: parseInt(args.id)
            };
            upsertParams.include = {
                test: true
            };
            answer = await prisma.Questions.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    number: args.number,
                    type: args.type,
                    correct: args.correct,
                    explanation: args.explanation,
                    test: {
                        connect: {
                            id: args.test
                        }
                    }
                },
                include: {
                    test: true
                }
            };
            upsertParams.data.answers = (args.answers);
            upsertParams.data.questionText = (args.questionText); // Not sure
            answer = await prisma.Questions.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    
    delUser: async (args, context) => {
        let answer = await prisma.Users.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delBook: async (args, context) => {
        let answer = await prisma.Books.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delAchievement: async (args, context) => {
        let answer = await prisma.Achievements.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delRect: async (args, context) => {
        let answer = await prisma.Rects.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delCollection: async (args, context) => {
        let answer = await prisma.Collections.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delHighlight: async (args, context) => {
        let answer = await prisma.Highlights.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delWord: async (args, context) => {
        let answer = await prisma.Words.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delTest: async (args, context) => {
        let answer = await prisma.Tests.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
    delQuestion: async (args, context) => {
        let answer = await prisma.Questions.delete({
            where: {
                id: parseInt(args.id)
            }
        });
        console.log(answer);
        return answer;
    },
};

function CheckFile (path, title) {
    if (fs.existsSync(path+title)) {
        let array = [], c = 0;
        title.split(/([().])/).filter(Boolean).forEach(e => e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push(e) : array.push(e));
        console.log("->"+array);
        let count = 1;
        if (array.length > 2) {
            count = parseInt(array[1]);
            count++;
        }
        return CheckFile(path, array[0]+'('+count+').pdf');
    } else {
        console.log("<-"+path+title);
        return path+title;
    }   
}

module.exports = resolver;
