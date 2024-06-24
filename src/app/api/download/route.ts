
import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import * as yup from 'yup';
import fs from 'fs';
import path from 'path';

const postSchema = yup.object({
  gameToDownload: yup.string().required(),
  id: yup.string().required(),
});

export async function POST(request: Request) { 

  try {
    const filePath = path.join(process.cwd(), 'downloads', 'rulebooksDownloaded.json');
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist')
      fs.writeFileSync(filePath, '{}');
    }
    else{
      console.log('File does exist', filePath)
    }
    const { gameToDownload, id } = await postSchema.validate( await request.json() );
    const urls = [
      `https://firebasestorage.googleapis.com/v0/b/codex-de-juegos.appspot.com/o/${gameToDownload}.json?alt=media`,
    ];
    const jsonData = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }
        return response.json();
      })
    );

  
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const dataToSave = {[gameToDownload]: jsonData[0]};

    const updatedData = {...existingData, ...dataToSave};

    const updateGame = await prisma.game.update({
      where: { id: id },
      data: { downloaded: true }
    })

     // Write the updated data back to the file
     fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json(updateGame);
    
  } catch (error) {
    return NextResponse.json( error, { status: 400 } );
  }
}
