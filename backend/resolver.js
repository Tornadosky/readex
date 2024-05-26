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
const pdfPoppler = require('pdf-poppler');

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
                where: {
                    user: {
                        id: args.user
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
                   pagenum: args.pagenum,
                   scaleFactor: args.scaleFactor
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
            const path = "./uploads/" + args.user + "/";
            const imagePath = "./uploads/" + args.user + "/images/";

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            if (!fs.existsSync(imagePath)) {
                fs.mkdirSync(imagePath);
            }

            console.log("setBook->create->CheckFile");
            let pathDB = CheckFile(path, args.title);
            console.log("+->"+pathDB);
            const baseName = pathDB.split('/').pop(); 
            console.log("+->"+baseName);
            fs.writeFileSync(pathDB, Buffer.from(args.document, 'base64'), 'binary');
            console.log("+->"+imagePath);
            const coverImagePath = await convertPdfToImage(pathDB, imagePath);
            upsertParams = {
                data: {
                    title: baseName,
                    author: args.author,
                    document: pathDB,
                    image: coverImagePath,
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
            //upsertParams.data.image = (args.image);
            
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
                    height: args.height,
                    scaleFactor: args.scaleFactor
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
                height: args.height,
                scaleFactor: args.scaleFactor
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
                            books: true,
                            collections: true
                        }
                    },
                    tests: {
                        include: {
                            tests: true,
                            collections: true
                        }
                    }
                }
            };
            args.title? upsertParams.data.title = (args.title) : null;
            args.books ? upsertParams.data.books = 
                {
                    create: {
                        books: {
                            connect: {
                                id: parseInt(args.books)
                            }
                        },
                        position: 0
                    }
            } : null;
            args.tests ? upsertParams.data.tests = 
                {
                    create: {
                        tests: {
                            connect: {
                                id: parseInt(args.tests)
                            }
                        },
                        position: 0
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
                upsertParams.data.boundingRect = { create: {}};
                upsertParams.data.boundingRect.create = {
                    pagenum: args.boundingRect.pagenum,
                    x1: args.boundingRect.x1,
                    y1: args.boundingRect.y1,
                    x2: args.boundingRect.x2,
                    y2: args.boundingRect.y2,
                    width: args.boundingRect.width,
                    height: args.boundingRect.height,
                    scaleFactor: args.boundingRect.scaleFactor
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
                            height: rect.height,
                            scaleFactor: rect.scaleFactor
                        }});
                    console.log(isrect);
                    if (isrect.length > 0)
                        return {
                            create: {
                                rects:{
                                    create: {
                                        pagenum: rect.pagenum,
                                        x1: rect.x1,
                                        y1: rect.y1,
                                        x2: rect.x2,
                                        y2: rect.y2,
                                        width: rect.width,
                                        height: rect.height,
                                        scaleFactor: rect.scaleFactor
                                    }
                            },
                            where: {
                                rectid_highlightid: {
                                    rectid: parseInt(isrect[0].id),
                                    highlightid: parseInt(args.id)
                                }
                            }}
                        };
                    else
                        return {
                            create: {
                                rects:{
                                    create: {
                                        pagenum: rect.pagenum,
                                        x1: rect.x1,
                                        y1: rect.y1,
                                        x2: rect.x2,
                                        y2: rect.y2,
                                        width: rect.width,
                                        height: rect.height,
                                        scaleFactor: rect.scaleFactor
                                    }
                                }
                            },
                            where: {
                                rectid_highlightid: {
                                    rectid: -1,
                                    highlightid: parseInt(args.id)
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
                    height: args.boundingRect.height,
                    scaleFactor: args.boundingRect.scaleFactor
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
                            height: rect.height,
                            scaleFactor: rect.scaleFactor
                        }});
                    console.log(isrect);
                    return {
                        rects:{
                            create: {
                                pagenum: rect.pagenum,
                                x1: rect.x1,
                                y1: rect.y1,
                                x2: rect.x2,
                                y2: rect.y2,
                                width: rect.width,
                                height: rect.height,
                                scaleFactor: rect.scaleFactor
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
        let upsertParams = {};
        if (args.id) {
            // Update logic
            upsertParams = {
                where: { id: parseInt(args.id) },
                data: {},
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true,
                    book: true  // Ensure book is included in response
                },
            };
    
            // Optional fields
            if (args.title) upsertParams.data.title = args.title;
            if (args.prompt) upsertParams.data.prompt = args.prompt;
            if (args.language) upsertParams.data.language = args.language;
            if (args.difficulty) upsertParams.data.difficulty = args.difficulty;
            if (args.questionCount) upsertParams.data.questionCount = args.questionCount;
            if (args.lastResult) upsertParams.data.lastResult = args.lastResult;
            if (args.result) upsertParams.data.result = args.result;
    
            // Update the Test
            const answer = await prisma.Tests.update(upsertParams);
            return answer;
    
        } else {
            // Creation logic
            upsertParams = {
                data: {
                    title: args.title,
                    prompt: args.prompt,
                    language: args.language,
                    difficulty: args.difficulty,
                    questionCount: args.questionCount,
                    lastResult: args.lastResult ?? 0,  // Use default if undefined
                    result: 0,
                    user: { connect: { id: args.user } },
                    book: args.book ? { connect: { id: args.book } } : undefined,  // Connect book if provided
                },
                include: {
                    user: true,
                    questions: true,
                    collections: true,
                    words: true,
                    book: true  // Ensure book is included in response
                }
            };
    
            // Create the Test
            const answer = await prisma.Tests.create(upsertParams);
            console.log(answer);
            return answer;
        }
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
        // Retrieve the book to get the document and image path
        const book = await prisma.Books.findUnique({
            where: {
                id: parseInt(args.id)
            },
            select: {
                document: true,  // Fetch the document field
                image: true      // Fetch the image field
            }
        });

        if (!book) {
            console.error("No book found with the given ID:", args.id);
            return null;  // or throw an error based on your error handling policy
        }

        // Attempt to delete the document and image files associated with the book
        try {
            if (book.document && fs.existsSync(book.document)) {
                fs.unlinkSync(book.document);
                console.log("Document file successfully deleted:", book.document);
            } else {
                console.warn("Document file not found, but will continue to delete the book record:", book.document);
            }

            if (book.image && fs.existsSync(book.image)) {
                fs.unlinkSync(book.image);
                console.log("Cover image successfully deleted:", book.image);
            } else {
                console.warn("Cover image not found, but will continue to delete the book record:", book.image);
            }
        } catch (error) {
            console.error("Failed to delete files:", error);
            throw new Error("Failed to delete the associated files.");
        }

        // Proceed to delete the book from the database
        try {
            const answer = await prisma.Books.delete({
                where: {
                    id: parseInt(args.id)
                }
            });
            console.log("Book deleted successfully:", answer);
            return answer;
        } catch (error) {
            console.error("Failed to delete the book:", error);
            throw new Error("Failed to delete the book from the database.");
        }
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
        // First, delete all related RectsOnHighlights entries
        await prisma.rectsOnHighlights.deleteMany({
            where: {
                highlightid: parseInt(args.id)
            }
        });

        // Now, delete the actual Highlight
        let answer = await prisma.Highlights.delete({
            where: {
                id: parseInt(args.id)
            }
        });

        // Optionally, you can also clean up any Rects that are no longer used
        await prisma.rects.deleteMany({
            where: {
                AND: [
                    { highlightbr: { none: {} } },
                    { highlightrects: { none: {} } }
                ]
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

    unlinkBook: async (args, context) => {
        let answer = await prisma.BooksOnCollections.delete({
            where: {
                bookid_collectionid: {
                    bookid: parseInt(args.bookid),
                    collectionid: parseInt(args.collectionid)
                }
            }
        });
        console.log(answer);
        return 1;
    },
    unlinkTest: async (args, context) => {
        let answer = await prisma.TestsOnCollections.delete({
            where: {
                testid_collectionid: {
                    testid: parseInt(args.testid),
                    collectionid: parseInt(args.collectionid)
                }
            }
        });
        console.log(answer);
        return 1;
    },
};

function CheckFile(path, title) {
    // Regular expression to check if the title ends with a pattern (number)
    const regex = /^(.*?)(\((\d+)\))?\.pdf$/;
    const match = title.match(regex);
  
    if (!match) {
        console.error("Filename does not match expected pattern:", title);
        return null; // or throw an error depending on your error handling strategy
    }
    console.log("Match:", match);

    const baseName = match[1]; // Base name without number
    let number = parseInt(match[3], 10) || 0; // Current number in the filename, if any

    let newName = title;
    console.log("Base name:", baseName);
    // Check if file exists and increment number until a new filename is found
    while (true) {
        console.log("Checking new filename:", path + newName)
        console.log("Exists:", fs.existsSync(path + newName));
        if (!fs.existsSync(path + newName)) {
            break;
        }
        number++; // Increment the file number
        newName = `${baseName}(${number}).pdf`;
        console.log(`Trying new filename: ${newName}`);
    }

    console.log("New unique path:", path + newName);
    return path + newName;
}

async function convertPdfToImage(pdfPath, outputDir) {
    let opts = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: 1
    };

    try {
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log('Converting PDF to image:', outputDir)
        console.log('Converting PDF to image:', opts.out_prefix)

        // Convert PDF to an image
        await pdfPoppler.convert(pdfPath, opts);

        // Regex to find the file with optional numeric suffix
        const regex = new RegExp(`^${opts.out_prefix.replace('(', '\\(').replace(')', '\\)')}(-\\d+)?\\.jpg$`);
        const files = fs.readdirSync(outputDir);
        console.log('Files:', files);

        let actualFileName;
        for (let file of files) {
            if (regex.test(file)) {
                actualFileName = file;
                break;
            }
        }

        if (!actualFileName) {
            throw new Error("Converted image file not found.");
        }

        const oldFilePath = path.join(outputDir, actualFileName);
        const newFilePath = path.join(outputDir, `${opts.out_prefix}.jpg`);

        // Rename the file if necessary
        if (oldFilePath !== newFilePath) {
            fs.renameSync(oldFilePath, newFilePath);
        }

        console.log('PDF converted to image:', newFilePath);
        return newFilePath;
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        throw error;
    }
}

module.exports = resolver;
