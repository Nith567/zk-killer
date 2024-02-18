import { NextResponse } from 'next/server';
import prismadb from '@/app/lib/db';


export async function POST(
    req
  ) {
    try {
      const body = await req.json();
  const { email,accessToken,refreshToken,eoa} = body;
      if(!email){
          return new NextResponse("email is required", { status: 400 });
      }
      if(!accessToken){
          return new NextResponse("tokens is required", { status: 400 });
      }
      if(!refreshToken){
          return new NextResponse("refreshtoken is required", { status: 400 });
      }
      if(!eoa){
          return new NextResponse("eoais required", { status: 404});
      }

      const profile = await prismadb.user.create({
               data: {
                email,
                accessToken,
                refreshToken,
                eoa
               }
          });
      return NextResponse.json(profile);
    } catch (error) {
      console.log('so theadd     ', error);
      return new NextResponse("Internal error:   ", { status: 500 });
    }
  };

  // export async function GET(req: Request) {
  //   try {
  //     const { userId } = auth();
  
  //     if (!userId) {
  //       return new NextResponse("Unauthorizeds", { status: 403 });
  //     }
  
  //     const pendingProfiles = await prismadb.user.findMany({
  //       where: {
  //         isApproved: false,
  //       },
  //     });
  //     return NextResponse.json(pendingProfiles);
  //   } catch (error) {
  //     console.error('Error fetching pending profiles:', error);
  //     return new NextResponse("Internal error", { status: 500 });
  //   }
  // }