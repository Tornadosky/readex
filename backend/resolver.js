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
            console.log("in Books->args.title");
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
                where: {
                    id: parseInt(args.id)
                },
                include: {
                    user: true
                }
            });
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
                    from: true,
                    to: true
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
                    from: true,
                    to: true
                }
            });
        } else {
            answer = await prisma.Highlights.findMany({
                include: {
                    book: true,
                    user: true,
                    from: true,
                    to: true
                }});
        }
        console.log(answer);
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
                    books: true,
                    tests: true,
                    user: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Collections.findMany({
                where: {
                    id: args.id
                },
                include: {
                    books: true,
                    tests: true,
                    user: true
                }
            });
        } else {
            answer = await prisma.Collections.findMany({
                include: {
                    books: true,
                    tests: true,
                    user: true
                }});
        }
        console.log(answer);
        return answer;
    },
    Positions: async (args, context) => {
        let answer = null;
        answer = await prisma.Positions.findUnique({
            where: {
                id: args.id
            }
        });
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
                        openedBooks: true,
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
                        openedBooks: true,
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
                        openedBooks: true,
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
                        openedBooks: true,
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
                        openedBooks: true,
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
                        openedBooks: true,
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else if (args.id) {
                answer = await prisma.Users.findUnique({
                    where: {
                        id: parseInt(args.id)
                    },
                    include: {
                        openedBooks: true,
                        collections: true,
                        achievements: true,
                        words: true
                    }
                });
            } else {
                answer = await prisma.Users.findMany({
                    include: {
                        openedBooks: true,
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
                    user: true
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
                    user: true
                }
            });
        } else if (args.id) {
            answer = await prisma.Achievements.findUnique({
                where: {
                    selectid: parseInt(args.id)
                },
                include: {
                    user: true
                }
            });
        } else {
            answer = await prisma.Achievements.findMany({
                include: {
                    user: true
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
                    collections: true
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
                    collections: true
                }
            });
        } else {
            answer = await prisma.Tests.findMany({
                include: {
                    user: true,
                    questions: true,
                    collections: true
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
            args.openedBooks ? upsertParams.data.openedBooks = {
                connect: {
                    id: {
                        in: args.books //array of ids
                        }
                }
            } : null ;
            upsertParams.where = {
                id: args.id
            };
            upsertParams.include = {
                openedBooks: true,
                collections: true,
                achievements: true,
                words: true
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
            console.log("setBook->update");
            upsertParams = {
                data: {
                    uploaded: moment().format('yyyy-mm-dd:hh:mm:ss'),
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
            answer = await prisma.Books.update(upsertParams);
        } else {
            console.log("setBook->create");
            // Ask M&W if ids as folders names are ok or make nicknames
            let path = "./uploads/"+args.user+"/";

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }

            fs.writeFileSync(path+args.title, Buffer.from(args.document, 'base64'), 'binary');
            
            upsertParams = {
                data: {
                    title: args.title,
                    author: args.author,
                    document: path+args.title,
                    uploaded: moment().format('yyyy-mm-dd:hh:mm:ss'),
                    user: {
                        connect: {
                            id: args.user
                        }
                    },
                    openedBooks: {
                        connect: {
                           id: args.user  
                        }
                    }
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
                data: {}
            };
            upsertParams.data.name = (args.name);
            upsertParams.data.description = (args.description);
            args.users ? upsertParams.data.users = {
                create: {
                    user: {
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
                }
            };
            answer = await prisma.Achievements.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setPosition: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {}
            };
            args.page ? upsertParams.data = {
                    page: args.page,
                    line: args.line,
                    symbol: args.symbol
                } : args.coordinateX ? upsertParams.data = {
                    coordinateX: args.coordinateX,
                    coordinateY: args.coordinateY
                } : null;
            upsertParams.where = {
                id: args.id
            };
            answer = await prisma.Positions.update(upsertParams);
        } else {
            upsertParams = {
                data: {}
            };
            args.page ? upsertParams.data = {
                    page: args.page,
                    line: args.line,
                    symbol: args.symbol
                } : args.coordinateX ? upsertParams.data = {
                    coordinateX: args.coordinateX,
                    coordinateY: args.coordinateY
                } : null;
            answer = await prisma.Positions.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setCollection: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams = {
                data: {}
            };
            upsertParams.data.title = (args.title);
            args.books ? upsertParams.data.books = {
                connect: {OR: args.books.map(bookId => ({ book: { connect: {id: bookId}} }))}
            } : null;
            args.tests ? upsertParams.data.tests = {
                connectOrCreate: {
                    tests: {
                        create: {
                            where: {
                                id: {
                                        in: args.tests
                                    }
                            }
                        }
                    }                    
                }
            } : null;
            upsertParams.where = {
                id: parseInt(args.id)
            };
            upsertParams.include = {
                user: true,
                books: true,
                tests: true
            }
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
                    user: true,
                    books: true,
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
                    from: { create: {}},
                    to: { create: {}},
                },
                include: {
                    user: true,
                    book: true,
                    from: true,
                    to: true
                }
            };
            args.from.page ? upsertParams.data.from.create = {
                    page: args.from.page,
                    line: args.from.line,
                    symbol: args.from.symbol
                } : args.from.coordinateX ? upsertParams.data.from.create = {
                    coordinateX: args.from.coordinateX,
                    coordinateY: args.from.coordinateY
                } : null;
            args.to.page ? upsertParams.data.to.create = {
                    page: args.to.page,
                    line: args.to.line,
                    symbol: args.to.symbol
                } : args.to.coordinateX ? upsertParams.data.to.create = {
                    coordinateX: args.to.coordinateX,
                    coordinateY: args.to.coordinateY
                } : null;
            upsertParams.data.title = (args.title);
            upsertParams.data.text = (args.text);
            upsertParams.data.color = (args.color);
            upsertParams.where = {
                id: parseInt(args.id)
            };
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
                    from: { create: {}},
                    to: { create: {}},
                },
                include: {
                    user: true,
                    book: true,
                    from: true,
                    to: true
                }
            };
            args.from.page ? upsertParams.data.from.create = {
                    page: args.from.page,
                    line: args.from.line,
                    symbol: args.from.symbol
                } : args.from.coordinateX ? upsertParams.data.from.create = {
                    coordinateX: args.from.coordinateX,
                    coordinateY: args.from.coordinateY
                } : null;
            args.to.page ? upsertParams.data.to.create = {
                    page: args.to.page,
                    line: args.to.line,
                    symbol: args.to.symbol
                } : args.to.coordinateX ? upsertParams.data.to.create = {
                    coordinateX: args.to.coordinateX,
                    coordinateY: args.to.coordinateY
                } : null;
            upsertParams.data.title = (args.title);
            upsertParams.data.text = (args.text);
            upsertParams.data.color = (args.color);
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
            args.title ? upsertParams.data.title = args.title : null;
            args.prompt ? upsertParams.data.prompt = args.prompt : null;
            args.language ? upsertParams.data.language = args.language : null;
            args.difficulty ? upsertParams.data.difficulty = args.difficulty : null;
            upsertParams.where = {
                id: parseInt(args.id)
            };
            upsertParams.include = {
                user: true,
                questions: true,
                collections: true
            };
            answer = await prisma.Tests.update(upsertParams);
        } else {
            upsertParams = {
                data: {
                    title: args.title,
                    prompt: args.prompt,
                    language: args.language,
                    difficulty: args.difficulty,
                    user: {
                        connect: {
                            id: args.user
                        }
                    }
                },
                include: {
                    user: true,
                    questions: true,
                    collections: true
                }
            };
            answer = await prisma.Tests.create(upsertParams);
        }
        console.log(answer);
        return answer;
    },
    setQuestion: async (args, context) => {
        let upsertParams = null;
        let answer = null;
        if (args.id) {
            upsertParams.data = {};
            upsertParams.data.answers = (args.answers);
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
    delPosition: async (args, context) => {
        let answer = await prisma.Positions.delete({
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

module.exports = resolver;
