import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const dbeliq = await prisma.user.create({
    data: {
      id: -1,
      email: 'dbelium@gmail.com',
      name: 'Dbeliq',
      password: 'test123',
      icon: '/src/assets/whatsapp.jpg',
      ownedGuilds: {
        create: [
          {
            id: -1,
            name: 'Pamela Server',
            icon: '/src/assets/whatsapp.jpg',
            channels: {
              create: {
                name: 'General',
                messages: {
                  create: {
                    senderId: -1,
                    content: "There's plenty of seeding left!",
                  },
                },
              },
            },
          },
          {
            id: -2,
            name: 'Raccoon Den',
            icon: '/src/assets/racc.jpeg',
            channels: {
              create: [
                {
                  name: 'RACCOONS',
                  messages: {
                    create: [
                      {
                        senderId: -1,
                        content: 'i kinda like this server more than the other one!',
                      },
                      {
                        senderId: -1,
                        content: 'although i dont mind the other one tbh',
                      },
                    ],
                  },
                },
                {
                  name: 'secret raccoon channel',
                  messages: {
                    create: [
                      {
                        senderId: -1,
                        content: '*insert very big raccoon secret*',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      joinedGuilds: {
        create: [{ guildId: -1 }, { guildId: -2 }],
      },
    },
  });

  const raccford = await prisma.user.create({
    data: {
      id: -2,
      email: 'raccford@gmail.com',
      name: 'Sir Raccford IV',
      password: 'test123',
      icon: '/src/assets/racc.jpeg',
      friends: {
        connect: {
          id: dbeliq.id,
        },
      },
      friendsOf: {
        connect: {
          id: dbeliq.id,
        },
      },
    },
  });

  const channel = await prisma.directChannel.create({
    data: {
      users: {
        create: [{ user: { connect: { id: dbeliq.id } } }, { user: { connect: { id: raccford.id } } }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
