import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import prisma from "@/app/lib/prisma";
const refreshTokenApiCall = async (token) => {
    const url = 'https://vault-api.usemoon.ai/auth/refresh-token';
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "refresh-token": token.refreshToken
        }
    })
    const formData = new URLSearchParams();
    formData.append('refreshToken', token.refreshToken);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://vault-api.usemoon.ai/auth/refresh-token',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data :formData
      };
      const response = await axios.request(config);
    //   console.log(JSON.stringify(response.data));
    if(response.data) {
        return {
            ...token,
            error: null,
            accessToken: response?.data?.accessToken,
        }
    } else {
        return {
            error: "RefreshTokenTokenError"
        }
    }

}

const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          async authorize(credentials, req) {
            const url = process.env.NEXT_PUBLIC_API_URL + '/email/login';
            try {
                const response = await axios.post('https://vault-api.usemoon.ai/auth/email/login', {
                  email: credentials.email,
                  password: credentials.password
                });
              const user=response.data;
                if (response.data.error) {
                  setError('email', { message: `Error: ${response.data.error}`, type: 'error' });
                } else {
                  console.log('No error');
                  return user;
                }
              } catch (error) {
                console.log("pulak", error);
              }
          }
        })
      ],
      callbacks: {
        async session({ session, token, user }) {
            session.accessToken = token?.accesstoken;
            session.refreshToken=token?.refreshToken;
            console.log(" lucku ",session)
            let config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: 'https://vault-api.usemoon.ai/auth/profile',
              headers: {
                'Authorization': `Bearer ${session?.accessToken}`
              }
            };
          
            try {
              const response = await axios.request(config);
          
              // Assuming response.data has properties like 'username' and 'email'
              session.user.name = response?.data.username;
              session.user.email = response?.data.email;
          
              console.log('sui ', response?.data);
          
              return session;
            } catch (error) {
              console.error(error);
              throw error; // Propagate the error if needed
            }
          }
,          
        async jwt({ token,user}) {
       if(user){
        token.refreshToken=user?.refreshToken;
        token.accesstoken=user?.token
        token.expiry=user.expiry
       }
       console.log(token)
       if(Date.now() < token.expiry) {
        return token;
    }
    return await refreshTokenApiCall(token)
        }
      },
      
      pages: {
        signIn: '/auth/login',
      }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }