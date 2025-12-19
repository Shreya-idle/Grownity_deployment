import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Bell, Key, Lock, Plus } from "lucide-react";

export default function Settings() {
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [achievements, setAchievements] = useState("");

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    setDob(newDob);
    if (newDob) {
      const birthDate = new Date(newDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  const handleUpdateProfile = () => {
    // Handle the profile update logic here
    console.log({
      gender,
      dob,
      age,
      resume,
      achievements,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="w-64 flex-shrink-0 border-r border-border p-6">
        <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex items-center justify-between">

                <Button data-testid="button-add-community">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Community
                </Button>
              </div></div>
      </aside>
      <main className="flex-1 p-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Profile Information</h1>
          <p className="text-muted-foreground mb-8">
            Update your account profile details and public avatar.
          </p>
          <Card className="p-8">
            <div className="flex items-center gap-6 mb-8">
              <img
                src="https://github.com/shadcn.png"
                alt="Avatar"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <Button>Change Avatar</Button>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" defaultValue="Alex Chen" disabled />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@alexc" disabled />
                <p className="text-sm text-muted-foreground mt-2">
                  Usernames cannot be changed.
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="alex.chen@example.com"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" value={age !== null ? age : ""} disabled />
              </div>
              <div>
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" type="file" onChange={handleResumeChange} />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Tell us about your achievements"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
