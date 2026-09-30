// src/pages/admin/LoginPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login();
  };

  let navigate = useNavigate();
  let api = import.meta.env.VITE_API_URL;


  let login = async () => {
    try {
      let res = await axios.post(`${api}/api/admin/login`, { username, password }, { withCredentials: true })
      if (!res.data.success) {
        navigate('/admin/login')
      }
      navigate('/admin')
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)

    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}