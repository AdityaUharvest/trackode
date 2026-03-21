"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash, Edit, CheckCircle, XCircle, Newspaper, Save, Search, Loader2, Sparkles, Wand2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [currentBlog, setCurrentBlog] = useState<any>({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "Technology",
    published: false,
    author: "Aditya Upadhyay"
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiTopic) {
      toast.error("Please enter a topic for AI generation");
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("AI is crafting your masterpiece...");
    try {
      const prompt = `
        You are an expert technical blogger and SEO specialist.
        Generate a complete blog post on the topic: "${aiTopic}" for the category: "${currentBlog.category}".
        Requirements:
        1. Output MUST be in valid JSON format.
        2. Format: {"title": "...", "description": "...", "content": "..."}
        3. Title must be catchy and SEO-ready.
        4. Description must be a compelling meta-summary (~150 chars).
        5. Content must be deep, professional, and formatted in HTML (<h2>, <p>, <strong>, <ul>, <li>).
        6. Tone should be expert yet encouraging for students.
        
        Important: Return ONLY the raw JSON object, no markdown code blocks.
      `;

      const res = await fetch("/api/chat-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        const cleanContent = data.instructions
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
          
        const blogData = JSON.parse(cleanContent);
        setCurrentBlog({
          ...currentBlog,
          title: blogData.title,
          description: blogData.description,
          content: blogData.content,
          slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
        toast.success("Blog generated successfully!", { id: toastId });
        setAiTopic("");
      } else {
        toast.error("AI Generation failed. Try again.", { id: toastId });
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("AI returned invalid format. Try a simpler topic.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBlog),
      });

      if (res.ok) {
        toast.success(isEditing ? "Blog updated" : "Blog created");
        setCurrentBlog({ title: "", slug: "", description: "", content: "", category: "Technology", published: false, author: "Aditya Upadhyay" });
        setIsEditing(false);
        fetchBlogs();
      } else {
        const err = await res.json();
        toast.error(err.message || "Error saving blog");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Newspaper className="text-indigo-500" /> Content Engine
          </h2>
          <p className="text-slate-500 text-sm font-medium">Manage your educational articles and SEO content.</p>
        </div>
        <button 
          onClick={() => { setIsEditing(false); setCurrentBlog({ title: "", slug: "", description: "", content: "", category: "Technology", published: false, author: "Aditya Upadhyay" }); }}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Create Blog
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 h-fit sticky top-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Edit className="w-5 h-5 text-indigo-500" /> {isEditing ? "Modify Post" : "Quick Compose"}
          </h3>
          
          {/* AI Generator Integration */}
          {!isEditing && (
            <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 space-y-3">
               <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Magic AI Generator</span>
               </div>
               <input 
                  type="text" 
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Enter a topic (e.g. Master TCS NQT)"
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-white/50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold"
               />
               <button 
                  disabled={isGenerating}
                  onClick={generateWithAI}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50"
               >
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  Generate Content
               </button>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
              <input 
                type="text" 
                value={currentBlog.title}
                onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                placeholder="Ex: TCS NQT Preparation Guide"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description</label>
              <textarea 
                value={currentBlog.description}
                onChange={(e) => setCurrentBlog({...currentBlog, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none h-20 text-sm font-medium transition-all"
                placeholder="Brief summary for Google results..."
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Body (HTML supported)</label>
                <button type="button" onClick={() => setIsPreviewOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
              <textarea 
                value={currentBlog.content}
                onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none h-48 font-mono text-xs transition-all"
                placeholder="<p>Main content goes here...</p>"
                required
              />
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <input 
                type="checkbox" 
                checked={currentBlog.published} 
                className="w-4 h-4 rounded-md accent-indigo-600"
                onChange={(e) => setCurrentBlog({...currentBlog, published: e.target.checked})}
                id="pub-check"
              />
              <label htmlFor="pub-check" className="text-xs font-bold text-slate-600 dark:text-slate-300">Publish as Live Article</label>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/10">
              <Save className="w-4 h-4 inline mr-2" /> {isEditing ? "Update Database" : "Publish to Trackode"}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 gap-4 shadow-sm">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by title or category..." className="bg-transparent outline-none flex-1 font-medium text-sm" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                 <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
              </div>
            ) : blogs.length > 0 ? blogs.map((blog) => (
              <div 
                key={blog._id}
                className="group p-5 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex justify-between items-center hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${blog.published ? 'bg-green-500/10 text-green-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    {blog.published ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{blog.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <span className="text-indigo-500">{blog.category}</span>
                       <span>•</span>
                       <span>/{blog.slug}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentBlog(blog); }}
                    className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
                 <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h4 className="text-slate-400 font-bold">No articles found in your collection</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[90vh] border border-white/20">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                 <div>
                    <h3 className="text-xl font-black tracking-tight">{currentBlog.title || "Untitled Draft"}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Live Preview Engine</p>
                 </div>
                 <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <XCircle className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12 prose dark:prose-invert max-w-none prose-indigo">
                 <div dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                 Trackode Real-time Rendering
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
