'use client'
import { useEffect, useState } from 'react';
import useMoonSDK  from "@/hooks/moon"
import { toast } from "react-hot-toast"
function SignupPage() {
  const { moon, initialize, disconnect } = useMoonSDK();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleSignup = async () => {
    try {
      if (!moon) {
        toast.error("User not authenticated")
        console.error('User not authenticated');
        return;
      }
      const message = await moon.getAuthSDK().emailSignup({
        email,
        password,
      });
      toast.success("succesfully created ")
      console.log(message);

    } catch (error) {
      console.error(error);
      toast.error('invalid email or password')
    }
  };

  useEffect(() => {
    initialize();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Create An Account</h2>
    <form className="flex flex-col space-y-4">
      <label htmlFor="email" className="text-sm">
        Email: 
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2"
        />
      </label>
      <label htmlFor="password" className="text-sm">
        Password: 
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
        />
      </label>
      <button
        type="button"
        onClick={handleSignup}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
      >
        Sign up
      </button>
    </form>
  </div>
  
  );
}

export default SignupPage;