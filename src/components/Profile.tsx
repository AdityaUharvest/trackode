"use client"
import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Github, 
  Linkedin, 
  Edit3, 
  Calendar,
  Globe,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AllQuizes from './AllQuizes';
import QuizDashboard from './LiveQuizes';

const Profile = ({ user }: any) => {
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    dob: user.dob || '',
    college: user.college || '',
    branch: user.branch || '',
    year: user.year || '',
    leetcode: user.leetcode || '',
    github: user.github || '',
    linkedin: user.linkedin || '',
    twitter: user.twitter || '',
    interests: user.interests || [],
    languages: user.languages || [],
    public: user.public || true,
    image: user.image 
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target;
    const values = value.split(',').map(v => v.trim());
    setFormData({ ...formData, [field]: values });
  };

  const handleSave = async () => {
    const userId = user._id; // Assuming user._id is the ID of the user
    const updatedData = { ...formData, userId };
    try {
      const response = await axios.put('/api/profile-update', { 
        updatedData,
      });
      // Handle success response here
      //change the state
      setEditMode(false);
      setFormData(updatedData); // Update the form data with the response data
      console.log(response);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Mock quizzes data
  const quizzes = [
    { id: 1, title: 'JavaScript Fundamentals', date: '2025-04-05', score: 85, total: 100 },
    { id: 2, title: 'React Hooks Deep Dive', date: '2025-04-02', score: 92, total: 100 },
    { id: 3, title: 'Data Structures', date: '2025-03-28', score: 78, total: 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile</CardTitle>
                  <Button 
                    onClick={() => setEditMode(!editMode)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> 
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg mb-4"
                  >
                    <img
                      src={formData.image}
                      alt="User Photo"
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                  
                  {editMode ? (
                    <div className="w-full space-y-4">
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full"
                      />
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full"
                      />
                      <Input
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="w-full"
                      />
                      <Input
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="College"
                        className="w-full"
                      />
                      <Input
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        placeholder="Branch"
                        className="w-full"
                      />
                      <Input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="Year"
                        className="w-full"
                      />
                      <Button 
                        onClick={handleSave}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{formData.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
                      <p className="mt-2 text-sm">{formData.bio}</p>
                      <div className="mt-4 space-y-1 text-sm">
                        {formData.college && <p>🎓 {formData.college}</p>}
                        {formData.branch && <p>📚 {formData.branch} /📅 {formData.year} year</p>}
                        {formData.dob && <p>📅 {formData.dob}</p>}

                        
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Social Links</h3>
                  {editMode ? (
                    <div className="space-y-2">
                      <Input
                        name="leetcode"
                        value={formData.leetcode}
                        onChange={handleChange}
                        placeholder="LeetCode URL"
                        className="w-full"
                      />
                      <Input
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        className="w-full"
                      />
                      <Input
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        className="w-full"
                      />
                      <Input
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        placeholder="Twitter URL"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.leetcode && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={formData.leetcode} className="text-indigo-600 hover:underline truncate">
                            LeetCode
                          </a>
                        </div>
                      )}
                      {formData.github && (
                        <div className="flex items-center text-sm">
                          <Github className="w-4 h-4 mr-2" />
                          <a href={formData.github} className="text-indigo-600 hover:underline truncate">
                            GitHub
                          </a>
                        </div>
                      )}
                      {formData.linkedin && (
                        <div className="flex items-center text-sm">
                          <Linkedin className="w-4 h-4 mr-2" />
                          <a href={formData.linkedin} className="text-indigo-600 hover:underline truncate">
                            LinkedIn
                          </a>
                        </div>
                      )}
                      {formData.twitter && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          <a href={formData.twitter} className="text-indigo-600 hover:underline truncate">
                            Twitter
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Skills & Interests</h3>
                  {editMode ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.languages.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'languages')}
                        placeholder="Languages (comma separated)"
                        className="w-full"
                      />
                      <Input
                        value={formData.interests.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'interests')}
                        placeholder="Interests (comma separated)"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((lang: string, i: number) => (
                        <Badge key={i} variant="outline">{lang}</Badge>
                      ))}
                      {formData.interests.map((interest: string, i: number) => (
                        <Badge key={i} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  )}
                  
                </div>
                
              </CardContent>
            </Card>

            {/* Quizzes Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle>Free Avaialable Quizzes</CardTitle>
                  <CardDescription>Recent quiz and results</CardDescription>
                </CardHeader>
                <CardContent>
                 <QuizDashboard/>
                </CardContent>
              </Card>

              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;