import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const SignIn = () => {
    const {  login, register, } = useAuth();
    
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="w-full  mt-10 p-6 bg-white flex items-center flex-col h-full justify-center  rounded-lg shadow-md" 
    style={{
      marginTop: "40px",
    }}
     >
        <h1 className="text-2xl  font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isLogin) {
              await login(email, password);
            } else {
              await register(email, name, password);
            }
          }}
          className="space-y-4"
        >
          <div className="w-[450px]">
            <label className="block text-sm font-medium text-gray-700" style={{
              color: "#374151",
              fontSize: "16px",
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
              style={{
              borderColor: "#d1d5db",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700" style={{
              color: "#374151",
              fontSize: "16px",
            }}>Name</label>
              <input
                type="text" 
                  style={{
              borderColor: "#d1d5db",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700" style={{
              color: "#374151",
              fontSize: "16px",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
              minLength={6}
                style={{
              borderColor: "#d1d5db",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
            />
          </div>
          <div className="flex flex-wrap justify-between items-center">

          <Button type="submit" className="w-fit flex items-center text-center" style={{
            color: "#000",
            backgroundColor: "#fff",
          }}>
            {isLogin ? 'Login' : 'Register'}
          </Button>
      
        {isLogin ? (
          <p
          style={{
            color: "#000",
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
          Need an account? {' '}
          <span 
          style={{
            color: "#000",
          }}
          className="cursor-pointer underline"
          onClick={() => setIsLogin(!isLogin)}
          >Register</span>
        </p>
        ) : (
          <p
          style={{
            color: "#000",
          }}
          className="mt-4 text-sm text-blue-600 hover:!text-blue-800"
          >
          Have an account? {' '}
          <span 
          style={{
            color: "#000",
          }}
          className="cursor-pointer underline"
          onClick={() => setIsLogin(!isLogin)}
          >Login</span>
        </p>
        )}
        </div>
        </form>
      </div>
  )
}

export default SignIn
