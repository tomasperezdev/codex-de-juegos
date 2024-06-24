import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcryptjs';

export async function GET(request: Request) { 

  await prisma.todo.deleteMany(); // delete * from todo
  await prisma.user.deleteMany(); // delete * from todo
  await prisma.game.deleteMany(); // delete * from todo

  const user = await prisma.user.create({
    data: {
      email: 'test1@google.com',
      password: bcrypt.hashSync('123456'),
      roles: ['admin','client','super-user','patron'],
      todos: {
        create: [
          { description: 'Piedra del alma', complete: true },
          { description: 'Piedra del poder' },
          { description: 'Piedra del tiempo' },
          { description: 'Piedra del espacio' },
          { description: 'Piedra del realidad' },
        ]
      },
      games:{
        create: [
          { name: 'Wyrmspan', downloaded: true, logo: 'https://cf.geekdo-images.com/oXUkkh9uq3zBVWQ8mbgMfQ__itemrep/img/9dm6ilQ3k0A_Vet3m3cfAGEo3RU=/fit-in/246x300/filters:strip_icc()/pic7947338.png' },
          { name: 'Avalon', downloaded: false , logo: 'https://cf.geekdo-images.com/LPa6rsGcv8S0-OeNjCOAEQ__itemrep/img/KtGX_JFWNUXci7H5zs7GjS0QrQk=/fit-in/246x300/filters:strip_icc()/pic1398895.jpg' },
          { name: 'Villainous', downloaded: false, logo: 'https://cf.geekdo-images.com/7Ej5V5Dq92QdvVFvISfl_A__itemrep/img/8AB1vzgoW_X904IEYJl2eib9T10=/fit-in/246x300/filters:strip_icc()/pic4216110.jpg' },
          { name: 'Catan', downloaded: false, logo: 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__itemrep/img/IzYEUm_gWFuRFOL8gQYqGm5gU6A=/fit-in/246x300/filters:strip_icc()/pic2419375.jpg' },
          { name: 'Exploding Kittens', downloaded: false, logo: 'https://cf.geekdo-images.com/N8bL53-pRU7zaXDTrEaYrw__itemrep/img/ON0bQporMQQ9KJlVC2UP8LAa_WI=/fit-in/246x300/filters:strip_icc()/pic2691976.png' },
        ]
      
      }
    }
  });
  

  return NextResponse.json({ message: 'Seed Executed' });
}