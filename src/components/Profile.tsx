"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import QuizDashboard from './LiveQuizes';
import { 
  Github, 
  Linkedin, 
  Trash2, 
  Edit3, 
  Award, 
  Users, 
  User, 
  Calendar, 
  Activity, 
  Clock, 
  BookOpen,
  Code,
  Zap,
  Star,
  MessageCircle,
  Globe,
  TrendingUp,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = ({ user }:any) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: user.name || 'User Name',
    email: user.email || 'user@example.com',
    dob: user.dob || '',
    bio: user.bio || 'No bio added yet.',
    github: user.github || '',
    linkedin: user.linkedin || '',
    twitter: user.twitter || '',
    codingProfiles: user.codingProfiles || '',
    languages: user.languages || ['JavaScript', 'Python'],
    public: user.public || false,
    photo: user.image || '',
    experience: user.experience || 'Intermediate',
    interests: user.interests || ['Web Development', 'Algorithms']
  });
  
  // Mock data
  const quizzes = [
    { id: 1, title: 'JavaScript Fundamentals', date: '2025-04-05', score: 85, total: 100 },
    { id: 2, title: 'React Hooks Deep Dive', date: '2025-04-02', score: 92, total: 100 },
    { id: 3, title: 'Data Structures', date: '2025-03-28', score: 78, total: 100 },
  ];
  
  const friends = [
    { id: 1, name: 'Alex Kim', image: '/api/placeholder/64/64', status: 'online' },
    { id: 2, name: 'Sarah Chen', image: '/api/placeholder/64/64', status: 'offline' },
    { id: 3, name: 'Jordan Lee', image: '/api/placeholder/64/64', status: 'online' },
  ];
  
  const activities = [
    { id: 1, type: 'quiz', title: 'Completed "Advanced CSS" quiz', time: '2 hours ago' },
    { id: 2, type: 'friend', title: 'Connected with Jamie Smith', time: '1 day ago' },
    { id: 3, type: 'badge', title: 'Earned "JavaScript Pro" badge', time: '3 days ago' },
  ];
  
  const liveQuizzes = [
    { id: 1, title: 'TypeScript Mastery', participants: 24, startTime: '16:00 Today' },
    { id: 2, title: 'CSS Grid & Flexbox', participants: 18, startTime: 'Tomorrow, 14:30' },
    { id: 3, title: 'Algorithm Challenge', participants: 42, startTime: 'Apr 10, 19:00' },
  ];
  
  const stats = {
    quizzesTaken: 42,
    avgScore: 87,
    badges: 12,
    rank: 'Gold',
    followers: 156,
    following: 89,
    streak: 8
  };

  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => setProgress(stats.avgScore), 500);
    return () => clearTimeout(timer);
  }, [stats.avgScore]);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePublic = () => {
    setFormData({ ...formData, public: !formData.public });
  };

  const handlePhotoUpload = (e:any) => {
    const file = e.target.files[0];
    // handle uploading logic here
    console.log('Photo uploaded:', file);
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };
  
  const confirmDelete = () => {
    console.log('Account deleted');
    setShowConfirmDelete(false);
    // Actual delete logic would go here
  };

  const handleSave = () => {
    setEditMode(false);
    // save data to backend logic
    console.log('Saving profile:', formData);
  };
  
  // const addInterest = (interest) => {
  //   if (!formData.interests.includes(interest)) {
  //     setFormData({ 
  //       ...formData, 
  //       interests: [...formData.interests, interest] 
  //     });
  //   }
  // };
  
  // const removeInterest = (interest) => {
  //   setFormData({
  //     ...formData,
  //     interests: formData.interests.filter(i => i !== interest)
  //   });
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid grid-cols-5 w-2/3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
              
              {activeTab === "profile" && !editMode && (
                <Button onClick={() => setEditMode(true)} variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}
            </div>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4 flex flex-col items-center bg-white dark:bg-gray-800 shadow-md">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg"
                  >
                    <Image
                      src={formData.photo || '/api/placeholder/128/128'}
                      alt="User Photo"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  
                  {editMode && (
                    <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="mt-4 w-full" />
                  )}
                  
                  <h2 className="text-2xl font-bold mt-4">{formData.name}</h2>
                  <p className="text-gray-500">{formData.email}</p>
                  
                  <div className="mt-4 flex items-center">
                    <Switch checked={formData.public} onCheckedChange={handleTogglePublic} disabled={!editMode} />
                    <span className="ml-2 text-sm">Public Profile</span>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        <Star className="w-3 h-3 mr-1" /> {stats.rank}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        <Zap className="w-3 h-3 mr-1" /> Streak: {stats.streak} days
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Followers</p>
                        <p className="text-xl font-bold">{stats.followers}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Following</p>
                        <p className="text-xl font-bold">{stats.following}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="col-span-2 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal and professional details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Bio</label>
                          <Input 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            placeholder="Tell us about yourself" 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Date of Birth</label>
                          <Input 
                            name="dob" 
                            type="date" 
                            value={formData.dob} 
                            onChange={handleChange} 
                            className="mt-1" 
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Experience Level</label>
                          <select 
                            name="experience" 
                            value={formData.experience} 
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">GitHub</label>
                            <Input 
                              name="github" 
                              value={formData.github} 
                              onChange={handleChange} 
                              placeholder="GitHub URL" 
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">LinkedIn</label>
                            <Input 
                              name="linkedin" 
                              value={formData.linkedin} 
                              onChange={handleChange} 
                              placeholder="LinkedIn URL" 
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Twitter/X</label>
                          <Input 
                            name="twitter" 
                            value={formData.twitter} 
                            onChange={handleChange} 
                            placeholder="Twitter/X URL" 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Coding Profiles</label>
                          <Input
                            name="codingProfiles"
                            value={formData.codingProfiles}
                            onChange={handleChange}
                            placeholder="LeetCode / Codeforces / etc"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
                          <Button variant="secondary" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                          
                          <Button variant="destructive" onClick={handleDelete} className="ml-auto">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Bio</h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{formData.bio}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium">Personal</h3>
                            <div className="mt-2 space-y-2">
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4" /> 
                                <span>Birth Date:</span> {formData.dob || 'Not set'}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Code className="w-4 h-4" /> 
                                <span>Experience:</span> {formData.experience}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium">Professional</h3>
                            <div className="mt-2 space-y-2">
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Github className="w-4 h-4" /> 
                                <a href={formData.github} className="text-indigo-600 hover:underline">{formData.github || 'Not set'}</a>
                              </p>
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Linkedin className="w-4 h-4" /> 
                                <a href={formData.linkedin} className="text-indigo-600 hover:underline">{formData.linkedin || 'Not set'}</a>
                              </p>
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Globe className="w-4 h-4" />
                                <a href={formData.twitter} className="text-indigo-600 hover:underline">{formData.twitter || 'Not set'}</a>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Coding Profiles</h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{formData.codingProfiles || 'Not set'}</p>
                        </div>
                        
                        
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader>
                    <CardTitle>Your Stats</CardTitle>
                    <CardDescription>Overview of your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Average Score</span>
                          <span className="text-sm font-medium">{stats.avgScore}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-center">
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{stats.quizzesTaken}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Quizzes Taken</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{stats.badges}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Badges Earned</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-300">{stats.streak} days</p>
                        </div>
                        <div className="flex">
                          {Array(7).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-3 mx-0.5 rounded-full ${
                                i < stats.streak % 7 ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Quiz Performance</CardTitle>
                    <CardDescription>Your latest quiz results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quizzes.map(quiz => (
                        <div key={quiz.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{quiz.title}</h4>
                              <p className="text-sm text-gray-500">{quiz.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{quiz.score}/{quiz.total}</p>
                              <p className="text-sm text-gray-500">
                                {(quiz.score / quiz.total * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress value={(quiz.score / quiz.total) * 100} className="h-1" />
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full mt-4">
                        View All Quiz Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle>Skill Progress</CardTitle>
                  <CardDescription>Track your improvement in different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Frontend</h4>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>HTML/CSS</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>JavaScript</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>React</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-1 mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Backend</h4>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Node.js</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Databases</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>API Design</span>
                          <span>80%</span>
                        </div>
                        <Progress value={80} className="h-1 mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Computer Science</h4>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Algorithms</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Data Structures</span>
                          <span>82%</span>
                        </div>
                        <Progress value={82} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>System Design</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quizzes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Live Quizzes</CardTitle>
                  <CardDescription>Join interactive coding challenges</CardDescription>
                </CardHeader>
                <QuizDashboard/>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Your Quiz History</CardTitle>
                  <CardDescription>Review your past quiz performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quizzes.map(quiz => (
                      <div key={quiz.id} className="flex items-center justify-between p-2 border-b last:border-0">
                        <div>
                          <h4 className="font-medium">{quiz.title}</h4>
                          <p className="text-xs text-gray-500">{quiz.date}</p>
                        </div>
                        <Badge className={`${
                          quiz.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          quiz.score >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
                          {quiz.score}%
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">View All History</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Recommended Quizzes</CardTitle>
                  <CardDescription>Based on your skills and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <h4 className="font-medium">Advanced React Patterns</h4>
                      <div className="flex mt-1 text-sm text-gray-500">
                        <span className="flex items-center mr-3">
                          <Clock className="w-3 h-3 mr-1" /> 30 mins
                        </span>
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" /> Medium
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 w-full">Start Quiz</Button>
                    </div>
                    
                    <div className="p-3 border rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <h4 className="font-medium">Data Structure Challenges</h4>
                      <div className="flex mt-1 text-sm text-gray-500">
                        <span className="flex items-center mr-3">
                          <Clock className="w-3 h-3 mr-1" /> 45 mins
                        </span>
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" /> Hard
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 w-full">Start Quiz</Button>
                    </div>
                    
                    <div className="p-3 border rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <h4 className="font-medium">CSS Flexbox Mastery</h4>
                      <div className="flex mt-1 text-sm text-gray-500">
                        <span className="flex items-center mr-3">
                          <Clock className="w-3 h-3 mr-1" /> 20 mins
                        </span>
                        <span className="flex items-center">
                          <Award className="w-3 h-3 mr-1" /> Easy
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 w-full">Start Quiz</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Friends</CardTitle>
                  <CardDescription>Connect with other users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.map(friend => (
                      <div key={friend.id} className="flex items-center p-3 border rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <Image src={friend.image} alt={friend.name} width={40} height={40} className="rounded-full mr-3" />
                        <div className="flex-grow">
                          <p className="font-medium">{friend.name}</p>
                          <p className={`text-sm ${friend.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                            {friend.status.charAt(0).toUpperCase() + friend.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
  )}
              
export default Profile;